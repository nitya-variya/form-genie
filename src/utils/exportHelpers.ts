import { FormSchema } from "./validation";

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadFile(filename: string, content: string, mime = "application/json") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateHTMLExport(schema: FormSchema): string {
  const fieldsHtml = schema.fields
    .map((f) => {
      let input = "";
      const req = f.required ? " required" : "";
      const ph = f.placeholder ? ` placeholder="${f.placeholder}"` : "";

      switch (f.type) {
        case "textarea":
          input = `<textarea id="${f.id}" name="${f.id}"${ph}${req} rows="4"></textarea>`;
          break;
        case "select":
          input = `<select id="${f.id}" name="${f.id}"${req}>
            <option value="">Select...</option>
            ${(f.options || []).map((o) => `<option value="${o}">${o}</option>`).join("\n            ")}
          </select>`;
          break;
        case "radio":
          input = `<div class="radio-group">
            ${(f.options || [])
              .map(
                (o) =>
                  `<label class="radio-label"><input type="radio" name="${f.id}" value="${o}"${req}> ${o}</label>`
              )
              .join("\n            ")}
          </div>`;
          break;
        case "checkbox":
          input = `<div class="checkbox-group">
            ${(f.options || [])
              .map(
                (o) =>
                  `<label class="checkbox-label"><input type="checkbox" name="${f.id}" value="${o}"> ${o}</label>`
              )
              .join("\n            ")}
          </div>`;
          break;
        case "range":
          input = `<div class="range-wrap">
            <input type="range" id="${f.id}" name="${f.id}" min="${f.min || 0}" max="${f.max || 100}" step="${f.step || 1}" value="${f.min || 0}" oninput="document.getElementById('${f.id}_val').textContent=this.value">
            <span id="${f.id}_val">${f.min || 0}</span>
          </div>`;
          break;
        default:
          input = `<input type="${f.type}" id="${f.id}" name="${f.id}"${ph}${req}${f.min !== undefined ? ` min="${f.min}"` : ""}${f.max !== undefined ? ` max="${f.max}"` : ""}>`;
      }

      return `    <div class="field">
      <label for="${f.id}">${f.label}${f.required ? ' <span class="req">*</span>' : ""}</label>
      ${input}${f.helpText ? `\n      <small>${f.helpText}</small>` : ""}
      <div class="error" id="${f.id}_error"></div>
    </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${schema.title}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,-apple-system,sans-serif;background:#f5f5f5;padding:2rem 1rem}
    form{max-width:600px;margin:0 auto;background:#fff;padding:2rem;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.08)}
    h1{font-size:1.5rem;margin-bottom:.5rem}
    .desc{color:#666;margin-bottom:1.5rem;font-size:.9rem}
    .field{margin-bottom:1.25rem}
    label{display:block;font-weight:500;margin-bottom:.4rem;font-size:.9rem}
    .req{color:#e53e3e}
    input,textarea,select{width:100%;padding:.6rem .8rem;border:1px solid #ddd;border-radius:8px;font-size:.9rem;font-family:inherit}
    input:focus,textarea:focus,select:focus{outline:none;border-color:#2bb5a0;box-shadow:0 0 0 3px rgba(43,181,160,.15)}
    textarea{resize:vertical}
    .radio-group,.checkbox-group{display:flex;flex-wrap:wrap;gap:.75rem}
    .radio-label,.checkbox-label{display:flex;align-items:center;gap:.4rem;font-size:.9rem;cursor:pointer}
    .range-wrap{display:flex;align-items:center;gap:1rem}
    .range-wrap input{flex:1}
    .range-wrap span{font-weight:600;min-width:2rem;text-align:center}
    small{display:block;color:#888;font-size:.8rem;margin-top:.3rem}
    .error{color:#e53e3e;font-size:.8rem;margin-top:.3rem;display:none}
    .field.invalid input,.field.invalid textarea,.field.invalid select{border-color:#e53e3e}
    .field.invalid .error{display:block}
    button[type=submit]{background:#2bb5a0;color:#fff;border:none;padding:.75rem 2rem;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;width:100%;margin-top:.5rem}
    button[type=submit]:hover{background:#249e8c}
    .success{text-align:center;padding:2rem}
    .success h2{color:#2bb5a0;margin-bottom:1rem}
    .result{text-align:left;background:#f9f9f9;padding:1rem;border-radius:8px;font-size:.85rem}
    .result dt{font-weight:600;margin-top:.5rem}
    .result dd{margin-left:0;color:#555}
  </style>
</head>
<body>
  <form id="genForm" novalidate>
    <h1>${schema.title}</h1>
    <p class="desc">${schema.description}</p>
${fieldsHtml}
    <button type="submit">Submit</button>
  </form>
  <script>
    document.getElementById('genForm').addEventListener('submit', function(e) {
      e.preventDefault();
      var fields = ${JSON.stringify(schema.fields.map((f) => ({ id: f.id, label: f.label, type: f.type, required: !!f.required })))};
      var valid = true;
      fields.forEach(function(f) {
        var el = document.getElementById(f.id);
        var wrap = el ? el.closest('.field') : null;
        var errEl = document.getElementById(f.id + '_error');
        if (wrap) wrap.classList.remove('invalid');
        if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
        var val = el ? el.value.trim() : '';
        if (f.type === 'checkbox' || f.type === 'radio') {
          var checked = document.querySelectorAll('input[name="'+f.id+'"]:checked');
          if (f.required && checked.length === 0) {
            if (wrap) wrap.classList.add('invalid');
            if (errEl) { errEl.textContent = f.label + ' is required'; errEl.style.display = 'block'; }
            valid = false;
          }
          return;
        }
        if (f.required && !val) {
          if (wrap) wrap.classList.add('invalid');
          if (errEl) { errEl.textContent = f.label + ' is required'; errEl.style.display = 'block'; }
          valid = false;
        } else if (f.type === 'email' && val && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(val)) {
          if (wrap) wrap.classList.add('invalid');
          if (errEl) { errEl.textContent = 'Invalid email'; errEl.style.display = 'block'; }
          valid = false;
        }
      });
      if (!valid) {
        var firstErr = document.querySelector('.field.invalid');
        if (firstErr) firstErr.scrollIntoView({behavior:'smooth',block:'center'});
        return;
      }
      var fd = new FormData(this);
      var html = '<div class="success"><h2>✓ Submitted!</h2><dl class="result">';
      fields.forEach(function(f) {
        var vals = fd.getAll(f.id);
        html += '<dt>' + f.label + '</dt><dd>' + (vals.join(', ') || '—') + '</dd>';
      });
      html += '</dl></div>';
      this.outerHTML = html;
    });
  </script>
</body>
</html>`;
}

export function generateReactExport(schema: FormSchema): string {
  const stateEntries = schema.fields
    .map((f) => {
      if (f.type === "checkbox") return `    ${f.id}: []`;
      if (f.type === "number" || f.type === "range")
        return `    ${f.id}: ${f.min ?? 0}`;
      return `    ${f.id}: ""`;
    })
    .join(",\n");

  const fieldJsx = schema.fields
    .map((f) => {
      const req = f.required ? " *" : "";
      let input = "";

      switch (f.type) {
        case "textarea":
          input = `        <textarea
          id="${f.id}"
          value={values.${f.id}}
          onChange={(e) => handleChange("${f.id}", e.target.value)}
          placeholder="${f.placeholder || ""}"
          rows={4}
          style={inputStyle(errors.${f.id})}
        />`;
          break;
        case "select":
          input = `        <select
          id="${f.id}"
          value={values.${f.id}}
          onChange={(e) => handleChange("${f.id}", e.target.value)}
          style={inputStyle(errors.${f.id})}
        >
          <option value="">Select...</option>
${(f.options || []).map((o) => `          <option value="${o}">${o}</option>`).join("\n")}
        </select>`;
          break;
        case "radio":
          input = `        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
${(f.options || [])
  .map(
    (o) => `          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
            <input type="radio" name="${f.id}" value="${o}" checked={values.${f.id} === "${o}"} onChange={(e) => handleChange("${f.id}", e.target.value)} />
            ${o}
          </label>`
  )
  .join("\n")}
        </div>`;
          break;
        case "checkbox":
          input = `        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
${(f.options || [])
  .map(
    (o) => `          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
            <input type="checkbox" value="${o}" checked={values.${f.id}.includes("${o}")} onChange={(e) => {
              const v = "${o}";
              handleChange("${f.id}", e.target.checked ? [...values.${f.id}, v] : values.${f.id}.filter(x => x !== v));
            }} />
            ${o}
          </label>`
  )
  .join("\n")}
        </div>`;
          break;
        case "range":
          input = `        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <input type="range" id="${f.id}" min={${f.min || 0}} max={${f.max || 100}} step={${f.step || 1}} value={values.${f.id}} onChange={(e) => handleChange("${f.id}", Number(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontWeight: 600, minWidth: "2rem", textAlign: "center" }}>{values.${f.id}}</span>
        </div>`;
          break;
        default:
          input = `        <input
          type="${f.type}"
          id="${f.id}"
          value={values.${f.id}}
          onChange={(e) => handleChange("${f.id}", ${f.type === "number" ? "Number(e.target.value)" : "e.target.value"})}
          placeholder="${f.placeholder || ""}"
          style={inputStyle(errors.${f.id})}
        />`;
      }

      return `      {/* ${f.label} */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label htmlFor="${f.id}" style={{ display: "block", fontWeight: 500, marginBottom: "0.4rem", fontSize: "0.9rem" }}>
          ${f.label}${req}
        </label>
${input}${f.helpText ? `\n        <small style={{ color: "#888", fontSize: "0.8rem" }}>${f.helpText}</small>` : ""}
        {errors.${f.id} && <p style={{ color: "#e53e3e", fontSize: "0.8rem", marginTop: "0.3rem" }}>{errors.${f.id}}</p>}
      </div>`;
    })
    .join("\n\n");

  return `import { useState } from "react";

/**
 * ${schema.title}
 * ${schema.description}
 * 
 * Auto-generated form component — ready to use in any React project.
 */
function GeneratedForm() {
  const [values, setValues] = useState({
${stateEntries}
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (id, value) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "0.6rem 0.8rem",
    border: \`1px solid \${hasError ? "#e53e3e" : "#ddd"}\`,
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
${schema.fields
  .filter((f) => f.required)
  .map((f) => {
    if (f.type === "checkbox")
      return `    if (!values.${f.id} || values.${f.id}.length === 0) newErrors.${f.id} = "${f.label} is required";`;
    return `    if (!values.${f.id} && values.${f.id} !== 0) newErrors.${f.id} = "${f.label} is required";`;
  })
  .join("\n")}
${schema.fields
  .filter((f) => f.type === "email")
  .map(
    (f) =>
      `    if (values.${f.id} && !/^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$/.test(values.${f.id})) newErrors.${f.id} = "Invalid email";`
  )
  .join("\n")}

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2 style={{ color: "#2bb5a0" }}>✓ Form Submitted!</h2>
        <pre style={{ textAlign: "left", background: "#f9f9f9", padding: "1rem", borderRadius: "8px", marginTop: "1rem", fontSize: "0.85rem" }}>
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>${schema.title}</h1>
      <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.9rem" }}>${schema.description}</p>

${fieldJsx}

      <button type="submit" style={{ background: "#2bb5a0", color: "#fff", border: "none", padding: "0.75rem 2rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 600, cursor: "pointer", width: "100%" }}>
        Submit
      </button>
    </form>
  );
}

export default GeneratedForm;
`;
}
