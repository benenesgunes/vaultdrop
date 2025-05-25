import { create } from 'zustand';

const getTokenFromStorage = () => localStorage.getItem('token') || null;

const useAuthStore = create(set => ({
  token: getTokenFromStorage(),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null });
  }
}));

export default useAuthStore;
