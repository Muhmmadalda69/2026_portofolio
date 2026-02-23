"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiFolder, FiStar, FiUser } from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    experiences: 0,
    projects: 0,
    skills: 0,
    profile: null,
  });

  useEffect(() => {
    async function fetchStats() {
      const [expRes, projRes, skillRes, profileRes] = await Promise.all([fetch("/api/experiences"), fetch("/api/projects"), fetch("/api/skills"), fetch("/api/profile")]);
      const [experiences, projects, skills, profile] = await Promise.all([expRes.json(), projRes.json(), skillRes.json(), profileRes.json()]);
      setStats({
        experiences: Array.isArray(experiences) ? experiences.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        skills: Array.isArray(skills) ? skills.length : 0,
        profile,
      });
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Experiences", value: stats.experiences, icon: <FiBriefcase />, color: "#6c63ff" },
    { label: "Projects", value: stats.projects, icon: <FiFolder />, color: "#a855f7" },
    { label: "Skills", value: stats.skills, icon: <FiStar />, color: "#ec4899" },
    { label: "Profile", value: stats.profile ? "✓" : "✗", icon: <FiUser />, color: "#10b981" },
  ];

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>Welcome back! Here&apos;s an overview of your portfolio.</p>
        </div>
      </div>

      <div className="admin-stats">
        {statCards.map((stat, index) => (
          <motion.div key={stat.label} className="admin-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
            <div className="admin-stat-icon" style={{ background: stat.color }}>
              {stat.icon}
            </div>
            <div className="admin-stat-value">{stat.value}</div>
            <div className="admin-stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="admin-table-wrapper" style={{ padding: 32 }}>
        <h3 style={{ marginBottom: 16 }}>Quick Tips</h3>
        <ul style={{ color: "var(--text-secondary)", lineHeight: 2, paddingLeft: 20, listStyle: "disc" }}>
          <li>Use the sidebar to navigate between sections</li>
          <li>Add, edit, or delete content from each section</li>
          <li>Changes are reflected on the portfolio immediately</li>
          <li>Use the &quot;View Site&quot; link to see your live portfolio</li>
          <li>
            Set the <strong>order</strong> field to control display sequence
          </li>
        </ul>
      </div>
    </div>
  );
}
