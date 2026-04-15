interface JsonEditorProps {
  value: string;
  error: string;
  onChange: (val: string) => void;
  onApply: () => void;
}

export default function JsonEditor({ value, error, onChange, onApply }: JsonEditorProps) {
  return (
    <div className="space-y-3 animate-fade-in">
      <textarea
        className="fb-textarea min-h-[300px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-destructive text-sm font-medium">⚠ Invalid JSON</p>
          <p className="text-destructive/80 text-xs mt-1">{error}</p>
        </div>
      )}
      <button className="fb-btn-primary" onClick={onApply}>
        Apply Changes
      </button>
    </div>
  );
}
