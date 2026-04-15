import { FormField as FormFieldType } from "../utils/validation";
import { useState } from "react";

interface FormFieldProps {
  field: FormFieldType;
  value: unknown;
  error?: string;
  onChange: (id: string, value: unknown) => void;
}

export default function FormField({ field, value, error, onChange }: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputClass = `fb-input ${error ? "fb-input-error" : ""}`;

  const renderInput = () => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            className={`${inputClass} min-h-[100px]`}
            id={field.id}
            value={(value as string) || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
        );

      case "select":
        return (
          <select
            className={inputClass}
            id={field.id}
            value={(value as string) || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
          >
            <option value="">Select...</option>
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="flex flex-wrap gap-3 mt-1">
            {(field.options || []).map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={() => onChange(field.id, opt)}
                  className="accent-primary"
                />
                {opt}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex flex-wrap gap-3 mt-1">
            {(field.options || []).map((opt) => {
              const checked = Array.isArray(value) && value.includes(opt);
              return (
                <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    value={opt}
                    checked={checked}
                    onChange={(e) => {
                      const arr = Array.isArray(value) ? [...value] : [];
                      if (e.target.checked) arr.push(opt);
                      else arr.splice(arr.indexOf(opt), 1);
                      onChange(field.id, arr);
                    }}
                    className="accent-primary"
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        );

      case "range":
        return (
          <div className="flex items-center gap-4 mt-1">
            <input
              type="range"
              id={field.id}
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              value={(value as number) ?? field.min ?? 0}
              onChange={(e) => onChange(field.id, Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="font-semibold text-sm min-w-[2rem] text-center text-foreground">
              {value as number ?? field.min ?? 0}
            </span>
          </div>
        );

      case "password":
        return (
          <div className="relative">
            <input
              className={inputClass}
              id={field.id}
              type={showPassword ? "text" : "password"}
              value={(value as string) || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
              placeholder={field.placeholder}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        );

      default:
        return (
          <input
            className={inputClass}
            id={field.id}
            type={field.type}
            value={(value as string | number) ?? ""}
            onChange={(e) =>
              onChange(
                field.id,
                field.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value
              )
            }
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
          />
        );
    }
  };

  return (
    <div className="animate-fade-in">
      <label htmlFor={field.id} className="fb-label">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </label>
      {renderInput()}
      {field.helpText && <p className="fb-help-text">{field.helpText}</p>}
      {error && <p className="fb-error-text">{error}</p>}
    </div>
  );
}
