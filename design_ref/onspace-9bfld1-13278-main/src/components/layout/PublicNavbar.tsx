import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/constants/config';
import { useAuthStore } from '@/stores/authStore';
import { Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, currentRole } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
  ];

  const dashboardPath = currentRole === 'recruiter' ? '/recruiter' : currentRole === 'admin' ? '/admin' : '/student';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg gradient-azure">
            <Zap className="size-4 text-white" />
          </div>
          <span className="font-[Outfit] text-lg font-bold text-foreground">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Button onClick={() => navigate(dashboardPath)} className="gradient-azure text-white border-0">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')} className="text-sm font-medium">
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')} className="gradient-azure text-white border-0">
                Get Started
              </Button>
            </>
          )}
        </div>

        <button
          className="flex size-10 items-center justify-center rounded-lg md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <Button onClick={() => { navigate(dashboardPath); setMobileOpen(false); }} className="gradient-azure text-white border-0 w-full">
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => { navigate('/login'); setMobileOpen(false); }} className="w-full">
                  Sign In
                </Button>
                <Button onClick={() => { navigate('/register'); setMobileOpen(false); }} className="gradient-azure text-white border-0 w-full">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
