import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
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

  const addItem = useCartStore(s => s.addItem);
  const user = useAuthStore(s => s.user);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then(r => r.data),
  });

  const reviewMutation = useMutation({
    mutationFn: () => api.post(`/products/${data.product._id}/reviews`, reviewForm),
    onSuccess: () => {
      toast.success('Review submitted!');
      qc.invalidateQueries(['product', slug]);
      setReviewForm({ rating: 5, comment: '' });
    },
    onError: err => toast.error(err.response?.data?.message || 'Error submitting review'),
  });

  const handleWishlist = async () => {
    if (!user) { toast.error('Please sign in first'); return; }
    try {
      await api.put(`/auth/wishlist/${data.product._id}`);
      setWishlisted(w => !w);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
    } catch { toast.error('Could not update wishlist'); }
  };

  if (isLoading) return (
    <div className="pb-24 bg-cream min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-portrait shimmer" />
            <div className="grid grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="aspect-square shimmer" />)}</div>
          </div>
          <div className="space-y-4 pt-4">{[...Array(7)].map((_, i) => <div key={i} className="h-6 shimmer rounded" style={{ width: `${[50, 85, 40, 95, 60, 70, 45][i]}%` }} />)}</div>
        </div>
      </div>
    </div>
  );

  if (!data?.product) return (
    <div className="pb-24 min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center px-4">
        <p className="font-cormorant text-4xl text-wine-dark mb-4">Product not found</p>
        <Link to="/collections" className="btn-primary">Back to Collections</Link>
      </div>
    </div>
  );

  const p = data.product;
  const price = p.discountPrice || p.price;
  const hasDiscount = p.discountPrice && p.discountPrice < p.price;

  const handleAddToCart = () => {
    addItem(p, quantity);
    toast.success(`${p.name} added to bag`);
  };

  return (
    <div className="pb-24 min-h-screen bg-cream">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 sm:mb-10 flex-wrap">
          <Link to="/" className="font-jost text-[10px] tracking-[0.15em] uppercase text-wine-dark/40 hover:text-wine transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-wine-dark/25 shrink-0" />
          <Link to="/collections" className="font-jost text-[10px] tracking-[0.15em] uppercase text-wine-dark/40 hover:text-wine transition-colors">Collections</Link>
          <ChevronRight className="w-3 h-3 text-wine-dark/25 shrink-0" />
          {p.category && (
            <>
              <Link to={`/collections?category=${p.category._id}`} className="font-jost text-[10px] tracking-[0.15em] uppercase text-wine-dark/40 hover:text-wine transition-colors">{p.category.name}</Link>
              <ChevronRight className="w-3 h-3 text-wine-dark/25 shrink-0" />
            </>
          )}
          <span className="font-jost text-[10px] tracking-[0.15em] uppercase text-wine-dark truncate max-w-[160px] sm:max-w-none">{p.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
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

        <ProductTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          product={p}
          user={user}
          reviewForm={reviewForm}
          setReviewForm={setReviewForm}
          reviewMutation={reviewMutation}
        />
      </div>

      <ProductZoomModal
        showZoom={showZoom}
        setShowZoom={setShowZoom}
        product={p}
        activeImage={activeImage}
      />
    </div>
  );
}
