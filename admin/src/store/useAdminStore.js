import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

export const useAdminStore = create(
  persist(
    (set) => ({
      admin: null,
      token: null,

      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.user?.role !== 'admin') throw new Error('Admin access required');
        localStorage.setItem('admin_token', data.token);
        set({ admin: data.user, token: data.token });
        return data;
      },

      logout: () => {
        localStorage.removeItem('admin_token');
        set({ admin: null, token: null });
      },
    }),
    { name: 'tantvani-admin', partialize: s => ({ token: s.token, admin: s.admin }) }
  )
);
