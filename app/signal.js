// Deal signals: is this really a deal, and on what evidence?
// The signal is stored on each deal in data.js; this module turns it into
// the label and explanation the cards show, and computes the discount from
// the two prices so the percent shown always matches the prices.

export function discountPct(deal) {
  if (!deal.was || deal.was <= deal.sale) return 0;
  return Math.round((1 - deal.sale / deal.was) * 100);
}

export function savedAmount(deal) {
  return Math.max(0, deal.was - deal.sale);
}

export function money(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

const SIGNALS = {
  "new-low": {
    label: "New low",
    short: "NEW LOW",
    why: "Lowest price seen for this product in the roundups we checked.",
  },
  strong: {
    label: "Strong price",
    short: "STRONG",
    why: "A deep cut — 25% or more off the usual price.",
  },
  routine: {
    label: "Routine sale",
    short: "ROUTINE",
    why: "A real cut, but a small one — the usual holiday price, not a record.",
  },
};

export function signalInfo(deal) {
  return SIGNALS[deal.signal] || SIGNALS.routine;
}

// A one-line verdict for the detail view, built from the evidence.
export function verdictLine(deal) {
  const pct = discountPct(deal);
  const info = signalInfo(deal);
  return (
    money(deal.sale) +
    " against a usual " +
    money(deal.was) +
    " — " +
    pct +
    "% off, saving " +
    money(savedAmount(deal)) +
    ". " +
    info.why
  );
}
