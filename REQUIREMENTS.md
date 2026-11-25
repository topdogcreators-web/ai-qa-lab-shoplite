# ShopLite — Requirements (v1.0)

ShopLite is a small single-page web shop for desk supplies.
App URL during testing: http://localhost:8080
Test account: demo@shoplite.test / Passw0rd!

## Login
- **R1** A user with valid credentials is taken to the Products page after clicking "Log in".
- **R2** Any failed login shows the same message, "Invalid email or password", whether the email is unknown or the password is wrong.
- **R3** The "Log in" button is disabled until both Email and Password contain a value.

## Products
- **R4** The Products page lists exactly 4 products, each with its name and price in the format $0.00.
- **R5** Clicking "Add to cart" adds the product to the cart. The cart badge in the header shows the total number of items (sum of quantities).

## Cart
- **R6** Each cart line has a quantity field. Allowed values are 1 to 10. Any other value shows "Quantity must be between 1 and 10" and the previous quantity is kept.
- **R7** "Remove" removes the line from the cart and updates the badge and totals.
- **R8** Subtotal, discount and total are always shown as currency with exactly two decimal places (e.g. $29.94).
- **R9** Promo code SAVE10 gives 10% off the subtotal. Promo codes are not case-sensitive.
- **R10** A promo code can be applied only once per order. Applying it again shows "Promo already applied" and does not change the discount.
- **R11** The "Checkout" button is disabled whenever the cart is empty.

## Checkout
- **R12** Checkout requires Full name and a valid email. Missing name shows "Enter your full name"; an invalid email shows "Enter a valid email".
- **R13** A successful order shows an order number in the format SL-###### (6 digits) and empties the cart.

## Session
- **R14** "Log out" returns the user to the Login page and clears the cart.
