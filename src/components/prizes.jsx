import { Trophy, Medal, Award, Star, Globe, Gift, GraduationCap, Rocket } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const prizes = [
  {
    tier: "gold",
    Icon: Trophy,
    label: "Winner",
    amount: "₹15,000",
    perks: ["Premium Goodies", "Special Recognition"],
    accentColor: "#f5c400",
    bgGradient: "linear-gradient(135deg, #1a1500 0%, #332700 100%)",
    desktopOrder: "md:order-2",
    heightClass: "md:min-h-[380px]", 
  },
  {
    tier: "silver",
    Icon: Medal,
    label: "1st Runner-Up",
    amount: "₹10,000",
    perks: ["Exclusive Goodies", "Merit Certificate"],
    accentColor: "#e5e7eb",
    bgGradient: "linear-gradient(135deg, #111111 0%, #222222 100%)",
    desktopOrder: "md:order-1",
    heightClass: "md:min-h-[340px]",
  },
  {
    tier: "bronze",
    Icon: Award,
    label: "2nd Runner-Up",
    amount: "₹5,000",
    perks: ["Swag Kits", "Merit Certificate"],
    accentColor: "#d97706", 
    bgGradient: "linear-gradient(135deg, #1a0f00 0%, #2a1800 100%)",
    desktopOrder: "md:order-3",
    heightClass: "md:min-h-[320px]",
  },
];

const generalPerks = [
  {
    Icon: Globe,
    title: "1-Year .xyz Domain",
    desc: "Worth ₹1L+ for all participants",
    color: "#3b82f6"
  },
  {
    Icon: Gift,
    title: "Hackathon Kits",
    desc: "Notebooks, Pens, Stickers & More",
    color: "#ef4444"
  },
  {
    Icon: GraduationCap,
    title: "Certificates",
    desc: "Official participation certificates",
    color: "#a855f7" 
  },
  {
    Icon: Rocket,
    title: "Exposure",
    desc: "Networking & industry mentorship",
    color: "#f97316"
  }
];

const PrizeCard = ({ tier, Icon, label, amount, perks, accentColor, bgGradient, desktopOrder, heightClass, index }) => {
  const isGold = tier === "gold";
  const isWinner = tier === "gold";
  const isRunnerUp = tier === "silver" || tier === "bronze";
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      className={`w-full max-w-sm mx-auto flex ${desktopOrder}`}
      style={{ perspective: 1000, willChange: "transform", zIndex: isGold ? 20 : 10 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", background: bgGradient }}
        className={`relative w-full flex flex-col items-center text-center p-8 rounded-2xl border border-[#333] shadow-2xl ${heightClass} justify-center transition-colors duration-300 group`}
      >
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle at center, ${accentColor}33 0%, transparent 70%)` }}
        />

        <div 
          className="absolute top-0 inset-x-8 h-1 rounded-b-md" 
          style={{ background: accentColor, boxShadow: `0 2px 10px ${accentColor}` }} 
        />

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
          style={{ transform: "translateZ(40px)" }}
          className="mb-6 relative"
        >
          <div 
            className="absolute inset-0 blur-md opacity-50" 
            style={{ background: accentColor }} 
          />
          <Icon size={isGold ? 56 : 42} style={{ color: accentColor }} className="relative z-10 drop-shadow-lg" />
        </motion.div>

        <p 
          style={{ transform: "translateZ(30px)" }}
          className={`text-xs sm:text-sm font-black uppercase tracking-[0.2em] mb-2 ${isWinner ? "prize-winner-text" : isRunnerUp ? "text-white" : "text-(--text-muted)"}`}
        >
          {label}
        </p>

        <h3 
          style={{ transform: "translateZ(50px)", color: accentColor }}
          className={`font-black tracking-tight mb-6 drop-shadow-md ${isGold ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}
        >
          {amount}
        </h3>

        <ul className="flex flex-col gap-3 w-full" style={{ transform: "translateZ(20px)" }}>
          {perks.map(text => (
            <li
              key={text}
              className={`flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold ${isWinner ? "prize-winner-text" : isRunnerUp ? "text-white" : "text-(--text-muted)"}`}
            >
              <Star size={12} style={{ color: accentColor }} />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

const Prizes = () => {
  return (
    <section
      id="prizes"
      className="relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6 text-center bg-transparent"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="section-heading mb-4">
            The Prize Pool
          </h2>
          <div
            className="h-1.5 w-24 rounded-full mx-auto mb-6"
            style={{ background: "linear-gradient(90deg, var(--primary), var(--secondary))" }}
          />
          

      
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-6 py-3 rounded-2xl sm:rounded-full border border-(--border-soft) bg-(--bg-card-dark) backdrop-blur-md shadow-sm">
            <span className="text-sm font-bold text-(--text-muted) uppercase tracking-widest">Total Value</span>
            <span className="text-xl sm:text-2xl font-black text-(--primary)">₹1,50,000+ Worth</span>
          </div>
        </motion.div>
        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-4 lg:gap-8 mb-24">
          {prizes.map((prize, i) => (
            <PrizeCard key={prize.tier} {...prize} index={i} />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-8" style={{ color: "var(--text-light)" }}>
            Perks for Everyone
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {generalPerks.map((perk, i) => (
              <motion.div 
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-(--border-soft) bg-(--bg-card-dark) backdrop-blur-md shadow-sm hover:bg-(--bg-card-dark) hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${perk.color}15` }}
                >
                  <perk.Icon size={24} style={{ color: perk.color }} />
                </div>
                <h4 className="text-base font-bold mb-2 text-(--text-light)">{perk.title}</h4>
                <p className="text-xs sm:text-sm text-(--text-muted) leading-relaxed">{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Prizes;