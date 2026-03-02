import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { APP_NAME } from '@/constants/config';
import { Zap, Eye, EyeOff } from 'lucide-react';
import type { UserRole } from '@/types';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<UserRole>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    const paths: Record<UserRole, string> = { student: '/student', recruiter: '/recruiter', admin: '/admin' };
    navigate(paths[role]);
  };

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: 'student', label: 'Student', desc: 'Find jobs & build skills' },
    { value: 'recruiter', label: 'Recruiter', desc: 'Post jobs & find talent' },
    { value: 'admin', label: 'Admin', desc: 'Manage the platform' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden w-1/2 flex-col justify-between gradient-navy p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg gradient-azure">
            <Zap className="size-4 text-white" />
          </div>
          <span className="font-[Outfit] text-lg font-bold text-white">{APP_NAME}</span>
        </Link>
        <div>
          <h1 className="font-[Outfit] text-4xl font-bold leading-tight text-white text-balance">
            Welcome back to <br />
            <span className="bg-gradient-to-r from-blue-400 to-amber-300 bg-clip-text text-transparent">
              smarter hiring
            </span>
          </h1>
          <p className="mt-4 max-w-md text-white/50">
            Your AI-powered career journey continues. Sign in to access your personalized dashboard.
          </p>
        </div>
        <p className="text-xs text-white/30">&copy; 2025 {APP_NAME}. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg gradient-azure">
                <Zap className="size-4 text-white" />
              </div>
              <span className="font-[Outfit] text-lg font-bold">{APP_NAME}</span>
            </Link>
          </div>

          <h2 className="font-[Outfit] text-2xl font-bold">Sign in to your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">Create one</Link>
          </p>

          {/* Role Selector */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`rounded-xl border p-3 text-center transition-all ${
                  role === r.value
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <p className="text-sm font-semibold">{r.label}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{r.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-azure border-0 text-white">
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">Or continue with</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <svg className="mr-2 size-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <svg className="mr-2 size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
