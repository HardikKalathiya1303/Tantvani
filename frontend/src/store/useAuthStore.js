import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import { identifyUser } from '../utils/analytics';

// Dedup guard — prevents concurrent duplicate fetchMe calls
let _fetchMePromise = null;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
        identifyUser(user);
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          identifyUser(data.user);
          return data;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (name, email, password, phone) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', { name, email, password, phone });
          localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          identifyUser(data.user);
          return data;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try { await api.post('/auth/logout'); } catch {}
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        // If already fetching, return existing promise (dedup)
        if (_fetchMePromise) return _fetchMePromise;
        _fetchMePromise = (async () => {
          try {
            const { data } = await api.get('/auth/me');
            set({ user: data.user });
          } catch {
            set({ user: null, token: null });
          } finally {
            _fetchMePromise = null;
          }
        })();
        return _fetchMePromise;
      },
    }),
    { name: 'tantvani-auth', partialize: state => ({ token: state.token, user: state.user }) }
  )
);
