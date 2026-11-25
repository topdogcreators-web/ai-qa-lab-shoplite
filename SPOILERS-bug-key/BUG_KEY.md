# ShopLite — Bug Key (DO NOT SHOW TO THE AI)

Keep this file outside the AI's workspace and off screen until the analysis section.
6 planted bugs. Requirements R1, R3, R4, R5, R7, R12, R13, R14 work correctly —
any failing test on those is a FALSE POSITIVE (unless the test itself is wrong about the requirement).

| # | Requirement | What actually happens | How to reproduce |
|---|---|---|---|
| B1 | R2 | Unknown email shows "No account found for this email" (leaks which emails exist) | Log in with any unregistered email |
| B2 | R6 | 0 and negative quantities are accepted with no error; negative qty makes subtotal negative | Set a quantity to 0 or -3 |
| B3 | R8 | Total is not formatted: shows $29.939999999999998 or $49 instead of $29.94 / $49.00 (subtotal and discount are fine) | Add notebook + pens, or just the lamp |
| B4 | R9 | Promo is case-sensitive: "save10" is rejected | Enter save10 |
| B5 | R10 | Applying SAVE10 again stacks another 10% each click; message never says "Promo already applied". Stacked discount also survives emptying the cart | Click Apply twice |
| B6 | R11 | Checkout is disabled for a cart that was never filled, but stays ENABLED after you remove every item | Add an item, open cart, remove it |

Notes for scoring
- B3 is subtle: a test that only checks the subtotal will miss it.
- B6 only shows on the "emptied" path, not the "fresh empty cart" path — a good catch for exploratory thinking.
- B1 is a security-flavoured bug (user enumeration) — worth calling out on camera if the AI finds or misses it.
