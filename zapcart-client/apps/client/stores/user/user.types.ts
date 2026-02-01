export type UserRole = 'ADMIN' | 'CUSTOMER' | 'SUPERADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export interface User {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: 'ADMIN' | 'USER' | 'CUSTOMER';
  status: UserStatus;
  emailVerified: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface UserState {
  user: User | null;
}

export interface UserActions {
  setUser: (user: User) => void;
  clearUser: () => void;
}

export type UserStore = UserState & UserActions;
