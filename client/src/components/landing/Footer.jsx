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

           <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Platform</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to="/jobs" className="hover:text-blue-400 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/register?type=recruiter" className="hover:text-blue-400 transition-colors">For Recruiters</Link></li>
              <li><Link to="/register?type=student" className="hover:text-blue-400 transition-colors">Join as Talent</Link></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">AI Ecosystem</a></li>
            </ul>
          </div>
          
           <div className="lg:col-span-3">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">About</h4>
            <ul className="space-y-4 font-bold text-sm">
               <li className="text-slate-500 max-w-xs cursor-default">
                  SkillBridge is a precision talent matching platform designed to connect verified skill sets with real industry opportunities.
               </li>
               <li><a href="#about" className="text-blue-400 hover:underline">Learn more about our mission &rarr;</a></li>
            </ul>
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
