"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav className={`navbar ${scrolled ? "scrolled" : ""}`} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
      <div className="container">
        <a href="#home" className="nav-logo" onClick={(e) => handleNavClick(e, "#home")}>
          Portofolio<span style={{ color: "var(--accent-pink)" }}>.</span>
        </a>

        <ul className={`nav-links ${mobileOpen ? "open" : ""}`}>
          {mobileOpen && (
            <button className="nav-hamburger" onClick={() => setMobileOpen(false)} style={{ position: "absolute", top: 24, right: 24 }}>
              <FiX size={24} color="var(--accent-secondary)" />
            </button>
          )}
          {navItems.map((item, i) => (
            <motion.li key={item.href} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i, duration: 0.4 }}>
              <a href={item.href} className="nav-link" onClick={(e) => handleNavClick(e, item.href)}>
                {item.label}
              </a>
            </motion.li>
          ))}
        </ul>

        {!mobileOpen && (
          <button className="nav-hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <FiMenu size={24} color="var(--accent-secondary)" />
          </button>
        )}
      </div>
    </motion.nav>
  );
}
