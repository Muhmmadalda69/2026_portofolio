"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertTriangle, FiStar, FiLayout, FiServer, FiDatabase, FiTool, FiSmartphone, FiCode, FiSearch, FiFilter, FiChevronUp, FiChevronDown, FiGrid } from "react-icons/fi";
import Link from "next/link";
import DynamicIcon from "@/components/DynamicIcon";

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showCatManageModal, setShowCatManageModal] = useState(false);
  const [showCatEditModal, setShowCatEditModal] = useState(false);
  const [showCatDelete, setShowCatDelete] = useState(false);
  const [catEditing, setCatEditing] = useState(null);
  const [catDeleteId, setCatDeleteId] = useState(null);
  const [catForm, setCatForm] = useState({
    name: "",
    icon: "FiCode",
    gradient: "linear-gradient(135deg, #6366f1, #a855f7)",
    order: 0,
  });

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    level: 80,
    icon: "",
    order: 0,
  });

  // Filter and Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All"); // This will be category ID or "All"
  const [sortBy, setBy] = useState("order"); // 'order', 'name', 'level', 'category'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc', 'desc'

  const availableIcons = {
    FiLayout: <FiLayout />,
    FiServer: <FiServer />,
    FiDatabase: <FiDatabase />,
    FiTool: <FiTool />,
    FiSmartphone: <FiSmartphone />,
    FiCode: <FiCode />,
    FiGrid: <FiGrid />,
  };

  const fetchData = async () => {
    const [skillsRes, catsRes] = await Promise.all([fetch("/api/skills"), fetch("/api/categories")]);
    const [skillsData, catsData] = await Promise.all([skillsRes.json(), catsRes.json()]);
    setSkills(Array.isArray(skillsData) ? skillsData : []);
    setCategories(Array.isArray(catsData) ? catsData : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setBy(field);
      setSortOrder("asc");
    }
  };

  const filteredSkills = useMemo(() => {
    return skills
      .filter((skill) => {
        const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "All" || skill.categoryId === parseInt(filterCategory);
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "name") comparison = a.name.localeCompare(b.name);
        else if (sortBy === "level") comparison = a.level - b.level;
        else if (sortBy === "category") {
          const catA = a.categoryRel?.name || "";
          const catB = b.categoryRel?.name || "";
          comparison = catA.localeCompare(catB);
        } else comparison = a.order - b.order;

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [skills, searchQuery, filterCategory, sortBy, sortOrder]);

  const resetForm = () => {
    setForm({ name: "", categoryId: categories[0]?.id?.toString() || "", level: 80, icon: "", order: 0 });
    setEditing(null);
  };

  const resetCatForm = () => {
    setCatForm({ name: "", icon: "FiCode", gradient: "linear-gradient(135deg, #6366f1, #a855f7)", order: 0 });
    setCatEditing(null);
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openCatAdd = () => {
    resetCatForm();
    setShowCatEditModal(true);
  };

  const openCatEdit = (cat) => {
    setCatEditing(cat.id);
    setCatForm({
      name: cat.name,
      icon: cat.icon || "FiCode",
      gradient: cat.gradient || "linear-gradient(135deg, #6366f1, #a855f7)",
      order: cat.order,
    });
    setShowCatEditModal(true);
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...catForm,
      order: parseInt(catForm.order) || 0,
    };

    if (catEditing) {
      await fetch(`/api/categories/${catEditing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setShowCatEditModal(false);
    resetCatForm();
    fetchData();
  };

  const handleCatDelete = async () => {
    const res = await fetch(`/api/categories/${catDeleteId}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error);
    }
    setShowCatDelete(false);
    setCatDeleteId(null);
    fetchData();
  };
  const openEdit = (skill) => {
    setEditing(skill.id);
    setForm({
      name: skill.name,
      categoryId: skill.categoryId || "",
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

  const SortIndicator = ({ field }) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Skills</h1>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-secondary" onClick={() => setShowCatManageModal(true)}>
            <FiGrid /> Categories
          </button>
          <button className="admin-btn admin-btn-primary" onClick={openAdd}>
            <FiPlus /> Add Skill
          </button>
        </div>
      </div>

      <div
        className="admin-filters-bar"
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          background: "var(--bg-card)",
          padding: 16,
          borderRadius: 16,
          border: "1px solid var(--border-color)",
          flexWrap: "wrap",
        }}
      >
        <div className="admin-search-wrapper" style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <FiSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 40px",
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: 10,
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FiFilter style={{ color: "var(--text-muted)" }} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: "10px 16px",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: 10,
                color: "var(--text-primary)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="admin-table-wrapper">
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <FiStar />
            </div>
            <h3>{searchQuery || filterCategory !== "All" ? "No matching skills" : "No skills yet"}</h3>
            <p>{searchQuery || filterCategory !== "All" ? "Try adjusting your filters." : "Add your skills to showcase on your portfolio."}</p>
            {!searchQuery && filterCategory === "All" && (
              <button className="admin-btn admin-btn-primary" onClick={openAdd}>
                <FiPlus /> Add First Skill
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("name")} style={{ cursor: "pointer", userSelect: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Name <SortIndicator field="name" />
                  </div>
                </th>
                <th onClick={() => handleSort("category")} style={{ cursor: "pointer", userSelect: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Category <SortIndicator field="category" />
                  </div>
                </th>
                <th onClick={() => handleSort("level")} style={{ cursor: "pointer", userSelect: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Level <SortIndicator field="level" />
                  </div>
                </th>
                <th onClick={() => handleSort("order")} style={{ cursor: "pointer", userSelect: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Order <SortIndicator field="order" />
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.map((skill, index) => (
                <motion.tr key={skill.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * index }}>
                  <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <DynamicIcon name={skill.icon} style={{ fontSize: "1.1rem", color: "var(--accent-primary)" }} />
                      {skill.name}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: skill.categoryRel?.gradient || "var(--accent-gradient)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "0.9rem",
                        }}
                      >
                        <DynamicIcon name={skill.categoryRel?.icon} />
                      </div>
                      <span
                        className="tech-tag"
                        style={{
                          fontSize: "0.75rem",
                          padding: "3px 10px",
                          background: `${skill.categoryRel?.gradient || "var(--accent-gradient)"}22`,
                          color: (skill.categoryRel?.gradient || "").includes("#") ? skill.categoryRel.gradient.split(",")[0].replace("linear-gradient(135deg, ", "") : "var(--accent-primary)",
                          borderColor: `${skill.categoryRel?.gradient || "var(--accent-gradient)"}44`,
                        }}
                      >
                        {skill.categoryRel?.name || "Uncategorized"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: "var(--bg-primary)", borderRadius: 10, overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${skill.level}%`,
                            height: "100%",
                            background: skill.categoryRel?.gradient || "var(--accent-gradient)",
                            borderRadius: 10,
                          }}
                        />
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
                      <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
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
      {/* Category Management Modal */}
      <AnimatePresence>
        {showCatManageModal && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal" style={{ maxWidth: 800 }}>
              <div className="modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <FiGrid style={{ color: "var(--accent-primary)" }} />
                  <h2>Manage Categories</h2>
                </div>
                <button className="modal-close" onClick={() => setShowCatManageModal(false)}>
                  <FiX />
                </button>
              </div>

              <div className="modal-body">
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={openCatAdd}>
                    <FiPlus /> Add Category
                  </button>
                </div>

                {categories.length === 0 ? (
                  <div className="admin-empty" style={{ padding: "40px 0" }}>
                    <p>No categories found.</p>
                  </div>
                ) : (
                  <div className="admin-table-wrapper" style={{ maxHeight: 400, overflowY: "auto", border: "1px solid var(--border-color)" }}>
                    <table className="admin-table admin-table-sm">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Icon</th>
                          <th>Order</th>
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat) => (
                          <tr key={cat.id}>
                            <td style={{ fontWeight: 600 }}>{cat.name}</td>
                            <td>
                              <div
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: 6,
                                  background: cat.gradient,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontSize: "0.8rem",
                                }}
                              >
                                <DynamicIcon name={cat.icon} />
                              </div>
                            </td>
                            <td>{cat.order}</td>
                            <td>
                              <div className="admin-table-actions" style={{ justifyContent: "flex-end" }}>
                                <button className="admin-btn-icon" onClick={() => openCatEdit(cat)} title="Edit">
                                  <FiEdit2 />
                                </button>
                                <button
                                  className="admin-btn-icon delete"
                                  onClick={() => {
                                    setCatDeleteId(cat.id);
                                    setShowCatDelete(true);
                                  }}
                                  title="Delete"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Edit Modal */}
      <AnimatePresence>
        {showCatEditModal && (
          <div className="modal-overlay" style={{ zIndex: 1100 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal" style={{ maxWidth: 500 }}>
              <div className="modal-header">
                <h2>{catEditing ? "Edit Category" : "Add Category"}</h2>
                <button className="modal-close" onClick={() => setShowCatEditModal(false)}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleCatSubmit} className="admin-form">
                <div className="modal-body">
                  <div className="admin-form-group">
                    <label>Category Name</label>
                    <input type="text" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required placeholder="e.g. Frontend" />
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Icon</label>
                      <select value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}>
                        {Object.keys(availableIcons).map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Order</label>
                      <input type="number" value={catForm.order} onChange={(e) => setCatForm({ ...catForm, order: e.target.value })} required />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Gradient CSS</label>
                    <input type="text" value={catForm.gradient} onChange={(e) => setCatForm({ ...catForm, gradient: e.target.value })} required placeholder="linear-gradient(...)" />
                    <div style={{ marginTop: 8, height: 20, borderRadius: 4, background: catForm.gradient }} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowCatEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    {catEditing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Delete Confirmation */}
      <AnimatePresence>
        {showCatDelete && (
          <div className="modal-overlay" style={{ zIndex: 1200 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal" style={{ maxWidth: 400 }}>
              <div className="modal-body">
                <div className="confirm-dialog">
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#ef444422", color: "#ef4444", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <FiAlertTriangle />
                  </div>
                  <h3 style={{ marginBottom: 12 }}>Delete Category?</h3>
                  <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Only categories with no associated skills can be removed.</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button className="admin-btn admin-btn-secondary" style={{ flex: 1 }} onClick={() => setShowCatDelete(false)}>
                      Cancel
                    </button>
                    <button className="admin-btn admin-btn-danger" style={{ flex: 1 }} onClick={handleCatDelete}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
