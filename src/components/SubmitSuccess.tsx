interface SubmitSuccessProps {
  data: Record<string, unknown>;
  onReset: () => void;
}

export default function SubmitSuccess({ data, onReset }: SubmitSuccessProps) {
  return (
    <div className="animate-fade-in text-center">
      <div className="fb-success-card">
        <div className="text-4xl mb-3">✓</div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">
          Form Submitted Successfully!
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Here's a summary of the submitted data:
        </p>
        <div className="text-left bg-card rounded-lg p-4 border border-border">
          <dl className="space-y-2">
            {Object.entries(data).map(([key, val]) => (
              <div key={key} className="flex flex-col">
                <dt className="text-xs font-medium text-muted-foreground">{key}</dt>
                <dd className="text-sm text-foreground">
                  {Array.isArray(val)
                    ? val.join(", ") || "—"
                    : val !== undefined && val !== null && val !== ""
                    ? String(val)
                    : "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <button className="fb-btn-primary mt-4" onClick={onReset}>
        ← Build Another Form
      </button>
    </div>
  );
}
