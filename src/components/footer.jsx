import logo from "../assets/qhackathon-name.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Instagram, Linkedin, Globe } from "lucide-react";

const exploreLinks = [
  { name: "Home", to: "/" },
  { name: "About", section: "about" },
  { name: "Tracks", section: "tracks" },
  { name: "Roadmap", section: "timeline-section" },
  { name: "FAQs", section: "faq" },
];

const engageLinks = [
  { name: "Register Now", to: "https://unstop.com/p/qhackathon-2026-quantum-university-roorkee-1663126" },
  { name: "Sponsor Us", to: "/sponsors" }
];
function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-(--bg-page) pt-16 pb-8 border-t border-(--border-soft) relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-(--primary) to-transparent opacity-50" />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
        <div className="md:col-span-5 lg:col-span-6 flex flex-col items-start">
          <Link to="/" className="mb-6 inline-block">
            <img src={logo} alt="Q-Hackathon Logo" className="h-10 sm:h-12 w-auto opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
          <p className="text-(--text-muted) text-sm sm:text-base leading-relaxed max-w-md mb-8 font-medium">
            Empowering the next generation of innovators through code, collaboration, and creativity.
          </p>

          {/* Socials */}
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/qu_codex/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 rounded-xl bg-(--footer-icon-bg) border border-(--footer-icon-border) flex items-center justify-center text-(--text-muted) hover:bg-(--primary) hover:border-(--primary) hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <Instagram size={18} strokeWidth={2.2} />
            </a>
            <a
              href="https://www.linkedin.com/company/qucodex/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-11 h-11 rounded-xl bg-(--footer-icon-bg) border border-(--footer-icon-border) flex items-center justify-center text-(--text-muted) hover:bg-(--primary) hover:border-(--primary) hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <Linkedin size={18} strokeWidth={2.2} />
            </a>
            <a
              href="https://www.qucodex.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Website"
              className="w-11 h-11 rounded-xl bg-(--footer-icon-bg) border border-(--footer-icon-border) flex items-center justify-center text-(--text-muted) hover:bg-(--primary) hover:border-(--primary) hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <Globe size={18} strokeWidth={2.2} />
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div className="md:col-span-3 lg:col-span-3">
          <h4 className="text-(--text-heading) font-black tracking-widest uppercase mb-6 text-sm">Explore</h4>
          <ul className="flex flex-col gap-4">
            {exploreLinks.map((link, i) => (
              <li key={i}>
                {link.to ? (
                  <Link to={link.to} className="text-(--text-muted) hover:text-(--text-heading) text-sm font-semibold transition-colors duration-200 flex items-center gap-3 group w-fit">
                    <span className="w-0 h-0.5 bg-(--primary) transition-all duration-300 group-hover:w-4"></span>
                    {link.name}
                  </Link>
                ) : (
                  <button onClick={() => handleScroll(link.section)} className="text-(--text-muted) hover:text-(--text-heading) text-sm font-semibold transition-colors duration-200 flex items-center gap-3 group cursor-pointer bg-transparent border-none p-0 text-left w-fit">
                    <span className="w-0 h-0.5 bg-(--primary) transition-all duration-300 group-hover:w-4"></span>
                    {link.name}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Engage Links */}
        <div className="md:col-span-4 lg:col-span-3">
          <h4 className="text-(--text-heading) font-black tracking-widest uppercase mb-6 text-sm">Engage</h4>
          <ul className="flex flex-col gap-4">
            {engageLinks.map((link, i) => (
              <li key={i}>
                {link.to.startsWith("http") ? (
                  <a href={link.to} target="_blank" rel="noopener noreferrer" className="text-(--text-muted) hover:text-(--text-heading) text-sm font-semibold transition-colors duration-200 flex items-center gap-3 group w-fit">
                    <span className="w-0 h-0.5 bg-(--primary) transition-all duration-300 group-hover:w-4"></span>
                    {link.name}
                  </a>
                ) : (
                  <Link to={link.to} className="text-(--text-muted) hover:text-(--text-heading) text-sm font-semibold transition-colors duration-200 flex items-center gap-3 group w-fit">
                    <span className="w-0 h-0.5 bg-(--primary) transition-all duration-300 group-hover:w-4"></span>
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Location */}
      <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-(--border-soft) flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold tracking-wide text-(--text-muted)">
        <p>© 2026 CodeX Club. Built with <span className="text-(--primary) text-sm animate-pulse">♥</span></p>
        <p className="flex items-center gap-2">
          <span className="text-(--primary) text-sm">📍</span> Quantum University
        </p>
      </div>
    </footer>
  );
}

export default Footer;