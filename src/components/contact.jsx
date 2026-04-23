import { Mail, Instagram, MapPin, Phone, User } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import OrganizerStrip from "./organizerStrip";

const infoLabelClass = "flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-1 text-white";
const infoValueClass = "text-sm sm:text-base font-medium text-gray-300 transition-colors hover:text-(--text-inverse) leading-relaxed";

const TiltWrapper = ({ children, delay = 0 }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="w-full h-full"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const InfoCard = () => (
  <div
    className="flex flex-col h-full rounded-2xl p-8 sm:p-10 shadow-xl overflow-hidden relative group"
    style={{ background: "linear-gradient(135deg, #111 0%, var(--primary-dark) 150%)" }}
  >
    <div
      className="absolute top-0 right-0 w-40 h-40 bg-(--primary) rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity duration-500"
      style={{ transform: "translateZ(0)" }}
    />

    <h3 className="text-2xl font-black mb-8 text-(--text-inverse) tracking-tight" style={{ transform: "translateZ(30px)" }}>
      General Inquiries
    </h3>

    <div className="flex flex-col gap-6 mt-auto" style={{ transform: "translateZ(20px)" }}>
      <div className="group/link">
        <span className={infoLabelClass}>
          <Mail size={14} style={{ color: "var(--primary)" }} /> Email
        </span>
        <a href="mailto:codex.club@quantumeducation.in" >
          <p className={infoValueClass}>
            codex.club@quantumeducation.in
          </p>
        </a>
      </div>

      <div className="group/link">
        <span className={infoLabelClass}>
          <Instagram size={14} style={{ color: "var(--primary)" }} /> Instagram
        </span>
        <a href="https://www.instagram.com/qu_codex/" target="_blank" rel="noreferrer">
          <p className={infoValueClass}>@codexclub</p>
        </a>
      </div>

      <div>
        <span className={infoLabelClass}>
          <MapPin size={14} style={{ color: "var(--primary)" }} /> Address
        </span>
        <p className={infoValueClass}>
          Quantum University, Roorkee
        </p>
      </div>
    </div>
  </div>
);

const LeadCard = ({ name, role, desc, phone }) => (
  <div
    className="flex flex-col h-full bg-(--bg-page-elevated) rounded-2xl border border-(--border) p-8 sm:p-10 shadow-sm transition-colors duration-300 hover:border-(--primary)"
  >
    <div style={{ transform: "translateZ(30px)" }}>
      <span className="inline-flex items-center gap-1.5 w-fit text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider"
        style={{ background: "var(--secondary)", color: "var(--primary-dark)" }}>
        <User size={12} strokeWidth={2.5} />
        {role}
      </span>

      <h3 className="text-2xl font-black mb-2" style={{ color: "var(--text-light)" }}>{name}</h3>
      <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>{desc}</p>
    </div>

    <div className="mt-auto" style={{ transform: "translateZ(20px)" }}>
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        className="btn-ui btn-ui-outline w-full"
        style={{ color: "var(--primary)", borderColor: "var(--secondary)", minHeight: "52px" }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "var(--primary)";
          e.currentTarget.style.color = "var(--text-inverse)";
          e.currentTarget.style.borderColor = "var(--primary)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(140,46,124,0.2)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--primary)";
          e.currentTarget.style.borderColor = "var(--secondary)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <Phone size={16} strokeWidth={2.5} />
        {phone}
      </a>
    </div>
  </div>
);

const Contact = () => {
  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 relative overflow-hidden bg-transparent"
    >
      <div className="max-w-6xl mx-auto">

        {/*header*/}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading mb-4">
            Get In Touch
          </h2>
          <div className="h-1.5 w-20 rounded-full mx-auto" style={{ background: "linear-gradient(90deg, var(--primary), var(--secondary))" }} />
        </motion.div>

        {/*cards grid*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          <TiltWrapper delay={0.1}>
            <InfoCard />
          </TiltWrapper>

          <TiltWrapper delay={0.2}>
            <LeadCard
              name="Shobhit Singh"
              role="Event Lead"
              desc="For technical queries, track details, and platform support."
              phone="+91 98973 01104"
            />
          </TiltWrapper>

          <TiltWrapper delay={0.3}>
            <LeadCard
              name="Ayushman Ganeriwala"
              role="Event Lead"
              desc="For registration, accommodation, and general logistics info."
              phone="+91 99844 33785"
            />
          </TiltWrapper>
        </div>

        {/*organizer strip*/}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <OrganizerStrip inView={true} delay={0} />
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;