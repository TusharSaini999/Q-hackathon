import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
    { value: "system", label: "System", Icon: Monitor },
  ];

  const CurrentIcon = options.find((opt) => opt.value === theme)?.Icon || Monitor;

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full border border-[var(--toggle-border)] bg-[var(--toggle-bg)] hover:bg-[var(--toggle-bg-hover)] transition-all backdrop-blur-md shadow-sm"
        aria-label="Toggle theme"
      >
        <CurrentIcon size={18} className="text-[var(--toggle-icon)] drop-shadow-md" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-36 rounded-xl border border-[var(--toggle-menu-border)] bg-[var(--toggle-menu-bg)] backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col p-1.5 gap-1">
              {options.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setTheme(value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    theme === value 
                      ? "bg-(--primary) text-white shadow-md" 
                      : "text-[var(--toggle-item-text)] hover:bg-[var(--toggle-item-hover-bg)] hover:text-[var(--toggle-item-hover-text)]"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;