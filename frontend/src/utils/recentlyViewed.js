/**
 * Recently Viewed Products Manager
 * Saves and retrieves the last 10 viewed sarees from localStorage
 */

const STORAGE_KEY = 'tantvani_recently_viewed';
const MAX_ITEMS = 10;

export const getRecentlyViewed = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load recently viewed:', err);
    return [];
  }
};

export const addToRecentlyViewed = (product) => {
  if (typeof window === 'undefined' || !product || !product._id) return;
  try {
    const current = getRecentlyViewed();
    // Remove if already exists to push to front
    const filtered = current.filter((p) => p._id !== product._id);
    
    // Store concise lightweight snapshot
    const itemSnapshot = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      fabric: product.fabric,
      category: typeof product.category === 'object' ? product.category?.name : product.category,
      images: product.images?.slice(0, 2) || [{ url: product.image || '' }],
      image: product.images?.[0]?.url || product.image || '',
      isNewArrival: product.isNewArrival,
      isBestseller: product.isBestseller,
    };

    const updated = [itemSnapshot, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save recently viewed product:', err);
  }
};
