"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSave, FiUser } from "react-icons/fi";
import ImageUpload from "@/components/ImageUpload";

export default function ProfileAdmin() {
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    avatar: "",
    github: "",
    linkedin: "",
    email: "",
    phone: "",
    resumeUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [securityForm, setSecurityForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityStatus, setSecurityStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data && !data.error) {
        setForm({
          name: data.name || "",
          title: data.title || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          email: data.email || "",
          phone: data.phone || "",
          resumeUrl: data.resumeUrl || "",
        });
        // Also pre-fill security email
        setSecurityForm((prev) => ({ ...prev, email: data.email || "" }));
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      avatar: form.avatar || null,
      github: form.github || null,
      linkedin: form.linkedin || null,
      email: form.email || null,
      phone: form.phone || null,
      resumeUrl: form.resumeUrl || null,
    };

    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecurityStatus({ type: "", message: "" });

    if (securityForm.password && securityForm.password !== securityForm.confirmPassword) {
      setSecurityStatus({ type: "error", message: "Passwords do not match!" });
      return;
    }

    setSecurityLoading(true);

    try {
      const res = await fetch("/api/admin/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: securityForm.email,
          password: securityForm.password || undefined,
          name: form.name,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSecurityStatus({ type: "success", message: "Security settings updated! Please re-login if you changed your email or password." });
        setSecurityForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        setSecurityStatus({ type: "error", message: data.error || "Update failed" });
      }
    } catch (err) {
      setSecurityStatus({ type: "error", message: "An error occurred during update." });
    }

    setSecurityLoading(false);
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Profile</h1>
      </div>

      <motion.div className="admin-table-wrapper" style={{ padding: 32 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: "var(--accent-gradient)",
                padding: 2,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 18,
                  background: "var(--bg-card)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {form.avatar ? <img src={form.avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <FiUser size={32} color="var(--text-muted)" />}
              </div>
            </div>
            <div>
              <h3 style={{ marginBottom: 4 }}>{form.name || "Your Name"}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{form.title || "Your Title"}</p>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Full Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
            </div>
            <div className="admin-form-group">
              <label>Job Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Full Stack Developer" required />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Bio *</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell visitors about yourself..." rows={4} required />
          </div>

          <ImageUpload label="Avatar" value={form.avatar} onChange={(val) => setForm({ ...form, avatar: val })} />

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="hello@example.com" />
            </div>
            <div className="admin-form-group">
              <label>Phone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+62 812-3456-7890" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>GitHub URL</label>
              <input type="text" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/username" />
            </div>
            <div className="admin-form-group">
              <label>LinkedIn URL</label>
              <input type="text" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Resume URL</label>
            <input type="text" value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} placeholder="https://example.com/resume.pdf" />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
            <motion.button className="admin-btn admin-btn-primary" type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <FiSave /> {saving ? "Saving..." : "Save Profile"}
            </motion.button>

            {saved && (
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ color: "#10b981", fontSize: "0.9rem", fontWeight: 500 }}>
                ✓ Profile saved successfully!
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>

      <div className="admin-header" style={{ marginTop: 48 }}>
        <h1>Security Settings</h1>
      </div>

      <motion.div className="admin-table-wrapper" style={{ padding: 32, marginBottom: 48 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <form onSubmit={handleSecuritySubmit}>
          <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: "0.95rem" }}>
            Update your administrative login credentials.
            <span style={{ color: "var(--accent-pink)", marginLeft: 8 }}>Warning: You may need to log in again after updating these settings.</span>
          </p>

          <div className="admin-form-group">
            <label>Login Email</label>
            <input type="email" value={securityForm.email} onChange={(e) => setSecurityForm({ ...securityForm, email: e.target.value })} required />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>New Password (leave blank to keep current)</label>
              <input type="password" value={securityForm.password} onChange={(e) => setSecurityForm({ ...securityForm, password: e.target.value })} autoComplete="new-password" />
            </div>
            <div className="admin-form-group">
              <label>Confirm New Password</label>
              <input type="password" value={securityForm.confirmPassword} onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })} autoComplete="new-password" />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
            <motion.button className="admin-btn admin-btn-primary" type="submit" disabled={securityLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <FiSave /> {securityLoading ? "Updating..." : "Update Security Settings"}
            </motion.button>

            {securityStatus.message && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  color: securityStatus.type === "success" ? "#10b981" : "#ef4444",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {securityStatus.type === "success" ? "✓" : "⚠"} {securityStatus.message}
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
