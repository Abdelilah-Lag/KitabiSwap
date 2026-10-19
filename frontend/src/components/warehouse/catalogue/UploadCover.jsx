import { useMemo, useState } from "react";
import "./UploadCover.css";

export default function UploadCover({
  files,
  onFilesChange
}) {
  const count = files?.length ?? 0;
  const label = useMemo(() => {
    if (count === 0) return "Aucune image";
    if (count === 1) return "1 image";
    return `${count} images`;
  }, [count]);

  function handleFiles(e) {
    const next = Array.from(e.target.files || []);
    onFilesChange(next);
  }

  return (
    <div className="warehouse-upload-cover">
      <div className="warehouse-upload-cover-top">
        <div className="warehouse-upload-cover-label">Couverture / Images</div>
        <div className="warehouse-upload-cover-count">{label}</div>
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
      />

      {count > 0 ? (
        <div className="warehouse-upload-cover-preview">
          {files.map((f, idx) => (
            <div key={idx} className="warehouse-upload-cover-thumb">
              <img src={URL.createObjectURL(f)} alt={f.name} />
              <div className="warehouse-upload-cover-thumb-name">{f.name}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

