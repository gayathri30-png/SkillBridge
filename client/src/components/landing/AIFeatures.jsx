import React from 'react';
import { 
  Brain, Target, FileSearch, Sparkles, 
  Zap, Search, MessageSquare, TrendingUp 
} from 'lucide-react';
import { motion } from 'framer-motion';

const AIFeatures = () => {
  const features = [
    {
      icon: <Target size={32} />,
      title: 'AI Job-Skill Match Score',
      desc: 'Precision matching for every application. Instantly see how well your profile aligns with job requirements.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: <Brain size={32} />,
      title: 'AI Interview Prep & Coaching',
      desc: 'Targeted interview questions and real-time AI guidance to sharpen your answers and boost confidence.',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      icon: <FileSearch size={32} />,
      title: 'AI Skill Gap Detector',
      desc: 'Personalized career roadmaps. Identify exactly what you need to learn to land your dream role.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: <Sparkles size={32} />,
      title: 'AI Proposal Generator',
      desc: 'Stand out from the crowd with professional, AI-crafted cover letters tailored to each specific job post.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: <Zap size={32} />,
      title: 'AI Smart Sourcing',
      desc: 'For recruiters: Automated auto-invitations and intelligent shortlisting to find top talent in seconds.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: <Search size={32} />,
      title: 'AI Candidate Comparison',
      desc: 'Data-driven talent evaluation. Compare multiple candidates side-by-side using deep behavioral insights.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: <MessageSquare size={32} />,
      title: 'AI Feedback Generator',
      desc: 'Meaningful coaching for every applicant. Systematically provide high-quality feedback to keep candidates engaged.',
      color: 'from-rose-500 to-red-600',
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#0A0F1D]">
        {/* Advanced Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] -z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] -z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-6 py-2 mb-8 text-[10px] font-black tracking-[0.2em] text-[#38BDF8] uppercase bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-md shadow-lg shadow-blue-500/5">
            SkillBridge AI Ecosystem
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
            Smart Tools for <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Smarter Careers</span>
          </h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
            Our multi-layered AI suite transforms the end-to-end recruitment lifecycle, 
            empowering both talent and recruiters with unprecedented intelligence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group p-10 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.07] hover:border-white/20 transition-all duration-500 shadow-2xl relative overflow-hidden"
            >
              {/* Card Inner Glow */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-[24px] flex items-center justify-center mb-10 shadow-2xl shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-white`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-white mb-5 tracking-tight group-hover:text-blue-400 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;
