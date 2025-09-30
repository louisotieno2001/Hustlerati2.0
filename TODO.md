# TODO: Implement Place Order Functionality in Cart

## Frontend Changes (public/javascript/cart.js)
- [x] Modify #checkoutForm submit handler to collect order IDs from DOM
- [x] Collect form data: paymentMethod, deliveryLocation, deliveryAddress, mapLocation
- [x] Compute total from DOM (.summary-row.total)
- [x] Send POST request to /cart/checkout with payload: { orderIds, total, paymentMethod, deliveryLocation, mapLocation, deliveryAddress }
- [x] Handle success: show notification, redirect to /dashboard
- [x] Handle error: show error notification

## Backend Changes (routes/cart.js)
- [x] Add POST /cart/checkout route handler
- [x] Extract userId from req.session.user.id
- [x] Verify orderIds belong to user and are pending
- [x] For each orderId: fetch order and product details, compute subtotal
- [x] PATCH each order with: status='paid', amount_paid=subtotal, payment_method, delivery_location, map_location, delivery_address
- [x] Return success if all updates succeed, else error

## Testing
- [x] Test full flow: add to cart, checkout, verify orders updated in DB
- [x] Handle edge cases: empty cart, invalid data, unauth user
