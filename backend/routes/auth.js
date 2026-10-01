const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register, login, logout, getMe, updateProfile,
  changePassword, addAddress, updateAddress, setDefaultAddress, removeAddress, toggleWishlist, clearWishlist,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/address', protect, addAddress);
router.put('/address/:id', protect, updateAddress);
router.put('/address/:id/default', protect, setDefaultAddress);
router.delete('/address/:id', protect, removeAddress);
router.delete('/wishlist/clear', protect, clearWishlist);
router.put('/wishlist/:productId', protect, toggleWishlist);

module.exports = router;
