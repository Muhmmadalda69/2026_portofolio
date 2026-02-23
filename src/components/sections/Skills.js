"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiCode, FiServer, FiDatabase, FiTool, FiLayout, FiSmartphone } from "react-icons/fi";

const categoryMeta = {
  Frontend: { icon: <FiLayout />, gradient: "linear-gradient(135deg, #6c63ff, #a855f7)" },
  Backend: { icon: <FiServer />, gradient: "linear-gradient(135deg, #10b981, #06b6d4)" },
  Database: { icon: <FiDatabase />, gradient: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  Tools: { icon: <FiTool />, gradient: "linear-gradient(135deg, #ec4899, #f97316)" },
  Mobile: { icon: <FiSmartphone />, gradient: "linear-gradient(135deg, #8b5cf6, #06b6d4)" },
  Other: { icon: <FiCode />, gradient: "linear-gradient(135deg, #6366f1, #a855f7)" },
};

export default function Skills({ skills }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!skills || skills.length === 0) return null;

  // Group skills by category
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section className="section" id="skills" ref={ref}>
      <div className="container">
        <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="section-subtitle">Expertise</p>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-description">Technologies and tools I use to bring ideas to life.</p>
        </motion.div>

        <div className="skills-masonry">
          {Object.entries(grouped).map(([category, categorySkills], catIndex) => {
            const meta = categoryMeta[category] || categoryMeta.Other;
            return (
              <motion.div key={category} className="skill-card" initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.12 * catIndex }}>
                <div className="skill-card-header">
                  <div className="skill-card-icon" style={{ background: meta.gradient }}>
                    {meta.icon}
                  </div>
                  <h3 className="skill-card-title">{category}</h3>
                  <span className="skill-card-count">{categorySkills.length} skills</span>
                </div>
                <div className="skill-tags">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill.id}
                      className="skill-tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.3,
                        delay: 0.12 * catIndex + 0.05 * skillIndex,
                      }}
                      whileHover={{ scale: 1.08, y: -2 }}
                    >
                      <span className="skill-tag-dot" style={{ background: meta.gradient }} />
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
