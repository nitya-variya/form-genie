import { useState } from "react";
import { FormField } from "../utils/validation";

const FIELD_TYPES = [
  "text", "email", "tel", "number", "textarea", "select",
  "radio", "checkbox", "range", "date", "url", "password",
];

interface AddFieldPanelProps {
  onAdd: (field: FormField) => void;
  onClose: () => void;
}

export default function AddFieldPanel({ onAdd, onClose }: AddFieldPanelProps) {
  const [type, setType] = useState("text");
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(true);
  const [optionsStr, setOptionsStr] = useState("");

  const needsOptions = ["select", "radio", "checkbox"].includes(type);

  const handleAdd = () => {
    if (!label.trim()) return;
    const id = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const field: FormField = {
      id: id + "_" + Date.now().toString(36),
      label: label.trim(),
      type,
      required,
    };
    if (needsOptions) {
      field.options = optionsStr.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (type === "range") {
      field.min = 0;
      field.max = 100;
      field.step = 1;
    }
    onAdd(field);
  };

  return (
    <div className="fb-overlay" onClick={onClose}>
      <div className="fb-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-semibold mb-4">Add Field</h3>

        <div className="space-y-3">
          <div>
            <label className="fb-label">Field Type</label>
            <select className="fb-input" value={type} onChange={(e) => setType(e.target.value)}>
              {FIELD_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="fb-label">Label</label>
            <input
              className="fb-input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Full Name"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required-toggle"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="accent-primary"
            />
            <label htmlFor="required-toggle" className="text-sm cursor-pointer">Required</label>
          </div>

          {needsOptions && (
            <div>
              <label className="fb-label">Options (comma separated)</label>
              <input
                className="fb-input"
                value={optionsStr}
                onChange={(e) => setOptionsStr(e.target.value)}
                placeholder="e.g. Option A, Option B, Option C"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-5">
          <button className="fb-btn-primary flex-1" onClick={handleAdd} disabled={!label.trim()}>
            Add Field
          </button>
          <button className="fb-btn-secondary flex-1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
