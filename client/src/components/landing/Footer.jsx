import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer id="about" className="relative bg-[#0A0F1D] text-slate-400 py-24 overflow-hidden border-t border-white/5">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] -z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 mb-20">
          {/* Brand & Mission */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
              >
                <Sparkles size={24} fill="currentColor" />
              </motion.div>
              <span className="text-3xl font-black text-white tracking-tighter">SkillBridge</span>
            </Link>
            <p className="text-lg font-medium leading-relaxed mb-8 max-w-sm">
                Revolutionizing the bridge between talent and industry through 
                <span className="text-white"> precision AI matching</span> and ethical verified skills.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Github size={20} />, href: "https://github.com", color: "hover:bg-slate-800" },
                { icon: <Twitter size={20} />, href: "https://twitter.com", color: "hover:bg-[#1DA1F2]" },
                { icon: <Linkedin size={20} />, href: "https://linkedin.com", color: "hover:bg-[#0077B5]" }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all duration-300 ${social.color}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Platform</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to="/jobs" className="hover:text-blue-400 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/register?type=recruiter" className="hover:text-blue-400 transition-colors">For Recruiters</Link></li>
              <li><Link to="/register?type=student" className="hover:text-blue-400 transition-colors">Join as Talent</Link></li>
              <li><Link to="/features" className="hover:text-blue-400 transition-colors">AI Ecosystem</Link></li>
            </ul>
          </div>
          
           <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Company</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Intelligence Blog</Link></li>
              <li><Link to="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Join the AI Community</h4>
            <p className="text-sm font-medium mb-6">Get the latest career insights and talent trends delivered to your inbox.</p>
            <div className="relative group">
               <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all font-bold placeholder:text-slate-600"
               />
               <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
               <button className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all flex items-center justify-center">
                  <ArrowRight size={18} />
               </button>
            </div>
            <p className="text-[10px] mt-4 text-slate-600 font-bold uppercase tracking-tighter">No spam. Only high-signal intelligence. 100% Secure.</p>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm font-bold tracking-tight">
                &copy; {new Date().getFullYear()} <span className="text-white">SkillBridge AI</span>. All rights reserved.
            </div>
            <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
