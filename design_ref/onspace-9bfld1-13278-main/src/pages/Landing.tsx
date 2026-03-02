import { useNavigate } from 'react-router-dom';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';
import {
  Sparkles, BarChart3, Users, Shield, Zap, ArrowRight,
  Brain, Target, Rocket, Star, CheckCircle2,
} from 'lucide-react';
import { MOCK_TESTIMONIALS, MOCK_PRICING } from '@/constants/mockData';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: <Brain className="size-6" />, title: 'AI-Powered Matching', description: 'Our ML algorithm analyzes 50+ data points to match students with their ideal roles—scoring compatibility in real time.' },
    { icon: <BarChart3 className="size-6" />, title: 'Skill Gap Analyzer', description: 'Identify exactly what skills to develop next with personalized learning paths and course recommendations.' },
    { icon: <Target className="size-6" />, title: 'Smart Applications', description: 'Apply to jobs where you have the highest match score. Quality over quantity means better outcomes for everyone.' },
    { icon: <Users className="size-6" />, title: 'Recruiter Intelligence', description: 'Surface the best candidates instantly. AI-ranked applicant pools save hours of manual resume screening.' },
    { icon: <Shield className="size-6" />, title: 'Verified Portfolios', description: 'Showcase real projects with verified skills. Build credibility through demonstrated work, not just keywords.' },
    { icon: <Rocket className="size-6" />, title: 'Career Velocity', description: 'Track your career trajectory with analytics on profile views, match trends, and application success rates.' },
  ];

  const steps = [
    { number: '01', title: 'Build Your Profile', description: 'Add your skills, experience, and projects. Our AI begins learning your strengths immediately.' },
    { number: '02', title: 'Get AI Matches', description: 'Receive personalized job recommendations scored by compatibility. Focus on roles where you shine.' },
    { number: '03', title: 'Close the Gap', description: 'Follow AI-generated learning paths to boost your match scores and unlock new opportunities.' },
    { number: '04', title: 'Land the Role', description: 'Apply with confidence, track progress, and communicate directly with recruiters through the platform.' },
  ];

  return (
    <div className="min-h-screen">
      <PublicNavbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,65%,12%)]/90 via-[hsl(220,55%,18%)]/85 to-[hsl(220,65%,12%)]/95" />
        </div>

        {/* Decorative elements */}
        <div className="absolute left-1/4 top-1/3 size-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 size-56 rounded-full bg-amber-500/8 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-24 text-center sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="size-4 text-amber-400" />
            <span className="text-sm font-medium text-white/80">AI-Powered Talent Matching</span>
          </div>

          <h1 className="max-w-4xl font-[Outfit] text-4xl font-extrabold leading-[1.08] tracking-tight text-white text-balance sm:text-5xl lg:text-7xl">
            The bridge between
            <span className="relative mx-2 inline-block">
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-amber-300 bg-clip-text text-transparent">
                talent
              </span>
            </span>
            and
            <span className="relative mx-2 inline-block">
              <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                opportunity
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 text-pretty sm:text-xl">
            SkillBridge uses AI to match emerging talent with forward-thinking companies.
            Smarter matching. Faster hiring. Better outcomes for everyone.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="gradient-azure border-0 px-8 text-base font-semibold text-white"
            >
              Start For Free <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
            >
              Watch Demo
            </Button>
          </div>

          {/* Trust metrics */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8 sm:gap-16">
            {[
              { value: '12K+', label: 'Active Students' },
              { value: '2,400+', label: 'Companies' },
              { value: '89%', label: 'Match Rate' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-[Outfit] text-2xl font-bold text-white tabular-nums sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-white/50 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-24 gradient-mesh">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">Platform Features</span>
            <h2 className="mt-3 font-[Outfit] text-3xl font-bold sm:text-4xl text-balance">
              Everything you need to launch careers and hire smarter
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              From AI matching to skill analysis, SkillBridge equips students and recruiters with the tools for better outcomes.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:card-floating hover:border-primary/20"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-[Outfit] text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">How It Works</span>
            <h2 className="mt-3 font-[Outfit] text-3xl font-bold sm:text-4xl text-balance">
              From sign-up to hired in four steps
            </h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <span className="font-[Outfit] text-5xl font-extrabold text-primary/10">{step.number}</span>
                <h3 className="mt-2 font-[Outfit] text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="py-24 gradient-mesh">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">Testimonials</span>
            <h2 className="mt-3 font-[Outfit] text-3xl font-bold sm:text-4xl text-balance">
              Trusted by students and recruiters worldwide
            </h2>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {MOCK_TESTIMONIALS.map((t) => (
              <div key={t.id} className="rounded-2xl border border-border bg-card p-6 card-elevated">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground italic text-pretty">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                  <img src={t.avatar} alt={t.name} className="size-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">Pricing</span>
            <h2 className="mt-3 font-[Outfit] text-3xl font-bold sm:text-4xl text-balance">
              Plans that grow with you
            </h2>
            <p className="mt-4 text-muted-foreground">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MOCK_PRICING.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-200 ${
                  plan.highlighted
                    ? 'border-primary bg-primary/[0.03] card-floating ring-1 ring-primary/20'
                    : 'border-border bg-card hover:card-elevated'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-azure px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="font-[Outfit] text-lg font-semibold">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-[Outfit] text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-6 w-full ${plan.highlighted ? 'gradient-azure border-0 text-white' : ''}`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  onClick={() => navigate('/register')}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="gradient-navy py-24 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <Zap className="mx-auto mb-6 size-10 text-amber-400" />
          <h2 className="font-[Outfit] text-3xl font-bold sm:text-4xl text-balance">
            Ready to bridge the gap?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Join thousands of students and recruiters already using AI to find better matches, faster.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" onClick={() => navigate('/register')} className="gradient-azure border-0 px-8 text-white">
              Create Free Account
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
