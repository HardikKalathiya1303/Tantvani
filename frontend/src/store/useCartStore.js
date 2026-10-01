import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

// Helper to normalize server cart item structure into flat product object with quantity
const formatServerCartItems = (serverCart) => {
  if (!serverCart || !Array.isArray(serverCart.items)) return [];
  return serverCart.items
    .filter((item) => item.product && typeof item.product === 'object')
    .map((item) => ({
      ...item.product,
      _id: item.product._id,
      quantity: item.quantity || 1,
      cartItemId: item._id,
    }));
};

const isUserLoggedIn = () => {
  return !!localStorage.getItem('token');
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      // Fetch cart from backend if authenticated
      fetchCart: async () => {
        if (!isUserLoggedIn()) return;
        set({ isLoading: true });
        try {
          const { data } = await api.get('/cart');
          if (data?.cart) {
            const formattedItems = formatServerCartItems(data.cart);
            set({ items: formattedItems, isLoading: false });
          }
        } catch (err) {
          console.error('Failed to fetch cart from server:', err);
          set({ isLoading: false });
        }
      },

      // Add item to cart (Optimistic update + Backend API sync)
      addItem: async (product, quantity = 1) => {
        const currentItems = get().items;
        const productId = product._id;
        const existing = currentItems.find((i) => i._id === productId);

        let updatedItems;
        if (existing) {
          updatedItems = currentItems.map((i) =>
            i._id === productId ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else {
          updatedItems = [...currentItems, { ...product, quantity }];
        }

        // 1. Optimistic Local State Update for 0ms lag
        set({ items: updatedItems });

        // 2. If logged in, sync with Backend API
        if (isUserLoggedIn()) {
          try {
            const { data } = await api.post('/cart/add', {
              productId,
              quantity,
            });
            if (data?.cart) {
              set({ items: formatServerCartItems(data.cart) });
            }
          } catch (err) {
            console.error('Failed to add item to server cart:', err);
          }
        }
      },

      // Update quantity of an item
      updateQuantity: async (productId, quantity) => {
        const currentItems = get().items;

        let updatedItems;
        if (quantity <= 0) {
          updatedItems = currentItems.filter((i) => i._id !== productId);
        } else {
          updatedItems = currentItems.map((i) =>
            i._id === productId ? { ...i, quantity } : i
          );
        }

        // 1. Optimistic Local Update
        set({ items: updatedItems });

        // 2. If logged in, sync with Backend API
        if (isUserLoggedIn()) {
          try {
            const { data } = await api.put('/cart/update', {
              productId,
              quantity,
            });
            if (data?.cart) {
              set({ items: formatServerCartItems(data.cart) });
            }
          } catch (err) {
            console.error('Failed to update quantity on server:', err);
          }
        }
      },

      // Remove specific item from cart
      removeItem: async (productId) => {
        const currentItems = get().items;
        set({ items: currentItems.filter((i) => i._id !== productId) });

        if (isUserLoggedIn()) {
          try {
            const { data } = await api.delete(`/cart/remove/${productId}`);
            if (data?.cart) {
              set({ items: formatServerCartItems(data.cart) });
            }
          } catch (err) {
            console.error('Failed to remove item from server:', err);
          }
        }
      },

      // Clear entire cart
      clearCart: async () => {
        set({ items: [] });

        if (isUserLoggedIn()) {
          try {
            await api.delete('/cart/clear');
          } catch (err) {
            console.error('Failed to clear server cart:', err);
          }
        }
      },

      // Sync guest local storage items to server upon user login
      syncWithBackend: async () => {
        if (!isUserLoggedIn()) return;
        const localItems = get().items;

        set({ isLoading: true });
        try {
          if (localItems.length > 0) {
            const { data } = await api.post('/cart/sync', { localItems });
            if (data?.cart) {
              set({ items: formatServerCartItems(data.cart), isLoading: false });
              return;
            }
          }
          // If no local items, just fetch server cart
          const { data } = await api.get('/cart');
          if (data?.cart) {
            set({ items: formatServerCartItems(data.cart), isLoading: false });
          }
        } catch (err) {
          console.error('Failed to sync cart with server:', err);
          set({ isLoading: false });
        }
      },

      get total() {
        return get().items.reduce(
          (sum, i) => sum + (i.discountPrice || i.price) * i.quantity,
          0
        );
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: 'tantvani-cart' }
  )
);
