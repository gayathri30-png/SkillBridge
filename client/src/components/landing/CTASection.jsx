import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 bg-[#0057D9] relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-[100px]"></div>
        </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight italic uppercase">
            Ready to Build Your Future?
        </h2>
        <p className="text-blue-100 text-xl font-medium max-w-2xl mx-auto mb-12">
          Join SkillBridge today and start connecting with verified opportunities or talent using the power of AI.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/register?type=student"
            className="px-12 py-5 bg-white text-[#0057D9] font-black rounded-[20px] hover:translate-y-[-2px] transition-all shadow-xl shadow-black/10"
          >
            Sign Up as Student
          </Link>
          <Link
            to="/register?type=recruiter"
            className="px-12 py-5 bg-slate-900 text-white font-black rounded-[20px] hover:translate-y-[-2px] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
          >
            Post a Job <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
