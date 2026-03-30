import React from 'react';
import { motion } from 'framer-motion';
import { Target, ShieldCheck, Zap, Globe } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4 block">Our Mission</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
              Bridging the gap between <span className="text-blue-600">Talent</span> and Industry
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
              SkillBridge was born out of a simple realization: the traditional recruitment process is broken. 
              Degrees often fail to capture true ability, and recruiters struggle to verify skills at scale.
            </p>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
              We leverage predictive AI and verified skill assessments to ensure that every match is 
              driven by data, not just keywords. Our platform empowers freshers to stand out 
              and helps companies hire with absolute confidence.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Verified Skills</h4>
                  <p className="text-sm text-slate-500">Every skill is backed by real-world proof.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">AI Logic</h4>
                  <p className="text-sm text-slate-500">Intelligent matching for precision hiring.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-[40px] overflow-hidden border border-slate-100 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                alt="Our Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply"></div>
            </div>
            
            {/* Floating Card */}
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 max-w-[240px]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                  <Globe size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">Founded</p>
                  <p className="text-lg font-black text-slate-900">2026</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium">Headquartered in the cloud, serving talent globally.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
