"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FiMail, FiPhone, FiMapPin, FiUser } from "react-icons/fi";

export default function About({ profile, experienceCount, projectCount, skillCount }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!profile) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="section" id="about" ref={ref}>
      <div className="container">
        <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="section-subtitle">About Me</p>
          <h2 className="section-title">Get To Know Me</h2>
          <p className="section-description">A brief introduction about myself, my journey, and what I bring to the table.</p>
        </motion.div>

        <motion.div className="about-grid" variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <motion.div className="about-image-wrapper" variants={itemVariants}>
            <div className="about-image-frame">
              <div className="about-image-inner">{profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : <FiUser style={{ fontSize: "6rem", color: "var(--text-muted)" }} />}</div>
            </div>

            <div className="about-stats">
              <motion.div className="stat-card" whileHover={{ scale: 1.05, y: -4 }}>
                <div className="stat-number">{experienceCount}+</div>
                <div className="stat-label">Experiences</div>
              </motion.div>
              <motion.div className="stat-card" whileHover={{ scale: 1.05, y: -4 }}>
                <div className="stat-number">{projectCount}+</div>
                <div className="stat-label">Projects</div>
              </motion.div>
              <motion.div className="stat-card" whileHover={{ scale: 1.05, y: -4 }}>
                <div className="stat-number">{skillCount}+</div>
                <div className="stat-label">Skills</div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="about-text">
              <p>{profile.bio}</p>
            </div>

            <div className="about-info">
              {profile.email && (
                <div className="about-info-item">
                  <FiMail className="icon" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="about-info-item">
                  <FiPhone className="icon" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.github && (
                <div className="about-info-item">
                  <FiMapPin className="icon" />
                  <span>Indonesia</span>
                </div>
              )}
              <div className="about-info-item">
                <FiUser className="icon" />
                <span>{profile.title}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
