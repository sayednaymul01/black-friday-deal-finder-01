// Rendering: turns a list of deals into the cards and the detail view.
// All prices, percents and verdicts come from signal.js so the page can
// never show a discount that disagrees with its two prices.

import { CHECKED_DAY } from "./data.js";
import { discountPct, savedAmount, money, signalInfo, verdictLine } from "./signal.js";
import { compareAcrossStores } from "./filters.js";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function cardHtml(deal) {
  const pct = discountPct(deal);
  const info = signalInfo(deal);
  return (
    '<article class="card" data-id="' +
    esc(deal.id) +
    '">' +
    '<div class="card-top"><span class="store">' +
    esc(deal.store) +
    '</span><span class="signal sig-' +
    esc(deal.signal) +
    '">' +
    esc(info.short) +
    "</span></div>" +
    '<h3 class="card-name"><a href="#/deal/' +
    esc(deal.id) +
    '">' +
    esc(deal.name) +
    "</a></h3>" +
    '<p class="card-cat">' +
    esc(deal.category) +
    "</p>" +
    '<div class="prices"><span class="sale">' +
    money(deal.sale) +
    '</span><span class="was">' +
    money(deal.was) +
    '</span><span class="pct">-' +
    pct +
    "%</span></div>" +
    '<p class="save">You save ' +
    money(savedAmount(deal)) +
    "</p>" +
    '<p class="checked">Price checked ' +
    esc(CHECKED_DAY) +
    "</p>" +
    '<a class="go" href="' +
    esc(deal.url) +
    '" target="_blank" rel="noopener">View at ' +
    esc(deal.store) +
    " &rarr;</a>" +
    "</article>"
  );
}

export function listHtml(deals) {
  if (!deals.length) {
    return '<p class="empty">No deals match those filters. Try clearing the search or lowering the minimum discount.</p>';
  }
  return deals.map(cardHtml).join("");
}

export function detailHtml(deal, allDeals) {
  const pct = discountPct(deal);
  const info = signalInfo(deal);
  const others = compareAcrossStores(allDeals, deal);
  const compare =
    others.length === 0
      ? "<p>This is the only store in this finder carrying this product today — no cross-store comparison to show.</p>"
      : "<ul>" +
        others
          .map(
            (o) =>
              "<li>" +
              esc(o.store) +
              ": " +
              money(o.sale) +
              " (was " +
              money(o.was) +
              ")</li>"
          )
          .join("") +
        "</ul>";
  return (
    '<div class="detail">' +
    '<p><a class="back" href="#/">&larr; All deals</a></p>' +
    "<h2>" +
    esc(deal.name) +
    "</h2>" +
    '<p class="detail-meta">' +
    esc(deal.store) +
    " · " +
    esc(deal.category) +
    "</p>" +
    '<div class="prices big"><span class="sale">' +
    money(deal.sale) +
    '</span><span class="was">' +
    money(deal.was) +
    '</span><span class="pct">-' +
    pct +
    "%</span></div>" +
    "<p>You save " +
    money(savedAmount(deal)) +
    ".</p>" +
    '<p class="verdict"><strong>' +
    esc(info.label) +
    ".</strong> " +
    esc(verdictLine(deal)) +
    "</p>" +
    "<p>" +
    esc(deal.note) +
    "</p>" +
    '<p class="checked">Price checked ' +
    esc(CHECKED_DAY) +
    ". Source: " +
    esc(deal.source) +
    ".</p>" +
    "<h3>Same product elsewhere</h3>" +
    compare +
    '<a class="go big-go" href="' +
    esc(deal.url) +
    '" target="_blank" rel="noopener">View at ' +
    esc(deal.store) +
    " &rarr;</a>" +
    "</div>"
  );
}

export function countLine(shown, total) {
  return shown === total
    ? total + " deals"
    : shown + " of " + total + " deals";
}
