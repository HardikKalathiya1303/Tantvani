import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductInfoSection from '../components/product/ProductInfoSection';
import ProductTabs from '../components/product/ProductTabs';
import ProductZoomModal from '../components/product/ProductZoomModal';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showZoom, setShowZoom] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then((r) => r.data),
  });

  const categoryId = data?.product?.category?._id;

  const { data: relatedData } = useQuery({
    queryKey: ['relatedProducts', categoryId],
    queryFn: () =>
      api
        .get(`/products?category=${categoryId}&limit=4`)
        .then((r) => r.data),
    enabled: !!categoryId,
  });

  const reviewMutation = useMutation({
    mutationFn: () => api.post(`/products/${data.product._id}/reviews`, reviewForm),
    onSuccess: () => {
      toast.success('Thank you! Your verified review has been submitted.');
      qc.invalidateQueries(['product', slug]);
      setReviewForm({ rating: 5, comment: '' });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || 'Error submitting review'),
  });

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please sign in to save to your wishlist');
      return;
    }
    try {
      await api.put(`/auth/wishlist/${data.product._id}`);
      setWishlisted((w) => !w);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  if (isLoading)
    return (
      <div className="pb-24 bg-white min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            <div className="space-y-4">
              <div className="aspect-portrait shimmer rounded-2xl" />
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square shimmer rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-5 pt-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-7 shimmer rounded-lg"
                  style={{ width: `${[40, 85, 50, 95, 60, 75, 50, 90][i]}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  if (!data?.product)
    return (
      <div className="pb-24 min-h-screen flex items-center justify-center bg-white pt-20 sm:pt-24">
        <div className="text-center px-4 max-w-md">
          <p className="font-cormorant text-4xl text-wine-dark mb-3 font-light">
            Saree Not Found
          </p>
          <p className="font-karla text-sm text-wine-dark/60 mb-6">
            The weave you are searching for might have been acquired or relocated in our archives.
          </p>
          <Link to="/collections" className="btn-primary">
            Explore All Collections
          </Link>
        </div>
      </div>
    );

  const p = data.product;
  const price = p.discountPrice || p.price;
  const hasDiscount = p.discountPrice && p.discountPrice < p.price;

  const handleAddToCart = () => {
    addItem(p, quantity);
    toast.success(`${p.name} added to your bag`);
  };

  const relatedProducts = (relatedData?.products || []).filter(
    (item) => item._id !== p._id
  );

  return (
    <div className="pb-24 min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 mb-4 sm:mb-5 flex-wrap text-xs">
          <Link
            to="/"
            className="font-jost text-[11px] tracking-[0.15em] uppercase text-wine-dark/50 hover:text-wine transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-wine-dark/30 shrink-0" />
          <Link
            to="/collections"
            className="font-jost text-[11px] tracking-[0.15em] uppercase text-wine-dark/50 hover:text-wine transition-colors"
          >
            Collections
          </Link>
          <ChevronRight className="w-3 h-3 text-wine-dark/30 shrink-0" />
          {p.category && (
            <>
              <Link
                to={`/collections?category=${p.category._id}`}
                className="font-jost text-[11px] tracking-[0.15em] uppercase text-wine-dark/50 hover:text-wine transition-colors"
              >
                {p.category.name}
              </Link>
              <ChevronRight className="w-3 h-3 text-wine-dark/30 shrink-0" />
            </>
          )}
          <span className="font-jost text-[11px] tracking-[0.15em] uppercase text-wine font-medium truncate max-w-[200px] sm:max-w-none">
            {p.name}
          </span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          <ProductImageGallery
            product={p}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            setShowZoom={setShowZoom}
            hasDiscount={hasDiscount}
          />
          <ProductInfoSection
            product={p}
            price={price}
            hasDiscount={hasDiscount}
            quantity={quantity}
            setQuantity={setQuantity}
            handleAddToCart={handleAddToCart}
            handleWishlist={handleWishlist}
            wishlisted={wishlisted}
          />
        </div>

        {/* Collapsible Luxury Accordions */}
        <ProductTabs
          product={p}
          user={user}
          reviewForm={reviewForm}
          setReviewForm={setReviewForm}
          reviewMutation={reviewMutation}
        />

        {/* Related / You May Also Admire Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 sm:mt-14 pt-8 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
              <div>
                <span className="font-jost text-xs tracking-[0.25em] uppercase text-gold font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  Curated Ensemble
                </span>
                <h3 className="font-cormorant text-3xl sm:text-4xl text-wine-dark font-normal mt-1">
                  You May Also Admire
                </h3>
              </div>
              <Link
                to={p.category ? `/collections?category=${p.category._id}` : '/collections'}
                className="font-jost text-xs tracking-[0.18em] uppercase text-wine hover:text-wine-light font-semibold flex items-center gap-1.5 group"
              >
                <span>View Full Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((rel) => {
                const relPrice = rel.discountPrice || rel.price;
                return (
                  <Link
                    key={rel._id}
                    to={`/product/${rel.slug}`}
                    className="group block rounded-xl overflow-hidden bg-white border border-neutral-200/80 hover:border-gold/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-portrait overflow-hidden bg-neutral-100">
                      <img
                        src={rel.images?.[0]?.url || rel.image}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {rel.isNewArrival && (
                        <span className="absolute top-2.5 left-2.5 bg-gold text-wine-dark font-jost text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-sm font-semibold">
                          New
                        </span>
                      )}
                    </div>
                    <div className="p-3.5 space-y-1">
                      <p className="font-jost text-[10px] tracking-wider uppercase text-gold truncate">
                        {rel.fabric || rel.category?.name}
                      </p>
                      <h4 className="font-cormorant text-lg text-wine-dark font-medium line-clamp-1 group-hover:text-wine transition-colors">
                        {rel.name}
                      </h4>
                      <p className="font-cormorant text-lg font-semibold text-wine">
                        ₹{relPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Deep Zoom Modal */}
      <ProductZoomModal
        showZoom={showZoom}
        setShowZoom={setShowZoom}
        product={p}
        activeImage={activeImage}
        setActiveImage={setActiveImage}
      />
    </div>
  );
}
