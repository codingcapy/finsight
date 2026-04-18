import { create } from "zustand";
import { type DeserializedUser as User } from "../lib/api/types";
import { api } from "../lib/api/client";
import { setSession } from "../services/jwt.service";

const useAuthStore = create<{
  user: User | null;
  authLoading: boolean;
  tokenLoading: boolean;
  setUser: (args: User) => void;
  logoutService: () => void;
  loginService: (email: string, password: string) => void;
  loginWithToken: () => void;
}>((set, get) => ({
  user: null,
  authLoading: false,
  tokenLoading: true,
  setUser: (args) => set({ user: args }),
  logoutService: () => {
    setSession(null);
    set({ user: null, authLoading: false, tokenLoading: false });
  },
  loginService: async (email, password) => {
    set({ authLoading: true });
    try {
      const res = await api.post("/user/login", {
        email,
        password,
      });
      if (res.data.result?.user && res.data.result?.token) {
        setSession(res.data.result?.token);
        set({ user: res.data.result?.user, authLoading: false });
      } else {
        set({ authLoading: false, user: null });
      }
    } catch (err) {
      console.log(err);
      set({ authLoading: false });
    }
  },
  loginWithToken: async () => {
    try {
      const res = await api.post("/user/validation");
      if (res.data.result?.user && res.data.result?.token) {
        setSession(res.data.result?.token);
        set({ user: res.data.result?.user, tokenLoading: false });
      } else {
        set({ tokenLoading: false, user: null });
      }
    } catch (err) {
      console.log(err);
      get().logoutService();
    }
  },
}));

export default useAuthStore;
