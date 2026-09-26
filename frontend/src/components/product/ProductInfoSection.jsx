import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Truck, RotateCcw, Shield } from 'lucide-react';

export default function ProductInfoSection({
  product,
  price,
  hasDiscount,
  quantity,
  setQuantity,
  handleAddToCart,
  handleWishlist,
  wishlisted,
}) {
  return (
    <div className="space-y-5 sm:space-y-6">
      {product.category && (
        <p className="font-jost text-[10px] tracking-[0.25em] uppercase text-gold">{product.category.name}</p>
      )}
      <h1 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-light text-wine-dark leading-tight">{product.name}</h1>

      {product.numReviews > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-gold text-gold' : 'text-cream-darker'}`} />
            ))}
          </div>
          <span className="font-karla text-sm text-wine-dark/50">({product.numReviews} reviews)</span>
        </div>
      )}

      <div className="flex items-baseline gap-4">
        <span className="font-cormorant text-3xl sm:text-4xl text-wine">₹{price.toLocaleString('en-IN')}</span>
        {hasDiscount && (
          <>
            <span className="font-karla text-lg text-wine-dark/35 line-through">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="font-jost text-[10px] tracking-[0.12em] uppercase bg-wine/10 text-wine px-2 py-1">
              {Math.round((1 - product.discountPrice / product.price) * 100)}% off
            </span>
          </>
        )}
      </div>

      <div className="w-16 h-px bg-gold/50" />

      {product.shortDescription && (
        <p className="font-karla text-sm text-wine-dark/65 leading-relaxed">{product.shortDescription}</p>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          ['Fabric', product.fabric],
          ['Work', product.work],
          ['Length', product.length ? `${product.length} metres` : null],
          ['Blouse', product.blouseIncluded ? 'Included' : 'Not Included'],
          ['Origin', product.origin],
          ['SKU', product.sku],
        ].filter(([, v]) => v).map(([k, v]) => (
          <div key={k}>
            <span className="font-jost text-[9px] tracking-[0.2em] uppercase text-wine-dark/45">{k}</span>
            <p className="font-karla text-wine-dark mt-0.5">{v}</p>
          </div>
        ))}
      </div>

      {product.occasion?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.occasion.map(o => (
            <Link
              key={o}
              to={`/collections?occasion=${o}`}
              className="font-jost text-[9px] tracking-[0.18em] uppercase px-3 py-1.5 border border-cream-darker/60 text-wine-dark/55 hover:border-wine hover:text-wine transition-colors"
            >
              {o}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-cream-darker/60">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-3 hover:bg-cream-dark transition-colors font-karla text-wine-dark/60"
            aria-label="Decrease"
          >−</button>
          <span className="px-5 py-3 font-karla text-sm border-x border-cream-darker/60 min-w-[3rem] text-center text-wine-dark">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-4 py-3 hover:bg-cream-dark transition-colors font-karla text-wine-dark/60"
            aria-label="Increase"
          >+</button>
        </div>
        <span className="font-karla text-xs text-wine-dark/45">
          {product.stock > 0 ? `${product.stock} in stock` : <span className="text-red-500">Out of stock</span>}
        </span>
      </div>

      <div className="flex gap-3 sm:gap-4">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 bg-wine text-cream-light py-4 font-jost text-[11px] tracking-[0.22em] uppercase flex items-center justify-center gap-2 hover:bg-wine-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-4 h-4" /> Add to Bag
        </motion.button>
        <button
          onClick={handleWishlist}
          className={`w-14 h-14 border flex items-center justify-center hover:border-wine hover:text-wine transition-all ${wishlisted ? 'border-wine bg-wine/5 text-wine' : 'border-cream-darker/60 text-wine-dark/40'}`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-5 h-5 transition-all ${wishlisted ? 'fill-wine' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-cream-darker/40">
        {[
          [Truck, 'Free Shipping', '₹2000+'],
          [RotateCcw, 'Easy Returns', '15 days'],
          [Shield, 'Authentic', 'Guaranteed'],
        ].map(([Icon, label, sub]) => (
          <div key={label} className="text-center p-2 sm:p-3">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5 text-gold" />
            <p className="font-jost text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-wine-dark">{label}</p>
            <p className="font-karla text-[10px] text-wine-dark/40">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
