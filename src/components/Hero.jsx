import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import logo from "../assets/qhackathon-name.svg";
import robot from "../assets/hero-robo.svg";

const Hero = () => {
  const calculateTimeLeft = () => {
    const countDate = new Date("May 1, 2026 09:00:00").getTime();
    const gap = countDate - Date.now();
    if (gap <= 0) return null;
    const s = 1000, m = s * 60, h = m * 60, d = h * 24;
    return {
      days: Math.floor(gap / d),
      hours: Math.floor((gap % d) / h),
      mins: Math.floor((gap % h) / m),
      secs: Math.floor((gap % m) / s),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeUnits = timeLeft
    ? [
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hrs" },
        { value: timeLeft.mins, label: "Min" },
        { value: timeLeft.secs, label: "Sec" },
      ]
    : [];
//layout varients
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 80, damping: 15 } 
    },
  };

  //3d hover tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <section
      className="relative min-h-svh flex items-center px-4 sm:px-6 py-14 overflow-hidden"
      style={{ background: "radial-gradient(circle at top left, var(--secondary), var(--bg-light) 60%)" }}
    >
      {/*background circle*/}
      <div className="pointer-events-none absolute -top-20 -left-20 w-65 h-65 sm:w-115 sm:h-115 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--primary)" }} />
      <div className="pointer-events-none absolute bottom-0 right-0 w-50 h-50 sm:w-95 sm:h-95 rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--primary-dark)" }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-16">
        
        {/*robot */}
        <motion.div
          className="w-full lg:flex-1 flex justify-center lg:order-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1000 }} 
        >
          <motion.img
            src={robot}
            alt="Hackathon Robot Mascot"
            className="w-36 sm:w-56 lg:w-full lg:max-w-100"
            style={{ 
              rotateX, 
              rotateY, 
              transformStyle: "preserve-3d",
              filter: "drop-shadow(0 25px 35px rgba(140,46,124,0.25))"
            }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/*leftside content*/}
        <motion.div 
          className="lg:order-1 lg:flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/*logo qhackathon */}
          <motion.img
            src={logo}
            alt="Q-Hackathon 2026 Logo"
            className="w-40 sm:w-56 lg:max-w-xs mb-4 drop-shadow-md"
            variants={itemVariants}
          />
          {/*subtitle */}
          <motion.p
            className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1"
            style={{ color: "var(--primary)", letterSpacing: "-0.4px" }}
            variants={itemVariants}
          >
            36-Hour Intercollegiate Hackathon
          </motion.p>

          {/*date and location*/}
          <motion.p
            className="text-xs sm:text-sm lg:text-base font-semibold mb-5 sm:mb-7 opacity-70"
            style={{ color: "var(--text-dark)" }}
            variants={itemVariants}
          >
            1-2 May 2026 &bull; Quantum University
          </motion.p>

          {/*buttons*/}
          <motion.div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 mb-6 sm:mb-10 w-full sm:w-auto" variants={itemVariants}>
            <a href="https://unstop.com/p/qhackathon-2026-quantum-university-roorkee-1663126" className="w-full sm:w-auto">
              <motion.button
                className="w-full font-bold text-sm px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-(--radius) border-none cursor-pointer"
                style={{
                  background: "var(--primary)",
                  color: "var(--text-light)",
                  boxShadow: "0 6px 18px rgba(140,46,124,0.28)",
                  fontFamily: "inherit",
                }}
                whileHover={{ scale: 1.05, y: -2, backgroundColor: "var(--primary-dark)" }}
                whileTap={{ scale: 0.95 }}
              >
                Register Now
              </motion.button>
            </a>
            <motion.button
              onClick={() => {
                const el = document.getElementById("tracks");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto font-bold text-sm px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-(--radius) cursor-pointer"
              style={{
                border: "2px solid var(--border)",
                color: "var(--text-dark)",
                background: "transparent",
                fontFamily: "inherit"
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -2, 
                borderColor: "var(--primary)", 
                color: "var(--primary)", 
                backgroundColor: "var(--secondary)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              View Tracks
            </motion.button>
          </motion.div>

          {/*countdown*/}
          {timeLeft ? (
            <motion.div className="flex flex-row gap-2 sm:gap-3 w-full sm:w-auto" variants={itemVariants}>
              {timeUnits.map(({ value, label }) => (
                <div
                  key={label}
                  className="flex-1 text-center rounded-(--radius) py-2.5 sm:py-3.5 px-1 sm:px-4"
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.85)",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                  }}
                >
                  <span className="block text-xl sm:text-3xl font-bold leading-none mb-0.5" style={{ color: "var(--primary)" }}>
                    {String(value).padStart(2, "0")}
                  </span>
                  <small className="uppercase text-[9px] sm:text-[11px] font-semibold tracking-wider opacity-60" style={{ color: "var(--text-dark)" }}>
                    {label}
                  </small>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.h3 variants={itemVariants} className="text-lg sm:text-2xl font-bold" style={{ color: "var(--primary)" }}>
               The Hackathon has started!
            </motion.h3>
          )}

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;