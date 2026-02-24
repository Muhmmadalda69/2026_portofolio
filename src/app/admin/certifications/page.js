"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertTriangle, FiAward, FiCalendar, FiMapPin, FiLink, FiImage, FiFile } from "react-icons/fi";
import FileDocumentsUpload from "@/components/FileDocumentsUpload";

export default function CertificationsAdmin() {
  const [certifications, setCertifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    date: "",
    description: "",
    image: "",
    url: "",
    order: 0,
  });

  const fetchData = async () => {
    const res = await fetch("/api/certifications");
    const data = await res.json();
    setCertifications(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ title: "", issuer: "", date: "", description: "", image: "", url: "", order: 0 });
    setEditing(null);
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (cert) => {
    setEditing(cert.id);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      description: cert.description || "",
      image: cert.image || "",
      url: cert.url || "",
      order: cert.order,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      order: parseInt(form.order) || 0,
    };

    if (editing) {
      await fetch(`/api/certifications/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/certifications", {
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
    await fetch(`/api/certifications/${deleteId}`, { method: "DELETE" });
    setShowDelete(false);
    setDeleteId(null);
    fetchData();
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Certifications</h1>
        <button className="admin-btn admin-btn-primary" onClick={openAdd}>
          <FiPlus /> Add Certification
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Issuer</th>
              <th>Date</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certifications.map((cert) => (
              <tr key={cert.id}>
                <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{cert.title}</td>
                <td>{cert.issuer}</td>
                <td>{cert.date}</td>
                <td>{cert.order}</td>
                <td>
                  <div className="admin-table-actions">
                    <button className="admin-btn-icon" onClick={() => openEdit(cert)}>
                      <FiEdit2 />
                    </button>
                    <button
                      className="admin-btn-icon delete"
                      onClick={() => {
                        setDeleteId(cert.id);
                        setShowDelete(true);
                      }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {certifications.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                  No certifications found. Add your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editing ? "Edit Certification" : "Add Certification"}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="admin-form-group">
                    <label>Title *</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="admin-form-group">
                    <label>Issuer *</label>
                    <input type="text" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required />
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Date *</label>
                      <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. June 2023" required />
                    </div>
                    <div className="admin-form-group">
                      <label>Order</label>
                      <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Description</label>
                    <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>

                  <FileDocumentsUpload label="Certificate Image or PDF *" value={form.image} onChange={(val) => setForm({ ...form, image: val })} />

                  <div className="admin-form-group" style={{ marginTop: "1rem" }}>
                    <label>Verification URL</label>
                    <input type="text" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
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
                  <h3>Delete Certification?</h3>
                  <p>This action cannot be undone.</p>
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
创新;
创新;
创新;
创新;
创新;
创新;
创新;
创新;
创新;
创新;
