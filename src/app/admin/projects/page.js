"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertTriangle, FiFolder } from "react-icons/fi";
import ImageUpload from "@/components/ImageUpload";

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    techStack: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    order: 0,
  });

  const fetchData = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", image: "", techStack: "", liveUrl: "", githubUrl: "", featured: false, order: 0 });
    setEditing(null);
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (proj) => {
    setEditing(proj.id);
    setForm({
      title: proj.title,
      description: proj.description,
      image: proj.image || "",
      techStack: proj.techStack,
      liveUrl: proj.liveUrl || "",
      githubUrl: proj.githubUrl || "",
      featured: proj.featured,
      order: proj.order,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      order: parseInt(form.order) || 0,
      image: form.image || null,
      liveUrl: form.liveUrl || null,
      githubUrl: form.githubUrl || null,
    };

    if (editing) {
      await fetch(`/api/projects/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/projects", {
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
    await fetch(`/api/projects/${deleteId}`, { method: "DELETE" });
    setShowDelete(false);
    setDeleteId(null);
    fetchData();
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Projects</h1>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={openAdd}>
            <FiPlus /> Add Project
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="admin-table-wrapper">
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <FiFolder />
            </div>
            <h3>No projects yet</h3>
            <p>Add your projects to showcase on your portfolio.</p>
            <button className="admin-btn admin-btn-primary" onClick={openAdd}>
              <FiPlus /> Add First Project
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Tech Stack</th>
                <th>Featured</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, index) => (
                <motion.tr key={proj.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * index }}>
                  <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{proj.title}</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {proj.techStack
                        .split(",")
                        .slice(0, 3)
                        .map((t) => (
                          <span key={t.trim()} className="tech-tag" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                            {t.trim()}
                          </span>
                        ))}
                      {proj.techStack.split(",").length > 3 && (
                        <span className="tech-tag" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                          +{proj.techStack.split(",").length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: proj.featured ? "rgba(16, 185, 129, 0.1)" : "rgba(107, 107, 128, 0.1)",
                        color: proj.featured ? "#10b981" : "var(--text-muted)",
                      }}
                    >
                      {proj.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>{proj.order}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-btn-icon" onClick={() => openEdit(proj)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button
                        className="admin-btn-icon delete"
                        onClick={() => {
                          setDeleteId(proj.id);
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
                <h2>{editing ? "Edit Project" : "Add Project"}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="admin-form-group">
                    <label>Title *</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="E-Commerce Platform" required />
                  </div>
                  <div className="admin-form-group">
                    <label>Description *</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the project..." required />
                  </div>
                  <div className="admin-form-group">
                    <label>Tech Stack * (comma separated)</label>
                    <input type="text" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="React,Node.js,PostgreSQL" required />
                  </div>
                  <ImageUpload label="Project Image" value={form.image} onChange={(val) => setForm({ ...form, image: val })} />
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Live URL</label>
                      <input type="text" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://myproject.com" />
                    </div>
                    <div className="admin-form-group">
                      <label>GitHub URL</label>
                      <input type="text" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." />
                    </div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-check">
                      <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                      <label htmlFor="featured">Featured Project</label>
                    </div>
                    <div className="admin-form-group">
                      <label>Order</label>
                      <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
                    </div>
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
                  <h3>Delete Project?</h3>
                  <p>This action cannot be undone. The project will be permanently removed.</p>
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
