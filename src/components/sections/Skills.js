"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import DynamicIcon from "../DynamicIcon";

export default function Skills({ skills }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!skills || skills.length === 0) return null;

  // Group skills by category using the relation
  const grouped = skills.reduce((acc, skill) => {
    const categoryName = skill.categoryRel?.name || "Other";
    if (!acc[categoryName]) {
      acc[categoryName] = {
        skills: [],
        meta: {
          icon: skill.categoryRel?.icon || "FiCode",
          gradient: skill.categoryRel?.gradient || "linear-gradient(135deg, #6366f1, #a855f7)",
          order: skill.categoryRel?.order || 99,
        },
      };
    }
    acc[categoryName].skills.push(skill);
    return acc;
  }, {});

  // Sort categories by their display order
  const sortedCategories = Object.entries(grouped).sort((a, b) => a[1].meta.order - b[1].meta.order);

  return (
    <section className="section" id="skills" ref={ref}>
      <div className="container">
        <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="section-subtitle">Expertise</p>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-description">Technologies and tools I use to bring ideas to life.</p>
        </motion.div>

        <div className="skills-masonry">
          {sortedCategories.map(([category, data], catIndex) => {
            const { skills: categorySkills, meta } = data;
            return (
              <motion.div key={category} className="skill-card" initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.12 * catIndex }}>
                <div className="skill-card-header">
                  <div className="skill-card-icon" style={{ background: meta.gradient }}>
                    <DynamicIcon name={meta.icon} />
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
                      <DynamicIcon name={skill.icon} style={{ fontSize: "1rem", marginRight: "8px" }} />
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
