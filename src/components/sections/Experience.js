"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Experience({ experiences }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!experiences || experiences.length === 0) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Present";
    const [year, month] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <section className="section" id="experience" ref={ref}>
      <div className="container">
        <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="section-subtitle">Career Path</p>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-description">My professional journey and the companies I&apos;ve had the pleasure of working with.</p>
        </motion.div>

        <div className="timeline">
          {experiences.map((exp, index) => (
            <motion.div key={exp.id} className="timeline-item" initial={{ opacity: 0, x: index % 2 === 0 ? 60 : -60 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 * index }}>
              <motion.div className="timeline-dot" initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ duration: 0.4, delay: 0.2 * index + 0.1 }} />
              <motion.div className="timeline-card" whileHover={{ scale: 1.02 }}>
                <div className="timeline-date">
                  {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                </div>
                <h3 className="timeline-position">{exp.position}</h3>
                <p className="timeline-company">{exp.company}</p>
                <p className="timeline-description">{exp.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
