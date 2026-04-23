import { useEffect, useRef } from "react";
import { Users, Laptop, Timer, GraduationCap } from "lucide-react";
import { motion, useInView, animate } from "framer-motion";

const stats = [
  { Icon: Users,         to: 300, suffix: "+", label: "Participants"         },
  { Icon: Laptop,        to: 60,  suffix: "+", label: "Diverse Teams"        },
  { Icon: Timer,         to: 36,  suffix: "",  label: "Hours of Innovation"     },
  { Icon: GraduationCap, to: 10,  suffix: "+", label: "Colleges Represented" },
];
const AnimatedCounter = ({ to, suffix }) => {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, to, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = Math.floor(value) + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to, suffix]);

  return <span ref={nodeRef}>0{suffix}</span>;
};

const StatCard = ({ Icon, to, suffix, label, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="relative group flex flex-col items-center text-center rounded-2xl p-8 overflow-hidden bg-(--bg-card-dark) border border-(--border-soft) transition-colors duration-300 hover:border-(--primary)"
  >
    <div className="absolute inset-0 bg-(--primary) opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
    
    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-(--bg-page) border border-(--border-soft) transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 relative z-10 shadow-lg">
      <Icon size={24} style={{ color: "var(--primary)" }} />
    </div>

    {/*animated number*/}
    <h3 className="text-5xl font-black mb-2 text-(--text-light) relative z-10 tracking-tight drop-shadow-md">
      <AnimatedCounter to={to} suffix={suffix} />
    </h3>

    {/*lable*/}
    <p className="text-sm font-bold uppercase tracking-widest text-(--text-muted) relative z-10">
      {label}
    </p>
  </motion.div>
);

const ImpactStats = () => {
  return (
    <section id="impact-stats" className="py-20 px-4 sm:px-6 bg-(--bg-page-elevated) relative z-10">
      
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-(--border-soft) to-transparent" />

      <div className="max-w-6xl mx-auto">
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-black uppercase tracking-[0.2em] mb-12 text-center text-(--primary)"
        >
          Q-Hackathon by the numbers
        </motion.p>

        {/*responsive grids*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;