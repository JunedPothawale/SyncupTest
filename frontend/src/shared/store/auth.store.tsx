import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    id: any;
    user: any;
    isAuthenticated: boolean;

    setAuth: (
        data: any
    ) => void;

    logout: () => void;
}

export const useAuthStore =
    create<AuthState>()(
        persist(
            (set) => ({
                id: null,
                user: null,
                isAuthenticated: false,
                setAuth: (data) => {
                    set({
                        id: data._id,
                        user: data,
                        isAuthenticated: true,
                    })
                },

                logout: async () => {

                    set({ id: null, user: null, isAuthenticated: false })
                }
            }),

            {
                name: "auth-storage",
            }
        )
    );