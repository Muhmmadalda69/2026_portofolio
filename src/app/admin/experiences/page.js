"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertTriangle, FiBriefcase } from "react-icons/fi";

export default function ExperiencesAdmin() {
  const [experiences, setExperiences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isPresent, setIsPresent] = useState(false);
  const [form, setForm] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    order: 0,
  });

  const fetchData = async () => {
    const res = await fetch("/api/experiences");
    const data = await res.json();
    setExperiences(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ company: "", position: "", startDate: "", endDate: "", description: "", order: 0 });
    setEditing(null);
    setIsPresent(false);
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (exp) => {
    setEditing(exp.id);
    const present = !exp.endDate;
    setIsPresent(present);
    setForm({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      description: exp.description,
      order: exp.order,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, order: parseInt(form.order) || 0 };
    if (isPresent || !payload.endDate) payload.endDate = null;

    if (editing) {
      await fetch(`/api/experiences/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/experiences", {
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
    await fetch(`/api/experiences/${deleteId}`, { method: "DELETE" });
    setShowDelete(false);
    setDeleteId(null);
    fetchData();
  };

  // Format month value (YYYY-MM) to readable text
  const formatDate = (dateStr) => {
    if (!dateStr) return "Present";
    const [year, month] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1] || ""} ${year}`;
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Experiences</h1>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={openAdd}>
            <FiPlus /> Add Experience
          </button>
        </div>
      </div>

      {experiences.length === 0 ? (
        <div className="admin-table-wrapper">
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <FiBriefcase />
            </div>
            <h3>No experiences yet</h3>
            <p>Add your work experience to showcase on your portfolio.</p>
            <button className="admin-btn admin-btn-primary" onClick={openAdd}>
              <FiPlus /> Add First Experience
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Company</th>
                <th>Period</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp, index) => (
                <motion.tr key={exp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * index }}>
                  <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{exp.position}</td>
                  <td>{exp.company}</td>
                  <td>
                    {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                  </td>
                  <td>{exp.order}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-btn-icon" onClick={() => openEdit(exp)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button
                        className="admin-btn-icon delete"
                        onClick={() => {
                          setDeleteId(exp.id);
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
                <h2>{editing ? "Edit Experience" : "Add Experience"}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="admin-form-group">
                    <label>Position *</label>
                    <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Senior Full Stack Developer" required />
                  </div>
                  <div className="admin-form-group">
                    <label>Company *</label>
                    <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Tech Corp Indonesia" required />
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Start Date *</label>
                      <input type="month" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                    </div>
                    <div className="admin-form-group">
                      <label>End Date</label>
                      <input type="month" value={isPresent ? "" : form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={isPresent} style={isPresent ? { opacity: 0.4, cursor: "not-allowed" } : {}} />
                      <div className="admin-form-check" style={{ marginTop: 8, marginBottom: 0 }}>
                        <input
                          type="checkbox"
                          id="isPresent"
                          checked={isPresent}
                          onChange={(e) => {
                            setIsPresent(e.target.checked);
                            if (e.target.checked) {
                              setForm({ ...form, endDate: "" });
                            }
                          }}
                        />
                        <label htmlFor="isPresent">Present (still working here)</label>
                      </div>
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Description *</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your responsibilities and achievements..." required />
                  </div>
                  <div className="admin-form-group">
                    <label>Order</label>
                    <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} placeholder="0" />
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
                  <h3>Delete Experience?</h3>
                  <p>This action cannot be undone. The experience will be permanently removed.</p>
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
