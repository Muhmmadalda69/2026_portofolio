"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

export default function Contact({ profile }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (!profile) return null;

  return (
    <section className="section" id="contact" ref={ref}>
      <div className="container">
        <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="section-subtitle">Get In Touch</p>
          <h2 className="section-title">Contact Me</h2>
          <p className="section-description">Have a project in mind or want to collaborate? Feel free to reach out!</p>
        </motion.div>

        <motion.div className="contact-grid" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="contact-info">
            <h3>Let&apos;s work together</h3>
            <p>I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Drop me a message!</p>

            <div className="contact-items">
              {profile.email && (
                <motion.div className="contact-item" whileHover={{ x: 8 }} transition={{ duration: 0.2 }}>
                  <div className="contact-item-icon">
                    <FiMail />
                  </div>
                  <div>
                    <div className="contact-item-label">Email</div>
                    <div className="contact-item-value">{profile.email}</div>
                  </div>
                </motion.div>
              )}
              {profile.phone && (
                <motion.div className="contact-item" whileHover={{ x: 8 }} transition={{ duration: 0.2 }}>
                  <div className="contact-item-icon">
                    <FiPhone />
                  </div>
                  <div>
                    <div className="contact-item-label">Phone</div>
                    <div className="contact-item-value">{profile.phone}</div>
                  </div>
                </motion.div>
              )}
              <motion.div className="contact-item" whileHover={{ x: 8 }} transition={{ duration: 0.2 }}>
                <div className="contact-item-icon">
                  <FiMapPin />
                </div>
                <div>
                  <div className="contact-item-label">Location</div>
                  <div className="contact-item-value">Indonesia</div>
                </div>
              </motion.div>
            </div>
          </div>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Subject" />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows={5} required />
            </div>
            <motion.button className="btn btn-primary" type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Send Message <FiSend />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
