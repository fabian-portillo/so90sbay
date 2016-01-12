# Routes
 * GET /cart/ - gets the currently authed user's shopping cart
 * POST /cart/ - adds a product specified by req.body.productId to the cart (with quantity req.body.quantity)
 * PUT /cart/ - updates the product req.body.productId's quantity to req.body.quantity
 * DELETE /cart/ - removes the product req.body.productId from a user's shopping cart
 * POST /cart/checkout - checks out with a PurchaseInfo object

# States
 * /cart/ - lists all items in a user's shopping cart and lets them modify the quantities/products