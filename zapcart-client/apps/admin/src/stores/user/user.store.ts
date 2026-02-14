import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserStore, User } from './user.types';

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            // Initial state
            user: null,

            // Actions
            setUser: (user: User) => {
                set({ user });
            },

            clearUser: () => {
                set({ user: null });
            },
        }),
        {
            name: 'admin-user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
