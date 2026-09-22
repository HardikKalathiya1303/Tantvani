const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const { getBanners, createBanner, updateBanner, deleteBanner, getAllBanners } = require('../controllers/bannerController');

router.get('/', getBanners);
router.get('/admin/all', protect, adminOnly, getAllBanners);
router.post('/', protect, adminOnly, upload.single('image'), createBanner);
router.put('/:id', protect, adminOnly, upload.single('image'), updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

module.exports = router;
