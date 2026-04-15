import { useState } from "react";
import { TEMPLATES, TEMPLATE_KEYS } from "../utils/templates";

interface PromptPanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  promptHistory: string[];
}

export default function PromptPanel({ onGenerate, isLoading, promptHistory }: PromptPanelProps) {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim());
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="fb-label">Describe your form</label>
        <textarea
          className="fb-input min-h-[120px] resize-y"
          placeholder="e.g. Create a contact form with name, email, phone, and a message field..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
          }}
        />
        <p className="fb-help-text">Press Ctrl+Enter to generate</p>
      </div>

      <button
        className="fb-btn-primary w-full flex items-center justify-center gap-2"
        onClick={handleGenerate}
        disabled={!prompt.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>✦ Generate Form</>
        )}
      </button>

      {/* Templates */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Templates</p>
        <div className="flex flex-wrap gap-2">
          {TEMPLATE_KEYS.map((key) => (
            <button
              key={key}
              className="fb-template-btn text-xs"
              onClick={() => setPrompt(TEMPLATES[key].prompt)}
            >
              {TEMPLATES[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt History */}
      {promptHistory.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Recent prompts</p>
          <div className="flex flex-wrap gap-2">
            {promptHistory.map((h, i) => (
              <button
                key={i}
                className="fb-chip text-left max-w-full truncate"
                onClick={() => setPrompt(h)}
                title={h}
              >
                {h.length > 50 ? h.slice(0, 50) + "…" : h}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
