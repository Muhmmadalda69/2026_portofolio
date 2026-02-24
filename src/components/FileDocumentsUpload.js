"use client";

import { useState, useRef } from "react";
import { FiUpload, FiLink, FiX, FiFile, FiImage } from "react-icons/fi";

export default function FileDocumentsUpload({ value, onChange, label = "File / Image" }) {
  const [mode, setMode] = useState("upload");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const isPDF = value?.toLowerCase().endsWith(".pdf");

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    }

    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="admin-form-group">
      <label>{label}</label>

      <div className="image-upload-toggle">
        <button type="button" className={`image-upload-toggle-btn ${mode === "upload" ? "active" : ""}`} onClick={() => setMode("upload")}>
          <FiUpload size={14} /> Upload
        </button>
        <button type="button" className={`image-upload-toggle-btn ${mode === "url" ? "active" : ""}`} onClick={() => setMode("url")}>
          <FiLink size={14} /> URL
        </button>
      </div>

      {mode === "upload" ? (
        <div
          className={`image-upload-dropzone ${dragOver ? "drag-over" : ""} ${uploading ? "uploading" : ""}`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {value ? (
            <div className="image-upload-preview" style={{ background: "rgba(255,255,255,0.05)" }}>
              {isPDF ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 20 }}>
                  <FiFile size={48} style={{ color: "var(--accent-pink)" }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>{value.split("/").pop()}</span>
                </div>
              ) : (
                <img src={value} alt="Preview" />
              )}
              <button
                type="button"
                className="image-upload-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
              >
                <FiX />
              </button>
            </div>
          ) : (
            <div className="image-upload-placeholder">
              {uploading ? (
                <>
                  <div className="image-upload-spinner" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FiFile size={32} />
                  <span>Click or drag image/PDF here</span>
                  <span className="image-upload-hint">JPG, PNG, PDF • Max 5MB</span>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleFileUpload(file);
              e.target.value = "";
            }}
          />
        </div>
      ) : (
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="https://example.com/certificate.pdf" />
      )}
    </div>
  );
}
