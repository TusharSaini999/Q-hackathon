import { useState, useRef } from "react";
import { 
  ClipboardList, ClipboardX, PartyPopper, ScanSearch, 
  Trophy, CheckCircle2, Target, BookOpen, ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";

const events = [
  {
    date: "April 15, 2026",
    title: "Registration Opens",
    description: "Secure your spot and start forming your dream team.",
    instructions: [
      "Register individually or as a team of 4-6 members.",
      "Finalize tech stack and brainstorm core problem statements.",
      "Early preparation is encouraged for a smoother dev phase."
    ],
    Icon: ClipboardList,
  },
  {
    date: "April 30, 2026",
    title: "Registration Closes",
    description: "Final call for applications. No entries accepted after midnight.",
    instructions: [
      "No entries will be accepted after 11:59 PM.",
      "Ensure all team member details are verified.",
      "Teams should be fully formed and ready for the opening ceremony."
    ],
    Icon: ClipboardX,
  },
  {
    date: "May 08, 09:00 AM",
    title: "Opening Ceremony",
    description: "Keynote speeches, track reveals, and the 36-hour hack begins!",
    instructions: [
      "Welcome address and keynote sessions.",
      "Hackathon rules and judging criteria explained."
    ],
    Icon: PartyPopper,
  },
  {
    date: "May 08, 09:00 PM",
    title: "Round 1: Dev Phase",
    description: "Intensive building period with mentor support.",
    deliverables: [
      "Functional prototype or working model.",
      "Clear problem definition and solution approach.",
      "Basic UI/UX (if applicable)."
    ],
    instructions: [
      "Mentors will be available throughout the night for guidance.",
      "Continuous progress is expected (avoid last-minute builds)."
    ],
    Icon: ScanSearch,
  },
  {
    date: "May 09, 10:00 AM",
    title: "Round 1 Evaluation",
    description: "Progress check-in with the judging panel.",
    evaluation: [
      "Innovation and idea clarity.",
      "Technical implementation progress.",
      "Feasibility and potential impact."
    ],
    instructions: [
      "Shortlisting of top teams for the Final Presentation."
    ],
    Icon: ScanSearch,
  },
  {
    date: "May 09, 12:00 PM",
    title: "Final Presentation",
    description: "Pitch your solution to our panel of industry experts.",
    instructions: [
      "5-8 minutes: Solution presentation.",
      "3-5 minutes: Q&A with judges.",
      "Focus: Technical depth and real-world applicability."
    ],
    Icon: Trophy,
  },
];

const PipelineCard = ({ title, description, instructions, deliverables, evaluation, Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const hasDetails = instructions || deliverables || evaluation;

  return (
    <motion.div
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="w-full"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onClick={() => setIsOpen(!isOpen)}
        className="roadmap-card relative overflow-hidden rounded-2xl border shadow-sm hover:shadow-lg p-6 sm:p-7 transition-all duration-500 text-left cursor-pointer bg-white"
      >
        <div className="flex items-start gap-4" style={{ transform: "translateZ(30px)" }}>
          <div className="roadmap-card-icon shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner" style={{ background: "var(--secondary)" }}>
            <Icon size={24} className="text-(--primary)" strokeWidth={2.5} />
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="roadmap-card-title text-lg sm:text-xl font-black mb-1">{title}</h3>
                <p className="roadmap-card-desc text-sm font-medium text-(--text-muted)">{description}</p>
              </div>
              
              {hasDetails && (
                <motion.div 
                  animate={{ rotate: isOpen ? 180 : 0 }} 
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="shrink-0 mt-1 p-1 rounded-full bg-(--bg-light) text-(--primary)"
                >
                  <ChevronDown size={20} />
                </motion.div>
              )}
            </div>
            
            {/* Smooth height accordion for details */}
            <AnimatePresence>
              {isOpen && hasDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ opacity: { duration: 0.2 }, height: { type: "spring", stiffness: 100, damping: 15 } }}
                  className="overflow-hidden"
                >
                  <div className="roadmap-card-divider space-y-4 border-t pt-4 mt-4">
                    {instructions && (
                        <div className="space-y-2">
                        <div className="flex items-center gap-2 text-(--primary) font-bold text-xs uppercase tracking-tighter">
                          <BookOpen size={14} /> Guidelines
                        </div>
                        {instructions.map((item, i) => (
                          <div key={i} className="roadmap-card-detail flex gap-2 text-xs sm:text-sm text-(--text-dark)">
                            <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-green-500" /> {item}
                          </div>
                        ))}
                        </div>
                    )}
                    {deliverables && (
                        <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-tighter">
                          <Target size={14} /> Deliverables
                        </div>
                        {deliverables.map((item, i) => (
                          <div key={i} className="roadmap-card-detail flex gap-2 text-xs sm:text-sm italic text-(--text-dark)">
                            • {item}
                          </div>
                        ))}
                        </div>
                    )}
                    {evaluation && (
                        <div className="roadmap-card-eval p-3 border shadow-sm rounded-lg space-y-2 mt-2 bg-(--bg-card-dark)">
                        <div className="roadmap-card-eval-title font-bold text-xs uppercase tracking-tighter flex items-center gap-2">
                          <ScanSearch size={14} /> Evaluation Criteria
                        </div>
                        {evaluation.map((item, i) => (
                          <div key={i} className="roadmap-card-eval-item text-xs sm:text-sm flex items-center gap-2 text-(--text-dark)">
                            <div className="w-1.5 h-1.5 rounded-full bg-(--primary) shrink-0" /> {item}
                          </div>
                        ))}
                        </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Timeline = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  return (
    <section id="timeline-section" ref={containerRef} className="relative py-24 px-4 bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="section-heading mb-4 text-4xl sm:text-5xl font-black tracking-tight">Event Roadmap</h2>
          <div className="h-1.5 w-24 rounded-full mx-auto" style={{ background: "linear-gradient(90deg, var(--primary), var(--secondary))" }} />
          <p className="mt-4 text-(--text-muted) font-medium">Detailed schedule, deliverables, and expectations.</p>
        </motion.div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-7 md:left-1/2 md:-translate-x-1/2 w-1 rounded-full bg-(--border-soft)" />
                    <motion.div 
            className="absolute top-0 bottom-0 left-7 md:left-1/2 md:-translate-x-1/2 w-1 rounded-full origin-top shadow-[0_0_15px_rgba(140,46,124,0.6)]"
            style={{ scaleY, background: "var(--primary)" }}
          />

          <div className="relative z-10 space-y-16">
            {events.map((evt, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={evt.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative flex flex-col md:flex-row items-start w-full"
                >
                  <div className="absolute left-7 md:left-1/2 md:-translate-x-1/2 top-0 md:top-6 w-5 h-5 rounded-full border-4 z-20 shadow-lg -ml-2.5" style={{ borderColor: "var(--bg-light)", background: "var(--primary)" }} />

                  <div className="md:hidden w-full pl-16">
                    <span className="block mb-2 text-sm font-black uppercase tracking-widest" style={{ color: "var(--primary)" }}>{evt.date}</span>
                    <PipelineCard {...evt} />
                  </div>
                  <div className="hidden md:flex w-full">
                    {isEven ? (
                      <>
                        <div className="w-1/2 pr-16 flex flex-col items-end">
                          <span className="block mb-3 text-sm font-black uppercase tracking-widest" style={{ color: "var(--primary)" }}>{evt.date}</span>
                          <div className="w-full max-w-lg">
                            <PipelineCard {...evt} />
                          </div>
                        </div>
                        <div className="w-1/2 pl-16"></div>
                      </>
                    ) : (
                      <>
                        <div className="w-1/2 pr-16"></div>
                        <div className="w-1/2 pl-16 flex flex-col items-start">
                          <span className="block mb-3 text-sm font-black uppercase tracking-widest" style={{ color: "var(--primary)" }}>{evt.date}</span>
                          <div className="w-full max-w-lg">
                            <PipelineCard {...evt} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;