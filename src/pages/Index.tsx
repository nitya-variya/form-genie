import { useState, useEffect, useCallback } from "react";
import PromptPanel from "../components/PromptPanel";
import FormRenderer from "../components/FormRenderer";
import AddFieldPanel from "../components/AddFieldPanel";
import JsonEditor from "../components/JsonEditor";
import ExportPanel from "../components/ExportPanel";
import SubmitSuccess from "../components/SubmitSuccess";
import { generateFormSchema } from "../utils/apiCall";
import { FormSchema, FormField, validateForm } from "../utils/validation";

const HISTORY_KEY = "fb_prompt_history";

function loadHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(history: string[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 5)));
}

export default function Index() {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [jsonEditorValue, setJsonEditorValue] = useState("");
  const [jsonEditorError, setJsonEditorError] = useState("");
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [showAddFieldPanel, setShowAddFieldPanel] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<Record<string, unknown>>(
    {},
  );
  const [promptHistory, setPromptHistory] = useState<string[]>(loadHistory);

  useEffect(() => {
    if (schema) {
      setJsonEditorValue(JSON.stringify(schema, null, 2));
    }
  }, [schema]);

  const handleGenerate = useCallback(
    async (prompt: string) => {
      setIsLoading(true);
      setApiError("");
      setIsSubmitted(false);
      try {
        const result = await generateFormSchema(prompt);
        setSchema(result);
        setFormValues({});
        setFormErrors({});
        const newHistory = [
          prompt,
          ...promptHistory.filter((h) => h !== prompt),
        ].slice(0, 5);
        setPromptHistory(newHistory);
        saveHistory(newHistory);
      } catch (err) {
        setApiError(
          err instanceof Error ? err.message : "Something went wrong",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [promptHistory],
  );

  const handleFieldChange = (id: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSubmit = () => {
    if (!schema) return;
    const result = validateForm(schema, formValues);
    if (!result.isValid) {
      setFormErrors(result.errors);
      const firstErrorId = Object.keys(result.errors)[0];
      const el = document.getElementById(`field-${firstErrorId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmittedData(formValues);
    setIsSubmitted(true);
  };

  const handleMoveField = (index: number, dir: -1 | 1) => {
    if (!schema) return;
    const fields = [...schema.fields];
    const target = index + dir;
    if (target < 0 || target >= fields.length) return;
    [fields[index], fields[target]] = [fields[target], fields[index]];
    setSchema({ ...schema, fields });
  };

  const handleDeleteField = (index: number) => {
    if (!schema) return;
    const fields = schema.fields.filter((_, i) => i !== index);
    setSchema({ ...schema, fields });
  };

  const handleDuplicateField = (index: number) => {
    if (!schema) return;
    const fields = [...schema.fields];
    const original = fields[index];
    const dup: FormField = {
      ...original,
      id: original.id + "_copy_" + Date.now().toString(36),
      label: original.label + " (copy)",
    };
    fields.splice(index + 1, 0, dup);
    setSchema({ ...schema, fields });
  };

  const handleAddField = (field: FormField) => {
    if (!schema) return;
    setSchema({ ...schema, fields: [...schema.fields, field] });
    setShowAddFieldPanel(false);
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonEditorValue);
      if (!parsed.title || !Array.isArray(parsed.fields)) {
        setJsonEditorError('JSON must have "title" and "fields" array');
        return;
      }
      setSchema(parsed);
      setFormValues({});
      setFormErrors({});
      setJsonEditorError("");
    } catch (err) {
      setJsonEditorError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const handleReset = () => {
    setSchema(null);
    setFormValues({});
    setFormErrors({});
    setIsSubmitted(false);
    setSubmittedData({});
    setShowJsonEditor(false);
    setApiError("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              F
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">
              FormCraft <span className="text-primary">AI</span>
            </h1>
          </div>
          <span className="fb-badge">AI-Powered</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="fb-card p-5">
              <h2 className="font-display text-base font-semibold mb-3 text-foreground">
                Describe Your Form
              </h2>
              <PromptPanel
                onGenerate={handleGenerate}
                isLoading={isLoading}
                promptHistory={promptHistory}
              />
            </div>

            {apiError && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
                <p className="text-destructive text-sm font-medium">⚠ Error</p>
                <p className="text-destructive/80 text-xs mt-1">{apiError}</p>
              </div>
            )}

            {schema && (
              <>
                <div className="fb-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      Tools
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        className="fb-btn-secondary text-xs flex-1"
                        onClick={() => setShowJsonEditor(!showJsonEditor)}
                      >
                        {showJsonEditor ? "Hide JSON" : "{ } View JSON"}
                      </button>
                      <button
                        className="fb-btn-secondary text-xs flex-1"
                        onClick={() => setShowAddFieldPanel(true)}
                      >
                        + Add Field
                      </button>
                    </div>
                  </div>
                </div>

                <div className="fb-card p-5">
                  <ExportPanel schema={schema} />
                </div>
              </>
            )}
          </aside>

          {/* Main Panel */}
          <main className="lg:col-span-8">
            {!schema && !isLoading && (
              <div className="fb-card p-12 text-center">
                <div className="text-5xl mb-4">✦</div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Build Forms with AI information
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Describe the form you need in plain English and let AI
                  generate it instantly. Edit, customize, and export to HTML or
                  React.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="fb-card p-12 text-center animate-pulse-glow">
                <div className="inline-block w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground">Generating your form...</p>
              </div>
            )}

            {schema && !isLoading && (
              <div className="space-y-4">
                {showJsonEditor && (
                  <div className="fb-card p-5">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                      JSON Schema Editor
                    </h3>
                    <JsonEditor
                      value={jsonEditorValue}
                      error={jsonEditorError}
                      onChange={setJsonEditorValue}
                      onApply={handleApplyJson}
                    />
                  </div>
                )}

                <div className="fb-card p-6">
                  {isSubmitted ? (
                    <SubmitSuccess data={submittedData} onReset={handleReset} />
                  ) : (
                    <FormRenderer
                      schema={schema}
                      formValues={formValues}
                      formErrors={formErrors}
                      onChange={handleFieldChange}
                      onSubmit={handleSubmit}
                      onMoveField={handleMoveField}
                      onDeleteField={handleDeleteField}
                      onDuplicateField={handleDuplicateField}
                    />
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {showAddFieldPanel && schema && (
        <AddFieldPanel
          onAdd={handleAddField}
          onClose={() => setShowAddFieldPanel(false)}
        />
      )}
    </div>
  );
}
