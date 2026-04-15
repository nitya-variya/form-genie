
export default function ProgressBar({ schema, formValues }) {
  const requiredFields = schema.fields.filter((f) => f.required);

  const filledCount = requiredFields.filter((f) => {
    const val = formValues[f.id];
    if (Array.isArray(val)) return val.length > 0; 
    return val !== undefined && val !== ""; 
  }).length;

  const total = requiredFields.length;
  const percentage =
    total === 0 ? 100 : Math.round((filledCount / total) * 100);
  const isDone = percentage === 100;

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
          {filledCount} of {total} required fields completed
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: isDone ? "green" : "var(--color-text-secondary)",
          }}
        >
          {percentage}%
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          height: 8,
          background: "var(--color-background-secondary)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        {/* Fill bar */}
        <div
          style={{
            height: "100%",
            width: `${percentage}%`,
            background: isDone ? "#1D9E75" : "#378ADD",
            borderRadius: 99,
            transition: "width 0.3s ease", 
          }}
        />
      </div>
    </div>
  );
}
