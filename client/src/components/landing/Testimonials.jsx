import React from 'react';

const Testimonials = () => {
    // Placeholder data
    const testimonials = [
        {
            name: "Sarah Jenkins",
            role: "Computer Science Student",
            desc: "SkillBridge helped me land my first internship without a degree. The AI match score gave me confidence to apply.",
            initial: "S"
        },
        {
            name: "Mark Thompson",
            role: "Tech Recruiter",
            desc: "We reduced our hiring time by 50%. The verified skills feature ensures we only interview qualified candidates.",
            initial: "M"
        },
        {
            name: "Priya Sharma",
            role: "Freelance Designer",
            desc: "I love how the portfolio analyzer gave me tips to improve my profile. I'm getting twice as many leads now!",
            initial: "P"
        }
    ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Success Stories</h2>
        <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
                <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                            {t.initial}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{t.name}</p>
                            <p className="text-sm text-gray-500">{t.role}</p>
                        </div>
                    </div>
                    <p className="text-gray-600 italic">"{t.desc}"</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
