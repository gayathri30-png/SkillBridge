import React from 'react';
import { Check, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const tiers = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for students exploring new opportunities.',
      features: [
        'AI Job-Skill Matching',
        'Basic Profile Analytics',
        'Apply to 5 Jobs / Month',
        'Community Support'
      ],
      buttonText: 'Get Started',
      link: '/register?type=student',
      highlight: false
    },
    {
      name: 'Pro',
      price: '19',
      description: 'For serious candidates looking to stand out.',
      features: [
        'Everything in Free',
        'AI Portfolio Analyzer',
        'Unlimited Job Applications',
        'Priority Skill Verification',
        'AI Proposal Generator'
      ],
      buttonText: 'Go Pro',
      link: '/register?type=student',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: '99',
      description: 'For recruiters and scaling companies.',
      features: [
        'Everything in Pro',
        'Advanced Recruiter Dashboard',
        'Bulk Skill Verification',
        'AI-Powered Applicant Ranking',
        'Dedicated Success Manager'
      ],
      buttonText: 'Contact Sales',
      link: '/register?type=recruiter',
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Simple, Transparent Pricing</h2>
                <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
                    Choose the plan that fits your career goals. Whether you're just starting out or hiring the next dream team.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {tiers.map((tier, index) => (
                    <div 
                        key={index} 
                        className={`relative p-10 rounded-[40px] border ${
                            tier.highlight 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' 
                            : 'bg-slate-50 border-slate-100 text-slate-900 hover:border-blue-200 transition-colors'
                        }`}
                    >
                        {tier.highlight && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0057D9] text-white text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                                <Zap size={12} fill="currentColor" /> Most Popular
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{tier.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black">${tier.price}</span>
                                <span className={tier.highlight ? 'text-slate-400' : 'text-slate-500'}>/month</span>
                            </div>
                            <p className={`mt-4 text-sm font-medium ${tier.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                                {tier.description}
                            </p>
                        </div>

                        <ul className="space-y-4 mb-10">
                            {tier.features.map((feature, fIndex) => (
                                <li key={fIndex} className="flex items-start gap-3">
                                    <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${tier.highlight ? 'bg-blue-500 text-white' : 'bg-blue-100 text-[#0057D9]'}`}>
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link 
                            to={tier.link}
                            className={`block w-full py-4 rounded-[20px] text-center font-black transition-all ${
                                tier.highlight 
                                ? 'bg-[#0057D9] text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20' 
                                : 'bg-white text-slate-900 border border-slate-200 hover:border-[#0057D9] hover:text-[#0057D9]'
                            }`}
                        >
                            {tier.buttonText}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default Pricing;
