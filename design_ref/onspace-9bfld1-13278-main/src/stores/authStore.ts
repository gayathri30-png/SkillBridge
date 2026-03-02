import { create } from 'zustand';
import type { UserRole } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  currentRole: UserRole | null;
  userName: string;
  userAvatar: string;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const ROLE_DEFAULTS: Record<UserRole, { name: string; avatar: string }> = {
  student: {
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  recruiter: {
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  admin: {
    name: 'Dev Anand',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
  },
};

export const useAuthStore = create<AuthState>((set) => {
  const savedRole = (typeof window !== 'undefined' ? localStorage.getItem('sb_role') : null) as UserRole | null;
  const isAuth = !!savedRole;
  const defaults = savedRole ? ROLE_DEFAULTS[savedRole] : { name: '', avatar: '' };

  return {
    isAuthenticated: isAuth,
    currentRole: savedRole,
    userName: defaults.name,
    userAvatar: defaults.avatar,
    login: (role) => {
      localStorage.setItem('sb_role', role);
      const d = ROLE_DEFAULTS[role];
      set({ isAuthenticated: true, currentRole: role, userName: d.name, userAvatar: d.avatar });
    },
    logout: () => {
      localStorage.removeItem('sb_role');
      set({ isAuthenticated: false, currentRole: null, userName: '', userAvatar: '' });
    },
    switchRole: (role) => {
      localStorage.setItem('sb_role', role);
      const d = ROLE_DEFAULTS[role];
      set({ currentRole: role, userName: d.name, userAvatar: d.avatar });
    },
  };
});
