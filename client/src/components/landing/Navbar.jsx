import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#about' },
  ];

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const id = href.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-auto flex items-center justify-between">
          {/* Logo area */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0057D9] transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:bg-[#0057D9] group-hover:text-white">
              <Sparkles size={20} fill="currentColor" />
            </div>
            <div className="flex items-center gap-2.5">
               <span className="text-[22px] font-extrabold tracking-tight text-[#0F172A] leading-none translate-y-[1px]">
                 SkillBridge
               </span>
               {/* AI Badge (desktop) */}
               <span className="hidden sm:inline-flex px-2.5 py-1 text-[10px] font-black tracking-widest text-[#0057D9] bg-blue-50/80 border border-blue-200/50 rounded-full uppercase items-center gap-1.5 shadow-sm">
                 <Sparkles size={11} className="text-[#0057D9]" /> AI
               </span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-[#0057D9] hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-bold text-slate-600 hover:text-[#0057D9] transition-colors relative group/link"
            >
              {link.name}
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#0057D9] transition-all group-hover/link:w-full rounded-full"></span>
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            to="/login"
            className="text-sm font-bold text-slate-700 hover:text-[#0057D9] transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2.5 bg-[#0057D9] text-white text-sm font-black rounded-xl hover:bg-[#1E40AF] transition-all shadow-[0_4px_14px_0_rgba(0,87,217,0.39)] hover:shadow-[0_6px_20px_rgba(0,87,217,0.23)] hover:-translate-y-0.5 flex items-center gap-2"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-4 bg-white border-t border-slate-100 shadow-xl absolute top-full left-0 right-0"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-base font-bold text-slate-700 hover:text-[#0057D9] hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px w-full bg-slate-100 my-2"></div>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-bold text-slate-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 text-center px-6 py-3 bg-[#0057D9] text-white font-bold rounded-xl shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
