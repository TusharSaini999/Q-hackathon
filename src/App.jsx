import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Sponsors from "./pages/Sponsors";
import { Suspense, lazy, useEffect, useRef } from "react";
const GlobalCanvas = lazy(() => import("./components/GlobalCanvas"));

const NAV_ACTIVE_STORAGE_KEY = "navbar-active-sections";

const getStoredRouteSection = (pathname) => {
  try {
    const raw = localStorage.getItem(NAV_ACTIVE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (pathname === "/sponsors") return parsed?.sponsors || null;
    if (pathname === "/") return parsed?.home || null;
    return null;
  } catch {
    return null;
  }
};

function RouteScrollAnimator() {
  const { pathname } = useLocation();
  const restoreTimerRef = useRef(null);

  useEffect(() => {
    const sectionId = getStoredRouteSection(pathname);
    const storedTop = Number(sessionStorage.getItem(`scroll-pos:${pathname}`));
    const targetTop = Number.isFinite(storedTop) ? storedTop : 0;
    let cancelled = false;

    const scrollToRememberedTarget = (remainingAttempts = 14) => {
      if (cancelled) return;

      const isTopSection = sectionId === "home" || sectionId === "sponsor-home";
      if (sectionId && !isTopSection) {
        const targetEl = document.getElementById(sectionId);
        if (targetEl) {
          const headerOffset = 96;
          const elementTop = targetEl.offsetTop - headerOffset;
          window.scrollTo({ top: Math.max(0, elementTop), behavior: "auto" });
          return;
        }

        if (remainingAttempts > 0) {
          restoreTimerRef.current = setTimeout(
            () => scrollToRememberedTarget(remainingAttempts - 1),
            100
          );
          return;
        }
      }

      window.scrollTo({ top: targetTop, behavior: "auto" });
    };

    requestAnimationFrame(() => {
      scrollToRememberedTarget();
    });

    return () => {
      cancelled = true;
      if (restoreTimerRef.current) {
        clearTimeout(restoreTimerRef.current);
        restoreTimerRef.current = null;
      }
    };
  }, [pathname]);

  useEffect(() => {
    const persistScroll = () => {
      sessionStorage.setItem(`scroll-pos:${pathname}`, String(window.scrollY));
    };

    window.addEventListener("scroll", persistScroll, { passive: true });

    return () => {
      persistScroll();
      window.removeEventListener("scroll", persistScroll);
    };
  }, [pathname]);

  return null;
}

function AppContent() {
  const { pathname } = useLocation();
  const showGlobalCanvas = pathname === "/";

  return (
    <div className="relative min-h-screen bg-[var(--bg-page)] font-sans">
      {showGlobalCanvas ? (
        <Suspense fallback={<div className="absolute inset-0 bg-[var(--bg-page)] -z-20" />}>
          <GlobalCanvas />
        </Suspense>
      ) : null}

      <div className="relative z-10 flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sponsors" element={<Sponsors />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RouteScrollAnimator />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;