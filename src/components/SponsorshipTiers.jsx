import { useRef } from "react";
import { Check, Star } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float } from "@react-three/drei";
import { usePerformanceMode } from "../utils/usePerformanceMode";
import { useTheme } from "../context/ThemeContext";
const tiers = [
  {
    name: "Platinum",
    price: "₹40,000 – ₹60,000",
    badge: "MOST IMPACT",
    color: "#e51a80",
    glow: "rgba(229, 26, 128, 0.2)",
    scale: "scale-105 z-20",
    features: [
      "Largest logo on homepage",
      "Main stage backdrop branding",
      "Opening & Closing mentions",
      "Dedicated social media post",
      "Introduce problem statement",
      "Host CTF / challenge track",
      "Nominate Judge & Mentor",
      "Booth / promotional stall",
      "Resume database access",
      "Hiring opportunities",
    ],
  },
  {
    name: "Gold",
    price: "₹25,000 – ₹40,000",
    color: "#f5c400",
    glow: "rgba(245, 196, 0, 0.15)",
    scale: "scale-100 z-10",
    features: [
      "Large logo on website",
      "Logo on major event banners",
      "Opening & Closing mentions",
      "Social media promotion",
      "Host CTF challenge",
      "Nominate Judge & Mentor",
      "Promotional booth/counter",
      "Distribute merchandise",
      "Logo in highlight post",
    ],
  },
  {
    name: "Silver",
    price: "₹15,000 – ₹25,000",
    color: "#e5e7eb",
    lightColor: "#6b7280",
    glow: "rgba(255, 255, 255, 0.05)",
    lightGlow: "rgba(107, 114, 128, 0.18)",
    scale: "scale-95 z-0 opacity-90 hover:opacity-100",
    features: [
      "Logo on website & banners",
      "Prize distribution mention",
      "Social media acknowledgement",
      "Host mini challenge",
      "Nominate 1 Mentor",
      "Brand mention in report",
      "Mention in emails",
    ],
  },
  {
    name: "Bronze",
    price: "₹5,000 – ₹10,000",
    color: "#d97706",
    glow: "rgba(217, 119, 6, 0.05)",
    scale: "scale-95 z-0 opacity-90 hover:opacity-100",
    features: [
      "Logo on website section",
      "Logo in list poster",
      "Social media acknowledgement",
      "Mention in closing slides",
      "Brand name on page",
      "Thank-you post mention",
    ],
  },
];

//3d network background 
const BackgroundNetwork = () => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.03;
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, -5]}>
          <icosahedronGeometry args={[8, 1]} />
          <meshBasicMaterial color="#8c2e7c" wireframe transparent opacity={0.05} />
        </mesh>
      </Float>
      <Sparkles count={70} scale={20} size={1.8} speed={0.2} opacity={0.22} color="#ffffff" />
      <Sparkles count={34} scale={25} size={3} speed={0.4} opacity={0.18} color="#e51a80" />
      <Sparkles count={18} scale={15} size={4} speed={0.1} opacity={0.28} color="#f5c400" />
    </group>
  );
};
const TierCard = ({ tier, index, isLight }) => {
  const isPlatinum = tier.name === "Platinum";

  // Resolve theme-aware color/glow for tiers that need light-mode overrides (Silver)
  const resolvedColor = isLight && tier.lightColor ? tier.lightColor : tier.color;
  const resolvedGlow = isLight && tier.lightGlow ? tier.lightGlow : tier.glow;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={`w-full flex ${tier.scale} transition-all duration-500`}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full flex flex-col h-full bg-(--bg-card-dark) rounded-2xl border border-(--border-soft) p-8 shadow-2xl group transition-colors duration-300"
      >
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-xl"
          style={{ background: `radial-gradient(circle at top, ${resolvedGlow} 0%, transparent 70%)` }}
        />
        <div
          className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl opacity-80 group-hover:opacity-100 transition-opacity"
          style={{ background: resolvedColor, boxShadow: `0 0 15px ${resolvedColor}` }}
        />
        <div style={{ transform: "translateZ(30px)" }} className="flex flex-col h-full relative z-10">
          {tier.badge && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <span
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-lg text-(--text-inverse) shadow-lg"
                style={{ background: tier.color }}
              >
                <Star size={12} fill="currentColor" /> {tier.badge}
              </span>
            </div>
          )}
          <h3 className="text-3xl font-black text-(--text-light) text-center tracking-tight mb-2">
            {tier.name}
          </h3>
          <p className="text-sm font-bold text-center tracking-widest mb-8" style={{ color: resolvedColor }}>
            {tier.price}
          </p>

          <div className="w-full h-px bg-(--border-soft) mb-8" />

          <ul className="flex flex-col gap-4 mb-10 grow">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-(--text-muted) font-medium leading-snug">
                <div className="mt-0.5 shrink-0">
                  <Check size={16} style={{ color: resolvedColor }} strokeWidth={3} />
                </div>
                {feature}
              </li>
            ))}
          </ul>

          {/*button*/}
          <a
            href="https://drive.google.com/file/d/1nZfTdO8etlti3NfCVrHc0nu5bReZBJME/view"
            target="_blank"
            rel="noreferrer"
            className={`btn-ui mt-auto w-full py-3.5 rounded-xl text-sm text-center ${isPlatinum ? "btn-ui-primary" : "btn-ui-outline"}`}
            style={{
              borderColor: isPlatinum ? resolvedColor : 'var(--border-soft)',
              background: isPlatinum ? resolvedColor : 'var(--btn-outline-bg)',
              color: isPlatinum ? 'var(--text-inverse)' : 'var(--btn-outline-text)'
            }}
            onMouseEnter={(e) => {
              if (!isPlatinum) {
                e.currentTarget.style.borderColor = resolvedColor;
                e.currentTarget.style.color = resolvedColor;
                e.currentTarget.style.background = "var(--btn-outline-hover-bg)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isPlatinum) {
                e.currentTarget.style.borderColor = 'var(--border-soft)';
                e.currentTarget.style.color = 'var(--btn-outline-text)';
                e.currentTarget.style.background = "var(--btn-outline-bg)";
              }
            }}
          >
            Become a Sponsor
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};
const SponsorshipTiers = () => {
  const { shouldReduceMotion } = usePerformanceMode();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section id="sponsorship-tiers" className="relative py-24 sm:py-32 px-4 sm:px-6 bg-(--bg-page-elevated) overflow-hidden">

      {/*background canvas */}
      {shouldReduceMotion ? (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60 bg-[radial-gradient(circle_at_20%_20%,var(--primary-soft)_0%,transparent_45%),radial-gradient(circle_at_80%_25%,rgba(245,196,0,0.12)_0%,transparent_40%)]" />
      ) : (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={[1, 1.25]}
            gl={{ antialias: false, powerPreference: "high-performance" }}
          >
            <BackgroundNetwork />
          </Canvas>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">

        {/*header*/}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="section-heading mb-4">
            Sponsorship Tiers
          </h2>
          <div className="h-1.5 w-24 rounded-full mx-auto" style={{ background: "linear-gradient(90deg, var(--primary), var(--secondary))" }} />
        </motion.div>

        {/*tier grids*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          {tiers.map((tier, i) => (
            <TierCard key={tier.name} tier={tier} index={i} isLight={isLight} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default SponsorshipTiers;