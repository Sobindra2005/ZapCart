import { StateCreator } from 'zustand';

export interface AuthState {
    isAuthenticated: boolean;
}

export interface AuthActions {
    login: () => void;
    logout: () => void;
}

export type AuthStore = AuthState & AuthActions;

export type AuthSlice = StateCreator<AuthStore, [['zustand/persist', unknown]], [], AuthStore>;
