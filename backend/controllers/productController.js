const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

exports.getProducts = async (req, res) => {
  const { page = 1, limit = 12, category, search, sort, minPrice, maxPrice, fabric, occasion, color, featured, newArrival, bestseller } = req.query;
  const query = { isActive: true };

  if (category) query.category = category;
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }, { tags: { $in: [new RegExp(search, 'i')] } }];
  if (minPrice || maxPrice) query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);
  if (fabric) query.fabric = { $in: fabric.split(',').map(f => new RegExp(f.trim(), 'i')) };
  if (occasion) query.occasion = { $in: occasion.split(',').map(o => new RegExp(o.trim(), 'i')) };
  if (color) query.color = { $in: color.split(',').map(c => new RegExp(c.trim(), 'i')) };
  if (featured === 'true') query.isFeatured = true;
  if (newArrival === 'true') query.isNewArrival = true;
  if (bestseller === 'true') query.isBestseller = true;

  let sortObj = {};
  if (sort === 'price_asc') sortObj = { price: 1 };
  else if (sort === 'price_desc') sortObj = { price: -1 };
  else if (sort === 'newest') sortObj = { createdAt: -1 };
  else if (sort === 'rating') sortObj = { rating: -1 };
  else sortObj = { createdAt: -1 };

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sortObj)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

exports.getProduct = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category', 'name slug');
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
};

exports.createProduct = async (req, res) => {
  const body = { ...req.body };
  if (typeof body.occasion === 'string') {
    try { body.occasion = JSON.parse(body.occasion); } catch { body.occasion = body.occasion.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof body.color === 'string') {
    try { body.color = JSON.parse(body.color); } catch { body.color = body.color.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof body.tags === 'string') {
    try { body.tags = JSON.parse(body.tags); } catch { body.tags = body.tags.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (body.category && typeof body.category === 'object' && body.category._id) {
    body.category = body.category._id;
  }
  const images = req.files?.map(f => ({ url: f.path, publicId: f.filename })) || [];
  const product = await Product.create({ ...body, images });
  res.status(201).json({ success: true, product });
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const body = { ...req.body };
  if (typeof body.occasion === 'string') {
    try { body.occasion = JSON.parse(body.occasion); } catch { body.occasion = body.occasion.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof body.color === 'string') {
    try { body.color = JSON.parse(body.color); } catch { body.color = body.color.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof body.tags === 'string') {
    try { body.tags = JSON.parse(body.tags); } catch { body.tags = body.tags.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (body.category && typeof body.category === 'object' && body.category._id) {
    body.category = body.category._id;
  }

  const newImages = req.files?.map(f => ({ url: f.path, publicId: f.filename })) || [];
  if (body.removeImages) {
    let toRemove = [];
    try { toRemove = JSON.parse(body.removeImages); } catch { toRemove = [body.removeImages]; }
    for (const pid of toRemove) {
      if (pid) await cloudinary.uploader.destroy(pid).catch(() => {});
    }
    product.images = product.images.filter(img => !toRemove.includes(img.publicId));
  }
  product.images = [...product.images, ...newImages];
  delete body.removeImages;
  delete body.images;
  Object.assign(product, body);
  await product.save();
  res.json({ success: true, product });
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  for (const img of product.images) {
    if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
};

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const exists = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (exists) return res.status(400).json({ success: false, message: 'Already reviewed' });

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.calculateRating();
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
};

exports.getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true }).populate('category', 'name slug').limit(8);
  res.json({ success: true, products });
};

exports.getNewArrivals = async (req, res) => {
  const products = await Product.find({ isActive: true, isNewArrival: true }).populate('category', 'name slug').sort({ createdAt: -1 }).limit(8);
  res.json({ success: true, products });
};

exports.getBestsellers = async (req, res) => {
  const products = await Product.find({ isActive: true, isBestseller: true }).populate('category', 'name slug').sort({ soldCount: -1 }).limit(8);
  res.json({ success: true, products });
};
