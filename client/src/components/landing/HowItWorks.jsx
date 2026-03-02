import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserPlus, Search, Briefcase, FileText, CheckCircle, MessageSquare, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const studentSteps = [
    {
      icon: <UserPlus size={24} />,
      title: 'Create Profile',
      desc: 'Add your skills, projects, and portfolio. No degree required – your talent speaks for itself.',
    },
    {
      icon: <Search size={24} />,
      title: 'Get Matched',
      desc: 'Our AI analyzes your unique skill set and suggests high-match opportunities instantly.',
    },
    {
      icon: <Briefcase size={24} />,
      title: 'Apply & Grow',
      desc: 'Apply with one tap, chat directly with hiring managers, and start your career journey.',
    },
  ];

  const recruiterSteps = [
    {
      icon: <FileText size={24} />,
      title: 'Post Jobs',
      desc: 'List your open roles with specific skill requirements and verification preferences.',
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Review Applicants',
      desc: 'Access a curated list of talent ranked by AI match scores and verified skill sets.',
    },
    {
      icon: <MessageSquare size={24} />,
      title: 'Hire the Best',
      desc: 'Collaborate with pre-vetted candidates and close roles faster with direct communication.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Students Section */}
        <div className="mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">For Students & Freshers</h2>
              <p className="text-lg text-slate-600 font-medium">Build your reputation and land your dream job based on what you can do, not just what's on your resume.</p>
            </div>
            <Link to="/register?type=student" className="inline-flex items-center gap-2 text-[#0057D9] font-bold hover:underline">
              Start Your Journey <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
             <div className="hidden lg:block absolute top-10 left-[20%] right-[20%] h-px bg-slate-100 -z-0"></div>
            {studentSteps.map((step, index) => (
              <div key={index} className="relative z-10 group">
                <div className="w-20 h-20 bg-blue-50 text-[#0057D9] rounded-3xl flex items-center justify-center mb-8 group-hover:bg-[#0057D9] group-hover:text-white transition-all duration-300 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recruiters Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">For Recruiters & Employers</h2>
              <p className="text-lg text-slate-600 font-medium">Find the perfect match for your team with AI-vetted talent and verified skill assessments.</p>
            </div>
            <Link to="/register?type=recruiter" className="inline-flex items-center gap-2 text-[#0057D9] font-bold hover:underline">
              Post a Job <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
             <div className="hidden lg:block absolute top-10 left-[20%] right-[20%] h-px bg-slate-100 -z-0"></div>
            {recruiterSteps.map((step, index) => (
              <div key={index} className="relative z-10 group">
                <div className="w-20 h-20 bg-slate-50 text-slate-700 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
