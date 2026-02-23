"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from "react-icons/fi";
import { ensureUrl } from "@/lib/utils";
import Lanyard from "../Lanyard/Lanyard";

// Typing effect hook
function useTypingEffect(texts, typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;
    const currentText = texts[currentIndex % texts.length];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(currentText.substring(0, displayText.length + 1));
          if (displayText.length === currentText.length) {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          setDisplayText(currentText.substring(0, displayText.length - 1));
          if (displayText.length === 0) {
            setIsDeleting(false);
            setCurrentIndex((prev) => prev + 1);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}

export default function Hero({ profile }) {
  // Build typing texts from profile
  const typingTexts = profile ? [profile.title, "Fullstack Developer", "Code Artisan"] : ["Developer"];
  const typedText = useTypingEffect(typingTexts);

  if (!profile) return null;

  return (
    <section className="hero" id="home">
      {/* Subtle grid overlay */}
      <div className="hero-grid-overlay" />

      <div className="container">
        <div className="hero-grid">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="hero-left">
            <Lanyard profile={profile} />
          </motion.div>

          <div className="hero-right">
            <div className="hero-content">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <p className="hero-greeting">Hello, I&apos;m</p>
                <h1 className="hero-name">
                  <span className="gradient">{profile.name}</span>
                </h1>

                <div className="hero-typed-wrapper">
                  <span className="hero-typed-text">{typedText}</span>
                  <span className="hero-cursor">|</span>
                </div>

                <p className="hero-bio">{profile.bio}</p>

                <div className="hero-cta">
                  <a href="#projects" className="btn btn-primary">
                    View My Work <FiArrowDown />
                  </a>
                  <a href="#contact" className="btn btn-outline">
                    Get In Touch
                  </a>
                </div>

                <div className="hero-socials">
                  {profile.github && (
                    <a href={ensureUrl(profile.github)} target="_blank" rel="noreferrer" className="social-link">
                      <FiGithub />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={ensureUrl(profile.linkedin)} target="_blank" rel="noreferrer" className="social-link">
                      <FiLinkedin />
                    </a>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="social-link">
                      <FiMail />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
