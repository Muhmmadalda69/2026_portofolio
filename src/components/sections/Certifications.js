"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiAward, FiExternalLink, FiCalendar } from "react-icons/fi";

export default function Certifications({ certifications }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!certifications || certifications.length === 0) return null;

  return (
    <section className="section" id="certifications" ref={ref} style={{ background: "var(--bg-secondary)" }}>
      <div className="container">
        <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="section-subtitle">Recognition</p>
          <h2 className="section-title">Certifications & Training</h2>
          <p className="section-description">Formal recognition of my skills and professional development.</p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "24px",
            marginTop: "40px",
          }}
        >
          {certifications.map((cert, index) => {
            const isPdf = cert.image?.toLowerCase().endsWith(".pdf");
            return (
              <motion.div
                key={cert.id}
                className="glass-card"
                style={{
                  position: "relative",
                  padding: "30px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  height: "100%",
                  border: "1px solid var(--border-color)",
                  overflow: "hidden",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5, borderColor: "var(--accent-primary)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: "var(--accent-gradient)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.5rem",
                    }}
                  >
                    <FiAward />
                  </div>
                  {(cert.url || isPdf) && (
                    <a href={isPdf ? cert.image : cert.url} target="_blank" rel="noopener noreferrer" className="admin-btn-icon" style={{ color: "var(--text-muted)" }}>
                      <FiExternalLink />
                    </a>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "4px" }}>{cert.title}</h3>
                  <p style={{ color: "var(--accent-primary)", fontWeight: 600, fontSize: "0.95rem" }}>{cert.issuer}</p>
                </div>

                {cert.description && <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>{cert.description}</p>}

                {cert.image && !isPdf && (
                  <div style={{ borderRadius: "8px", overflow: "hidden", marginTop: "8px", border: "1px solid var(--border-color)" }}>
                    <img src={cert.image} alt={cert.title} style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                )}

                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    <FiCalendar style={{ color: "var(--accent-secondary)" }} />
                    <span>{cert.date}</span>
                  </div>
                  {isPdf && (
                    <a
                      href={cert.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: "auto",
                        fontSize: "0.8rem",
                        color: "var(--accent-primary)",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      View PDF <FiExternalLink size={12} />
                    </a>
                  )}
                </div>

                {/* Decorative gradient blur */}
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "100px",
                    height: "100px",
                    background: "var(--accent-gradient)",
                    filter: "blur(50px)",
                    opacity: 0.05,
                    zIndex: -1,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
