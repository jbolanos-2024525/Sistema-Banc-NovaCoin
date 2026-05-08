import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginRequest } from '../../../shared/apis/authService';



export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            setTokens: (accessToken, refreshToken) =>
                set({
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                }),

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null
                });
            },

            login: async ({ emailOrUsername, password }) => {
                try {
                    set({ loading: true, error: null });


                    const response = await loginRequest({
                        emailOrUsername,
                        password,
                    });



                    const { userDetails, accessToken, refreshToken } = response.data;

                    set({
                        user: userDetails,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        loading: false,
                    });

                    return { success: true };
                } catch (err) {
                    const message = err.response?.data?.message || "Error al iniciar sesión";
                    set({ error: message, loading: false });
                    return { success: false, error: message };
                }
            },
        }),
                {
                    name: 'auth-storage-bank',

                    partialize: (state) => ({
                        user: state.user,
                        accessToken: state.accessToken,
                        refreshToken: state.refreshToken,
                        isAuthenticated: state.isAuthenticated,
                    }),
                }


    )
);