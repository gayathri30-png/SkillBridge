import { Link } from 'react-router-dom';
import { APP_NAME } from '@/constants/config';
import { Zap } from 'lucide-react';

export default function Footer() {
  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'AI Matching', href: '#' },
        { label: 'Skill Analysis', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'API Reference', href: '#' },
        { label: 'Help Center', href: '#' },
        { label: 'Community', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Cookies', href: '#' },
        { label: 'Security', href: '#' },
      ],
    },
  ];

  return (
    <footer className="gradient-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg gradient-azure">
                <Zap className="size-4 text-white" />
              </div>
              <span className="font-[Outfit] text-lg font-bold">{APP_NAME}</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              Bridging the gap between emerging talent and forward-thinking companies through AI-powered matching.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-white/90">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-white/50 transition-colors hover:text-white/80">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">&copy; 2025 {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/40 hover:text-white/70">Privacy Policy</a>
            <a href="#" className="text-xs text-white/40 hover:text-white/70">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
