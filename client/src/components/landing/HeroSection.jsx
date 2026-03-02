import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Search, Users, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 87, 217, 0.08)';
      ctx.fillStyle = 'rgba(0, 87, 217, 0.08)';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white">
      {/* Neural Network Background Animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-bold text-[#0057D9] bg-blue-50 rounded-full border border-blue-100/50 shadow-sm">
                <Zap size={16} fill="currentColor" />
                <span>Next-Gen Talent Matching</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] text-[#0F172A] mb-8 tracking-tight">
                Bridge the Gap Between <span className="text-[#0057D9]">Talent</span> and Opportunity
              </h1>
              
              <p className="text-xl text-[#64748B] mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                SkillBridge connects skilled students with recruiters looking for verified talent. 
                No degree required – just your abilities.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                <Link
                  to="/register?type=student"
                  className="w-full sm:w-auto px-10 py-5 bg-[#0057D9] text-white font-bold rounded-[16px] hover:bg-[#1E40AF] transition-all shadow-[0_10px_20px_-5px_rgba(0,87,217,0.3)] hover:shadow-[0_15px_30px_-10px_rgba(0,87,217,0.4)] flex items-center justify-center gap-3 group"
                >
                  Find Work
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register?type=recruiter"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-[#0F172A] font-bold rounded-[16px] border border-[#E2E8F0] hover:border-[#0057D9] hover:text-[#0057D9] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  Hire Talent
                </Link>
              </div>
              
              <div className="mt-14 flex items-center justify-center lg:justify-start gap-12">
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-black text-[#0F172A]">10K+</p>
                  <p className="text-sm font-bold text-[#64748B] uppercase tracking-wider">Students</p>
                </div>
                <div className="h-10 w-px bg-slate-200"></div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-black text-[#0F172A]">500+</p>
                  <p className="text-sm font-bold text-[#64748B] uppercase tracking-wider">Companies</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Content */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              {/* Main Visual Card */}
              <div className="relative p-2 bg-gradient-to-br from-white to-[#F1F5F9] rounded-[40px] shadow-[0_45px_100px_-25px_rgba(0,0,0,0.1)] border border-white">
                <div className="aspect-[4/3] bg-[#F8FAFC] rounded-[32px] overflow-hidden relative border border-[#E2E8F0]/30 shadow-inner">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                      alt="Students collaborating" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
                    
                     {/* Premium Floating Elements */}
                     <div className="absolute top-10 left-10 right-10">
                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1, duration: 0.5 }}
                          className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4 mb-4 max-w-[240px]"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-lg">JS</div>
                            <div>
                                <p className="text-xs font-bold text-slate-800">New Match Found</p>
                                <p className="text-[10px] text-slate-500 font-medium">Frontend Developer</p>
                            </div>
                        </motion.div>
                        
                         <motion.div 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.2, duration: 0.5 }}
                          className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4 self-end ml-auto max-w-[260px]"
                        >
                            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg">
                               <ShieldCheck size={20} />
                            </div>
                             <div className="flex-1">
                                <p className="text-xs font-bold text-slate-800">Recruiter Verified</p>
                                <p className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">Gold Status</p>
                             </div>
                        </motion.div>
                     </div>
                </div>

                {/* Floating Stats */}
                <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-lg p-5 rounded-[24px] shadow-2xl border border-white flex items-center gap-4"
                >
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-[10px] text-[#64748B] font-black uppercase tracking-widest">AI Accuracy</p>
                        <p className="text-2xl font-black text-[#0F172A]">98.4%</p>
                    </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
