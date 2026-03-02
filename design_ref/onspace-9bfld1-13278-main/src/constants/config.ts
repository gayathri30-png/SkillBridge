export const APP_NAME = 'SkillBridge';
export const APP_TAGLINE = 'AI-Powered Talent Platform';
export const APP_DESCRIPTION = 'Bridge the gap between talent and opportunity with intelligent matching.';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export const NAV_ITEMS: Record<string, NavItem[]> = {
  public: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
  ],
  student: [
    { label: 'Dashboard', href: '/student', icon: 'LayoutDashboard' },
    { label: 'Jobs', href: '/student/jobs', icon: 'Briefcase' },
    { label: 'Applications', href: '/student/applications', icon: 'FileText' },
    { label: 'Skill Gap', href: '/student/skills', icon: 'BarChart3' },
    { label: 'Messages', href: '/student/messages', icon: 'MessageSquare' },
    { label: 'Portfolio', href: '/student/portfolio', icon: 'FolderOpen' },
  ],
  recruiter: [
    { label: 'Dashboard', href: '/recruiter', icon: 'LayoutDashboard' },
    { label: 'Post Job', href: '/recruiter/post', icon: 'PlusCircle' },
    { label: 'Applicants', href: '/recruiter/applicants', icon: 'Users' },
    { label: 'Messages', href: '/recruiter/messages', icon: 'MessageSquare' },
    { label: 'Analytics', href: '/recruiter/analytics', icon: 'TrendingUp' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Users', href: '/admin/users', icon: 'Users' },
    { label: 'System Logs', href: '/admin/logs', icon: 'ScrollText' },
    { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
  ],
};

export const AI_SCORE_LABELS: Record<string, { label: string; color: string }> = {
  excellent: { label: 'Excellent Match', color: 'text-emerald-600' },
  good: { label: 'Good Match', color: 'text-blue-600' },
  fair: { label: 'Fair Match', color: 'text-amber-600' },
  low: { label: 'Low Match', color: 'text-red-500' },
};

export function getAIScoreCategory(score: number) {
  if (score >= 85) return AI_SCORE_LABELS.excellent;
  if (score >= 70) return AI_SCORE_LABELS.good;
  if (score >= 50) return AI_SCORE_LABELS.fair;
  return AI_SCORE_LABELS.low;
}
