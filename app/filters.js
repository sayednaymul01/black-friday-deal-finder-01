// Filtering and sorting for the deal list. Pure functions over the deals
// array — the page never mutates the data, it only asks for a view of it.

import { discountPct } from "./signal.js";

export function applyFilters(deals, opts) {
  const q = (opts.query || "").trim().toLowerCase();
  return deals.filter((d) => {
    if (opts.category && opts.category !== "All" && d.category !== opts.category)
      return false;
    if (opts.store && opts.store !== "All" && d.store !== opts.store) return false;
    if (opts.minDiscount && discountPct(d) < opts.minDiscount) return false;
    if (opts.newLowsOnly && d.signal !== "new-low") return false;
    if (q) {
      const hay = (d.name + " " + d.store + " " + d.category).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortDeals(deals, sort) {
  const list = deals.slice();
  if (sort === "discount") {
    list.sort((a, b) => discountPct(b) - discountPct(a));
  } else if (sort === "savings") {
    list.sort((a, b) => b.was - b.sale - (a.was - a.sale));
  } else if (sort === "price-low") {
    list.sort((a, b) => a.sale - b.sale);
  } else if (sort === "price-high") {
    list.sort((a, b) => b.sale - a.sale);
  }
  return list;
}

// Same product at more than one store? Group by name so the detail view can
// show the comparison. Here each product appears once, so this returns the
// deal itself plus an empty comparison list — kept as a function so a second
// store's price for the same product slots in without touching the render.
export function compareAcrossStores(deals, deal) {
  return deals.filter((d) => d.id !== deal.id && d.name === deal.name);
}
