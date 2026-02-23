"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiExternalLink, FiGithub, FiFolder } from "react-icons/fi";

export default function Projects({ projects }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!projects || projects.length === 0) return null;

  return (
    <section className="section" id="projects" ref={ref}>
      <div className="container">
        <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="section-subtitle">Portfolio</p>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-description">A selection of projects I&apos;ve built, showcasing my skills and experience.</p>
        </motion.div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div key={project.id} className="project-card" initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 * index }} whileHover={{ y: -6 }}>
              <div className="project-image">
                {project.image ? <img src={project.image} alt={project.title} /> : <FiFolder className="project-image-placeholder" />}
                {project.featured && <span className="project-featured-badge">Featured</span>}
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                <div className="project-tech">
                  {project.techStack.split(",").map((tech) => (
                    <span key={tech.trim()} className="tech-tag">
                      {tech.trim()}
                    </span>
                  ))}
                </div>

                <div className="project-links">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-link">
                      <FiExternalLink /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-link">
                      <FiGithub /> Source Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
