import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/logo.svg";

const homeNavLinks = [
  { label: "Home", section: "home" },
  { label: "About", section: "about" },
  { label: "Tracks", section: "tracks" },
  { label: "Roadmap", section: "timeline-section" },
  { label: "FAQ", section: "faq" },
  { label: "Contact", section: "contact" },
];

const sponsorNavLinks = [
  { label: "Overview", section: "sponsor-home" },
  { label: "Stats", section: "impact-stats" },
  { label: "Sponsorship Tiers", section: "sponsorship-tiers" },
  { label: "Partnerships", section: "partnerships" },
  { label: "Partner Wall", section: "partners" },
  { label: "Join Us", section: "sponsor-cta" },
];

const NAV_ACTIVE_STORAGE_KEY = "navbar-active-sections";

const getStoredActiveSections = () => {
  const defaults = { home: "home", sponsors: "sponsor-home" };

  try {
    const raw = localStorage.getItem(NAV_ACTIVE_STORAGE_KEY);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw);
    const validHome = homeNavLinks.some((item) => item.section === parsed?.home);
    const validSponsors = sponsorNavLinks.some((item) => item.section === parsed?.sponsors);

    return {
      home: validHome ? parsed.home : defaults.home,
      sponsors: validSponsors ? parsed.sponsors : defaults.sponsors,
    };
  } catch {
    return defaults;
  }
};

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSections, setActiveSections] = useState(() => getStoredActiveSections());
  const isClickScrolling = useRef(false);
  const clickScrollTimer = useRef(null);
  const routeScrollRetryTimer = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const isSponsorsPage = location.pathname === "/sponsors";
  const isSectionPage = isHomePage || isSponsorsPage;
  const currentNavLinks = isSponsorsPage ? sponsorNavLinks : homeNavLinks;
  const activeSection = isSponsorsPage ? activeSections.sponsors : activeSections.home;

  const setPageActiveSection = useCallback((path, sectionId) => {
    const pageKey = path === "/sponsors" ? "sponsors" : "home";
    setActiveSections((prev) => {
      if (prev[pageKey] === sectionId) return prev;
      return { ...prev, [pageKey]: sectionId };
    });
  }, []);

  const getTargetPathBySection = useCallback((sectionId) => {
    if (homeNavLinks.some((item) => item.section === sectionId)) return "/";
    if (sponsorNavLinks.some((item) => item.section === sectionId)) return "/sponsors";
    return "/";
  }, []);

  useEffect(() => {
    localStorage.setItem(NAV_ACTIVE_STORAGE_KEY, JSON.stringify(activeSections));
  }, [activeSections]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!isSectionPage) return;

    const updateActiveSection = () => {
      if (isClickScrolling.current) return;

      const scrollMarker = window.scrollY + 160;
      const sectionIds = currentNavLinks.map(({ section }) => section);
      let currentSection = sectionIds[0];

      for (const sectionId of sectionIds) {
        if (sectionId === sectionIds[0]) continue;
        const section = document.getElementById(sectionId);
        if (section && scrollMarker >= section.offsetTop) {
          currentSection = sectionId;
        }
      }

      const viewportBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (viewportBottom >= docHeight - 2) {
        currentSection = sectionIds[sectionIds.length - 1];
      }

      // If the last section enters the viewport (even if its top cannot reach marker), keep it active.
      const lastSectionId = sectionIds[sectionIds.length - 1];
      const lastSectionEl = document.getElementById(lastSectionId);
      if (lastSectionEl) {
        const lastRect = lastSectionEl.getBoundingClientRect();
        if (lastRect.top <= window.innerHeight - 120) {
          currentSection = lastSectionId;
        }
      }

      setPageActiveSection(location.pathname, currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [isSectionPage, currentNavLinks, location.pathname, setPageActiveSection]);

  useEffect(() => {
    return () => {
      if (clickScrollTimer.current) {
        clearTimeout(clickScrollTimer.current);
      }
      if (routeScrollRetryTimer.current) {
        clearTimeout(routeScrollRetryTimer.current);
      }
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const scrollWithOffset = useCallback((sectionId) => {
    if (sectionId === "home" || sectionId === "sponsor-home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.getElementById(sectionId);
    if (!el) return;

    const headerOffset = 96;
    const targetTop = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }, []);

  const scrollToSection = (sectionId) => {
    closeMenu();

    isClickScrolling.current = true;
    if (clickScrollTimer.current) {
      clearTimeout(clickScrollTimer.current);
    }
    clickScrollTimer.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1800);

    const targetPath = getTargetPathBySection(sectionId);
    setPageActiveSection(targetPath, sectionId);

    if (location.pathname !== targetPath) {
      navigate(targetPath);

      if (routeScrollRetryTimer.current) {
        clearTimeout(routeScrollRetryTimer.current);
      }

      const scrollAfterRouteChange = (remainingAttempts = 12) => {
        if (sectionId === "home" || sectionId === "sponsor-home") {
          scrollWithOffset(sectionId);
          routeScrollRetryTimer.current = null;
          return;
        }

        const section = document.getElementById(sectionId);
        if (section) {
          scrollWithOffset(sectionId);
          routeScrollRetryTimer.current = null;
          return;
        }

        if (remainingAttempts > 0) {
          routeScrollRetryTimer.current = setTimeout(
            () => scrollAfterRouteChange(remainingAttempts - 1),
            120
          );
        } else {
          routeScrollRetryTimer.current = null;
        }
      };

      scrollAfterRouteChange();
    } else {
      scrollWithOffset(sectionId);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)] py-3" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="relative z-10 flex items-center gap-2" onClick={() => scrollToSection("home")}>
            <img src={logo} className="h-8 sm:h-10 w-auto drop-shadow-sm" alt="Q-Hackathon" />
          </Link>

          {/* Desktop Nav */}
          {isSectionPage ? (
            <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/40 shadow-inner">
              {currentNavLinks.map(({ label, section }) => {
                const isActive = activeSection === section && isSectionPage;
                return (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`relative px-5 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${
                      isActive ? "text-white" : "text-(--text-dark) hover:text-(--primary)"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-(--primary) rounded-full -z-10 shadow-md"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {label}
                  </button>
                );
              })}
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-4 p-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/40 shadow-inner">
              <button
                onClick={() => scrollToSection("home")}
                className="px-5 py-2 rounded-full text-sm font-bold text-(--text-dark) hover:text-(--primary) transition-colors duration-300"
              >
                Home
              </button>
              <span className="h-5 w-px bg-(--border)" />
              <Link
                to="/sponsors"
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${location.pathname === '/sponsors' ? 'bg-(--primary) text-white' : 'text-(--text-dark) hover:text-(--primary)'}`}
                onClick={closeMenu}
              >
                Sponsors
              </Link>
            </nav>
          )}
          <div className="hidden md:flex items-center gap-4">
            {isSponsorsPage ? (
              <Link 
                to="/" 
                className="text-sm font-bold text-(--text-dark) hover:text-(--primary) transition-colors"
                onClick={closeMenu}
              >
                Home
              </Link>
            ) : (
              <Link 
                to="/sponsors" 
                className={`text-sm font-bold transition-colors ${location.pathname === '/sponsors' ? 'text-(--primary)' : 'text-(--text-dark) hover:text-(--primary)'}`}
                onClick={closeMenu}
              >
                Sponsors
              </Link>
            )}
            <a
              href="https://unstop.com/p/qhackathon-2026-quantum-university-roorkee-1663126"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-(--primary) text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-[0_0_20px_rgba(140,46,124,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Register
            </a>
          </div>

          {/*mobile menu */}
          <button
            className="md:hidden relative z-50 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-(--primary) rounded-full transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 bg-(--primary) rounded-full transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-(--primary) rounded-full transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm z-50 bg-(--bg-light) shadow-2xl flex flex-col pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {(isSectionPage ? currentNavLinks : [{ label: "Home", section: "home" }]).map(({ label, section }, i) => {
                const isActive = activeSection === section && isSectionPage;
                return (
                  <motion.button
                    key={section}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => scrollToSection(section)}
                    className={`text-left text-lg font-bold py-3 px-4 rounded-xl transition-colors ${
                      isActive
                        ? "bg-(--primary)/10 text-(--primary)"
                        : "text-(--text-dark)"
                    }`}
                  >
                    {label}
                  </motion.button>
                )
              })}
              
              <div className="h-px bg-(--border) my-4 w-full" />

              <Link
                to={isSponsorsPage ? "/" : "/sponsors"}
                className={`text-lg font-bold py-3 px-4 rounded-xl ${isSponsorsPage ? 'text-(--text-dark)' : (location.pathname === '/sponsors' ? 'text-(--primary)' : 'text-(--text-dark)')}`}
                onClick={closeMenu}
              >
                {isSponsorsPage ? "Home" : "Sponsors"}
              </Link>

              <a
                href="https://unstop.com/p/qhackathon-2026-quantum-university-roorkee-1663126"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 text-center py-4 rounded-xl bg-(--primary) text-white font-black tracking-widest uppercase shadow-md"
              >
                Register Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;