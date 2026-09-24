const mongoose = require('mongoose');
const slugify = require('slugify');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name required'], trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  fabric: { type: String },
  occasion: [{ type: String }],
  color: [{ type: String }],
  work: { type: String },
  blouseIncluded: { type: Boolean, default: false },
  length: { type: Number },
  care: { type: String },
  origin: { type: String, default: 'India' },
  sku: { type: String, unique: true },
  stock: { type: Number, default: 0 },
  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String },
      alt: { type: String },
    },
  ],
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

productSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
  }
};

productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ isActive: 1, isNewArrival: 1, createdAt: -1 });
productSchema.index({ isActive: 1, isBestseller: 1, soldCount: -1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1, isActive: 1 });
productSchema.index({ fabric: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
