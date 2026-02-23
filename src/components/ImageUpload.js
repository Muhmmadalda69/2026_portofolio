"use client";

import { useState, useRef } from "react";
import { FiUpload, FiLink, FiX, FiImage } from "react-icons/fi";

export default function ImageUpload({ value, onChange, label = "Image" }) {
  const [mode, setMode] = useState("upload"); // "upload" or "url"
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

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
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div className="admin-form-group">
      <label>{label}</label>

      {/* Mode Toggle */}
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
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {value ? (
            <div className="image-upload-preview">
              <img src={value} alt="Preview" />
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
                  <FiImage size={32} />
                  <span>Click or drag image here</span>
                  <span className="image-upload-hint">JPG, PNG, GIF, WebP • Max 5MB</span>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleFileUpload(file);
              e.target.value = "";
            }}
          />
        </div>
      ) : (
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="https://example.com/image.jpg" />
      )}

      {/* Preview for URL mode */}
      {mode === "url" && value && (
        <div className="image-upload-url-preview">
          <img src={value} alt="Preview" />
        </div>
      )}
    </div>
  );
}
