import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { NAV_ITEMS, APP_NAME } from '@/constants/config';
import type { UserRole } from '@/types';
import {
  LayoutDashboard, Briefcase, FileText, BarChart3, MessageSquare,
  FolderOpen, PlusCircle, Users, TrendingUp, ScrollText, Settings,
  Zap, LogOut, ChevronLeft, Menu, Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Briefcase, FileText, BarChart3, MessageSquare,
  FolderOpen, PlusCircle, Users, TrendingUp, ScrollText, Settings,
};

export default function DashboardLayout() {
  const { currentRole, userName, userAvatar, logout } = useAuthStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = currentRole ? (NAV_ITEMS[currentRole] || []) : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleLabel: Record<UserRole, string> = {
    student: 'Student',
    recruiter: 'Recruiter',
    admin: 'Administrator',
  };

  const renderNavItem = (item: { label: string; href: string; icon?: string }, closeMobile?: boolean) => {
    const iconName = item.icon || 'LayoutDashboard';
    const Icon = ICON_MAP[iconName] || LayoutDashboard;
    return (
      <li key={item.href}>
        <NavLink
          to={item.href}
          end={item.href === `/${currentRole}`}
          onClick={closeMobile ? () => setMobileOpen(false) : undefined}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-primary'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            } ${collapsed && !closeMobile ? 'justify-center px-0' : ''}`
          }
        >
          <Icon className="size-[18px] shrink-0" />
          {(closeMobile || !collapsed) && <span>{item.label}</span>}
        </NavLink>
      </li>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200 lg:flex ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg gradient-azure">
            <Zap className="size-4 text-white" />
          </div>
          {!collapsed && <span className="font-[Outfit] text-sm font-bold text-sidebar-foreground">{APP_NAME}</span>}
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => renderNavItem(item))}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground"
          >
            <ChevronLeft className={`size-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-sidebar">
            <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
              <div className="flex size-8 items-center justify-center rounded-lg gradient-azure">
                <Zap className="size-4 text-white" />
              </div>
              <span className="font-[Outfit] text-sm font-bold text-sidebar-foreground">{APP_NAME}</span>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              <ul className="space-y-1">
                {navItems.map((item) => renderNavItem(item, true))}
              </ul>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 lg:px-6">
          <button
            className="flex size-10 items-center justify-center rounded-lg hover:bg-muted lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-muted-foreground">
              {currentRole ? roleLabel[currentRole] : ''} Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="size-[18px]" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500" />
            </Button>
            <div className="flex items-center gap-2.5">
              <img
                src={userAvatar}
                alt={userName}
                className="size-8 rounded-full object-cover ring-2 ring-border"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground capitalize">{currentRole}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
              <LogOut className="size-[18px]" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
