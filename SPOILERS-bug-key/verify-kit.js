// Pre-recording check: every planted bug reproduces, every "working" requirement works.
// Usage: node verify-kit.js [baseURL]
const { chromium } = require("@playwright/test");
const BASE = process.argv[2] || "http://localhost:8080";

const results = [];
const check = (id, label, ok, detail) => results.push({ id, label, ok, detail });

async function fresh(browser) {
  const page = await browser.newPage();
  await page.goto(BASE);
  return page;
}
async function login(page, email = "demo@shoplite.test", pw = "Passw0rd!") {
  await page.fill("#email", email);
  await page.fill("#password", pw);
  await page.click("#login-btn");
}
const add = (page, id) => page.click(`[data-testid=product-${id}] button`);
const text = (page, sel) => page.locator(sel).innerText();

(async () => {
  const browser = await chromium.launch();
  let p;

  // R1, R3, R4
  p = await fresh(browser);
  check("R3", "Login disabled until both fields filled", await p.isDisabled("#login-btn"));
  await p.fill("#email", "demo@shoplite.test");
  check("R3", "Still disabled with only email", await p.isDisabled("#login-btn"));
  await login(p);
  check("R1", "Valid login lands on Products", await p.isVisible("#view-products"));
  const prices = await p.locator(".products .price").allInnerTexts();
  check("R4", "4 products, $0.00 prices", prices.length === 4 && prices.every(x => /^\$\d+\.\d{2}$/.test(x)), prices.join(" "));

  // R5
  await add(p, "notebook"); await add(p, "notebook"); await add(p, "pens");
  check("R5", "Badge = sum of quantities", (await text(p, "[data-testid=cart-badge]")) === "3");

  // B3 (R8) — 19.99 + 9.95
  p = await fresh(browser); await login(p);
  await add(p, "notebook"); await add(p, "pens"); await p.click("#nav-cart");
  let total = await text(p, "[data-testid=cart-total]");
  check("B3", "Total unformatted (notebook+pens)", total !== "$29.94", `total="${total}" subtotal="${await text(p, "[data-testid=subtotal]")}"`);
  p = await fresh(browser); await login(p);
  await add(p, "lamp"); await p.click("#nav-cart");
  total = await text(p, "[data-testid=cart-total]");
  check("B3", "Total unformatted (lamp)", total === "$49", `total="${total}"`);

  // B4 (R9), B5 (R10)
  await p.fill("#promo", "save10"); await p.click("#apply-promo");
  check("B4", "Lower-case save10 rejected", (await text(p, "#promo-msg")).includes("not recognised"), await text(p, "#promo-msg"));
  await p.fill("#promo", "SAVE10"); await p.click("#apply-promo");
  const d1 = await text(p, "[data-testid=discount]");
  await p.click("#apply-promo");
  const d2 = await text(p, "[data-testid=discount]");
  check("B5", "Second apply stacks discount", d1 !== d2 && !(await text(p, "#promo-msg")).includes("already"), `${d1} -> ${d2}`);

  // B2 (R6) + R6 upper bound works
  p = await fresh(browser); await login(p);
  await add(p, "notebook"); await p.click("#nav-cart");
  const qty = p.getByLabel("Quantity for Dot-grid notebook");
  await qty.fill("11"); await qty.press("Enter");
  check("R6", "Qty 11 rejected with message", (await text(p, "#qty-error")).includes("between 1 and 10") && (await qty.inputValue()) === "1");
  await qty.fill("-3"); await qty.press("Enter");
  check("B2", "Qty -3 accepted, negative subtotal", (await text(p, "#qty-error")) === "", `subtotal="${await text(p, "[data-testid=subtotal]")}"`);

  // R11 fresh path works, B6 emptied path broken; R7 remove
  p = await fresh(browser); await login(p);
  await p.click("#nav-cart");
  check("R11", "Checkout disabled on never-filled cart", await p.isDisabled("#checkout-btn"));
  await p.click("#nav-products"); await add(p, "mat"); await p.click("#nav-cart");
  await p.getByLabel("Remove Desk mat").click();
  check("R7", "Remove updates badge", (await text(p, "[data-testid=cart-badge]")) === "0");
  check("B6", "Checkout ENABLED after removing all items", await p.isEnabled("#checkout-btn"));

  // R12, R13, R14
  p = await fresh(browser); await login(p);
  await add(p, "pens"); await p.click("#nav-cart"); await p.click("#checkout-btn");
  await p.click("#place-order");
  check("R12", "Missing name message", (await text(p, "#checkout-error")) === "Enter your full name");
  await p.fill("#full-name", "Ada Lovelace"); await p.fill("#checkout-email", "ada@nope"); await p.click("#place-order");
  check("R12", "Invalid email message", (await text(p, "#checkout-error")) === "Enter a valid email");
  await p.fill("#checkout-email", "ada@example.com"); await p.click("#place-order");
  const order = await text(p, "[data-testid=order-number]");
  check("R13", "Order number SL-######, cart emptied", /^SL-\d{6}$/.test(order) && (await text(p, "[data-testid=cart-badge]")) === "0", order);
  await add(p, "pens").catch(() => {});
  await p.click("#continue-shopping"); await add(p, "pens"); await p.click("#logout");
  check("R14", "Logout -> login page", await p.isVisible("#view-login"));
  await login(p);
  check("R14", "Cart cleared after logout", (await text(p, "[data-testid=cart-badge]")) === "0");

  // B1 (R2) + R2 wrong-password path works
  p = await fresh(browser);
  await login(p, "nobody@shoplite.test", "x");
  check("B1", "Unknown email leaks 'No account found'", (await text(p, "#login-error")).includes("No account found"), await text(p, "#login-error"));
  await login(p, "demo@shoplite.test", "wrong");
  check("R2", "Wrong password shows generic message", (await text(p, "#login-error")) === "Invalid email or password");

  await browser.close();
  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.id.padEnd(4)} ${r.label}${r.detail ? `   [${r.detail}]` : ""}`);
  const bad = results.filter(r => !r.ok);
  console.log(`\n${results.length - bad.length}/${results.length} kit checks OK`);
  process.exit(bad.length ? 1 : 0);
})();
