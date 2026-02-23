"use client";

import { FiGithub, FiLinkedin, FiMail, FiHeart } from "react-icons/fi";
import { ensureUrl } from "@/lib/utils";

export default function Footer({ profile }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p className="footer-text">
            © {currentYear} {profile?.name || "Portfolio"}
          </p>

          <div className="footer-socials">
            {profile?.github && (
              <a href={ensureUrl(profile.github)} target="_blank" rel="noreferrer" className="social-link">
                <FiGithub />
              </a>
            )}
            {profile?.linkedin && (
              <a href={ensureUrl(profile.linkedin)} target="_blank" rel="noreferrer" className="social-link">
                <FiLinkedin />
              </a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="social-link">
                <FiMail />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
