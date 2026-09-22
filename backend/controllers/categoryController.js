const Category = require('../models/Category');
const { cloudinary } = require('../config/cloudinary');

exports.getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('sortOrder name');
  res.json({ success: true, categories });
};

exports.getCategory = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, category });
};

exports.createCategory = async (req, res) => {
  const image = req.file?.path || '';
  const imagePublicId = req.file?.filename || '';
  const category = await Category.create({ ...req.body, image, imagePublicId });
  res.status(201).json({ success: true, category });
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

  if (req.file) {
    if (category.imagePublicId) await cloudinary.uploader.destroy(category.imagePublicId);
    category.image = req.file.path;
    category.imagePublicId = req.file.filename;
  }
  Object.assign(category, req.body);
  await category.save();
  res.json({ success: true, category });
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  if (category.imagePublicId) await cloudinary.uploader.destroy(category.imagePublicId);
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
};
