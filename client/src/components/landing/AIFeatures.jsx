import React from 'react';
import { Brain, Target, FileSearch, Sparkles } from 'lucide-react';

const AIFeatures = () => {
  const features = [
    {
      icon: <Target size={32} />,
      title: 'AI Job-Skill Match Score',
      desc: 'Instantly see how well your profile matches a job description with a percentage score.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: <Brain size={32} />,
      title: 'AI Portfolio Analyzer',
      desc: 'Get automated feedback on your portfolio to improve your chances of getting hired.',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      icon: <FileSearch size={32} />,
      title: 'AI Skill Gap Detector',
      desc: 'Identify missing skills for your dream job and get recommendations on what to learn.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: <Sparkles size={32} />,
      title: 'AI Proposal Generator',
      desc: 'Generate professional cover letters and proposals tailored to specific job posts.',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#0F172A]">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-0"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-widest text-[#38BDF8] uppercase bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
            Powered by SkillBridge AI
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Smart Tools for Smarter Careers</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
            Leverage cutting-edge AI technology to stand out from the crowd and find your perfect professional match.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500 text-white`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-4">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;
