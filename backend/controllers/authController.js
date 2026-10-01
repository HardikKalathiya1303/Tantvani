const User = require('../models/User');
const crypto = require('crypto');

const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    },
  });
};

exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

  const user = await User.create({ name, email, password, phone });
  sendToken(user, 201, res);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  sendToken(user, 200, res);
};

exports.logout = (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name images price discountPrice');
  res.json({ success: true, user });
};

exports.updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true, runValidators: true });
  res.json({ success: true, user });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password incorrect' });
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
};

exports.addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  // If first address or requested default, set as default
  const isFirst = !user.addresses || user.addresses.length === 0;
  if (req.body.isDefault || isFirst) {
    user.addresses.forEach(a => (a.isDefault = false));
    req.body.isDefault = true;
  }
  user.addresses.push(req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses, newAddress: user.addresses[user.addresses.length - 1] });
};

exports.updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const addr = user.addresses.id(req.params.id);
  if (!addr) {
    return res.status(404).json({ success: false, message: 'Address not found' });
  }
  if (req.body.isDefault) {
    user.addresses.forEach(a => (a.isDefault = false));
  }
  Object.assign(addr, req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
};

exports.setDefaultAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.forEach(a => {
    a.isDefault = a._id.toString() === req.params.id;
  });
  await user.save();
  res.json({ success: true, addresses: user.addresses });
};

exports.removeAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const wasDefault = user.addresses.find(a => a._id.toString() === req.params.id)?.isDefault;
  user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }
  await user.save();
  res.json({ success: true, addresses: user.addresses });
};

exports.toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const idx = user.wishlist.indexOf(productId);
  if (idx === -1) {
    user.wishlist.push(productId);
  } else {
    user.wishlist.splice(idx, 1);
  }
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
};

exports.clearWishlist = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { wishlist: [] },
    { new: true }
  );
  res.json({ success: true, wishlist: [] });
};

