const Banner = require('../models/Banner');
const { cloudinary } = require('../config/cloudinary');

exports.getBanners = async (req, res) => {
  const { placement } = req.query;
  const query = { isActive: true };
  if (placement) query.placement = placement;
  const banners = await Banner.find(query).sort('sortOrder');
  res.json({ success: true, banners });
};

exports.createBanner = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Banner image required' });
  const banner = await Banner.create({ ...req.body, image: req.file.path, imagePublicId: req.file.filename });
  res.status(201).json({ success: true, banner });
};

exports.updateBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
  if (req.file) {
    if (banner.imagePublicId) await cloudinary.uploader.destroy(banner.imagePublicId);
    banner.image = req.file.path;
    banner.imagePublicId = req.file.filename;
  }
  Object.assign(banner, req.body);
  await banner.save();
  res.json({ success: true, banner });
};

exports.deleteBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
  if (banner.imagePublicId) await cloudinary.uploader.destroy(banner.imagePublicId);
  await banner.deleteOne();
  res.json({ success: true, message: 'Banner deleted' });
};

exports.getAllBanners = async (req, res) => {
  const banners = await Banner.find().sort('sortOrder');
  res.json({ success: true, banners });
};
