// Bargain Beacon — wiring. Reads the controls, asks filters.js for the
// view, and asks render.js to paint it. Hash routes: #/ is the list,
// #/deal/<id> is one deal's detail page.

import { DEALS, CATEGORIES, STORES, CHECKED_DAY } from "./data.js";
import { applyFilters, sortDeals } from "./filters.js";
import { listHtml, detailHtml, countLine } from "./render.js";

const state = {
  query: "",
  category: "All",
  store: "All",
  minDiscount: 0,
  newLowsOnly: false,
  sort: "discount",
};

function el(id) {
  return document.getElementById(id);
}

function fillSelect(select, values) {
  select.innerHTML = values
    .map((v) => '<option value="' + v + '">' + v + "</option>")
    .join("");
}

function fillChips() {
  el("cats").innerHTML = CATEGORIES.map(
    (c) =>
      '<button type="button" class="chip' +
      (state.category === c ? " on" : "") +
      '" data-cat="' +
      c +
      '">' +
      c +
      "</button>"
  ).join("");
}

function currentList() {
  return sortDeals(applyFilters(DEALS, state), state.sort);
}

function paint() {
  fillChips();
  const hash = window.location.hash || "#/";
  const main = el("main");
  if (hash.startsWith("#/deal/")) {
    const id = decodeURIComponent(hash.slice(7));
    const deal = DEALS.find((d) => d.id === id);
    main.innerHTML = deal
      ? detailHtml(deal, DEALS)
      : '<p class="empty">That deal is not in this finder. <a href="#/">Back to all deals</a>.</p>';
    el("count").textContent = "";
    return;
  }
  const list = currentList();
  main.innerHTML = listHtml(list);
  el("count").textContent = countLine(list.length, DEALS.length);
}

function bind() {
  el("q").addEventListener("input", (e) => {
    state.query = e.target.value;
    paint();
  });
  el("store").addEventListener("change", (e) => {
    state.store = e.target.value;
    paint();
  });
  el("mindisc").addEventListener("change", (e) => {
    state.minDiscount = Number(e.target.value);
    paint();
  });
  el("sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    paint();
  });
  el("newlows").addEventListener("change", (e) => {
    state.newLowsOnly = e.target.checked;
    paint();
  });
  el("cats").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    paint();
  });
  window.addEventListener("hashchange", paint);
}

// A shared link can carry a search: ?q=headphones opens the finder
// already searching for it.
const shared = new URLSearchParams(window.location.search).get("q");
if (shared) {
  state.query = shared;
  el("q").value = shared;
}

fillSelect(el("store"), STORES);
el("checked-day").textContent = "Prices checked " + CHECKED_DAY + ".";
bind();
paint();
