import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { APP_NAME } from '@/constants/config';
import { Zap, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import type { UserRole } from '@/types';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate(role === 'recruiter' ? '/recruiter' : role === 'admin' ? '/admin' : '/student');
  };

  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between gradient-navy p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg gradient-azure">
            <Zap className="size-4 text-white" />
          </div>
          <span className="font-[Outfit] text-lg font-bold text-white">{APP_NAME}</span>
        </Link>
        <div>
          <h1 className="font-[Outfit] text-4xl font-bold leading-tight text-white text-balance">
            Start your <br />
            <span className="bg-gradient-to-r from-blue-400 to-amber-300 bg-clip-text text-transparent">
              AI-powered
            </span>{' '}
            journey
          </h1>
          <p className="mt-4 max-w-md text-white/50">
            Create your free account and let our AI match you with the perfect opportunities.
          </p>
          <div className="mt-8 space-y-3">
            {['AI-powered job matching in seconds', 'Personalized skill gap analysis', 'Direct recruiter messaging'].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span className="text-sm text-white/70">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/30">&copy; 2025 {APP_NAME}</p>
      </div>

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
          <h2 className="font-[Outfit] text-2xl font-bold">Create your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {(['student', 'recruiter'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`rounded-xl border p-3 text-center transition-all capitalize ${
                  role === r ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border hover:border-primary/30'
                }`}
              >
                <p className="text-sm font-semibold capitalize">{r}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{r === 'student' ? 'Find opportunities' : 'Hire talent'}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Alex Rivera" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="r-email">Email</Label>
              <Input id="r-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="r-pass">Password</Label>
              <div className="relative mt-1.5">
                <Input id="r-pass" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password">
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map((c) => (
                    <p key={c.label} className={`flex items-center gap-1.5 text-xs ${c.met ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      <CheckCircle2 className="size-3" /> {c.label}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full gradient-azure border-0 text-white">
              Create Account
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
