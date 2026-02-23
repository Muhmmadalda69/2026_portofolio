"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertTriangle, FiStar } from "react-icons/fi";

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "Frontend",
    level: 80,
    icon: "",
    order: 0,
  });

  const categories = ["Frontend", "Backend", "Database", "Tools"];

  const fetchData = async () => {
    const res = await fetch("/api/skills");
    const data = await res.json();
    setSkills(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ name: "", category: "Frontend", level: 80, icon: "", order: 0 });
    setEditing(null);
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (skill) => {
    setEditing(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon || "",
      order: skill.order,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      level: parseInt(form.level) || 80,
      order: parseInt(form.order) || 0,
      icon: form.icon || null,
    };

    if (editing) {
      await fetch(`/api/skills/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setShowModal(false);
    resetForm();
    fetchData();
  };

  const handleDelete = async () => {
    await fetch(`/api/skills/${deleteId}`, { method: "DELETE" });
    setShowDelete(false);
    setDeleteId(null);
    fetchData();
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Skills</h1>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={openAdd}>
            <FiPlus /> Add Skill
          </button>
        </div>
      </div>

      {skills.length === 0 ? (
        <div className="admin-table-wrapper">
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <FiStar />
            </div>
            <h3>No skills yet</h3>
            <p>Add your skills to showcase on your portfolio.</p>
            <button className="admin-btn admin-btn-primary" onClick={openAdd}>
              <FiPlus /> Add First Skill
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Level</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill, index) => (
                <motion.tr key={skill.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * index }}>
                  <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{skill.name}</td>
                  <td>
                    <span className="tech-tag" style={{ fontSize: "0.75rem", padding: "3px 10px" }}>
                      {skill.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: "var(--bg-primary)", borderRadius: 10, overflow: "hidden" }}>
                        <div style={{ width: `${skill.level}%`, height: "100%", background: "var(--accent-gradient)", borderRadius: 10 }} />
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "var(--accent-primary)" }}>{skill.level}%</span>
                    </div>
                  </td>
                  <td>{skill.order}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-btn-icon" onClick={() => openEdit(skill)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button
                        className="admin-btn-icon delete"
                        onClick={() => {
                          setDeleteId(skill.id);
                          setShowDelete(true);
                        }}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editing ? "Edit Skill" : "Add Skill"}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="admin-form-group">
                    <label>Skill Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="JavaScript" required />
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Category *</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Level (0-100) *</label>
                      <input type="number" min="0" max="100" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} required />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Icon (React Icons name)</label>
                    <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="SiJavascript" />
                  </div>
                  <div className="admin-form-group">
                    <label>Order</label>
                    <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    {editing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDelete && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDelete(false)}>
            <motion.div className="modal" style={{ maxWidth: 400 }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-body">
                <div className="confirm-dialog">
                  <div className="confirm-dialog-icon">
                    <FiAlertTriangle />
                  </div>
                  <h3>Delete Skill?</h3>
                  <p>This action cannot be undone. The skill will be permanently removed.</p>
                  <div className="confirm-dialog-actions">
                    <button className="admin-btn admin-btn-secondary" onClick={() => setShowDelete(false)}>
                      Cancel
                    </button>
                    <button className="admin-btn admin-btn-danger" onClick={handleDelete}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
