const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to populate cart product details
const populateCart = (query) => {
  return query.populate({
    path: 'items.product',
    select: 'name slug price discountPrice images stock fabric category blouseIncluded origin work',
    populate: { path: 'category', select: 'name slug' },
  });
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  let cart = await populateCart(Cart.findOne({ user: req.user._id }));

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // Filter out any items whose product may have been deleted
  const validItems = cart.items.filter((item) => item.product !== null);
  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  res.status(200).json({
    success: true,
    cart,
  });
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const price = product.discountPrice || product.price;
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += Number(quantity);
    cart.items[existingItemIndex].price = price;
  } else {
    cart.items.push({
      product: productId,
      quantity: Number(quantity),
      price,
    });
  }

  await cart.save();
  cart = await populateCart(Cart.findById(cart._id));

  res.status(200).json({
    success: true,
    message: `${product.name} added to cart`,
    cart,
  });
};

// @desc    Update item quantity
// @route   PUT /api/cart/update
// @access  Private
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item not found in cart' });
  }

  if (Number(quantity) <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = Number(quantity);
  }

  await cart.save();
  cart = await populateCart(Cart.findById(cart._id));

  res.status(200).json({
    success: true,
    cart,
  });
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  await cart.save();
  cart = await populateCart(Cart.findById(cart._id));

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    cart,
  });
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
    cart: { items: [] },
  });
};

// @desc    Sync guest local storage cart with DB cart on login
// @route   POST /api/cart/sync
// @access  Private
exports.syncCart = async (req, res) => {
  const { localItems = [] } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  for (const localItem of localItems) {
    const prodId = localItem._id || localItem.product?._id || localItem.product;
    if (!prodId) continue;

    const product = await Product.findById(prodId);
    if (!product) continue;

    const price = product.discountPrice || product.price;
    const existingIndex = cart.items.findIndex(
      (i) => i.product.toString() === prodId.toString()
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = Math.max(
        cart.items[existingIndex].quantity,
        Number(localItem.quantity || 1)
      );
      cart.items[existingIndex].price = price;
    } else {
      cart.items.push({
        product: prodId,
        quantity: Number(localItem.quantity || 1),
        price,
      });
    }
  }

  await cart.save();
  cart = await populateCart(Cart.findById(cart._id));

  res.status(200).json({
    success: true,
    message: 'Cart synchronized successfully',
    cart,
  });
};
