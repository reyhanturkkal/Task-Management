import { create } from 'zustand';

interface UserState {
  token: string | null;
  setAuthenticated: (token: string) => void;
  checkToken: () => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  token: null,
  setAuthenticated: (token: string) => {
    if (!token) {
        return;
    }
    localStorage.setItem(`accessToken`, token)

    set(function(state) {
        return { ...state, token }
    })
  },
  checkToken: () => {
    const tokenFromLocalStorage = localStorage.getItem('accessToken');

    if (tokenFromLocalStorage) {
      set({ token: tokenFromLocalStorage });
    } else {
      set((state) => ({ ...state, token: null }));
    }
  },
  signOut: () => {
    localStorage.removeItem('accessToken');
    set(() => ({ isAuthenticated: false, token: null }));
  },
}));
