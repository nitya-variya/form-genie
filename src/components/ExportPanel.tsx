import { FormSchema } from "../utils/validation";
import {
  copyToClipboard,
  downloadFile,
  generateHTMLExport,
  generateReactExport,
} from "../utils/exportHelpers";
import { useState } from "react";

interface ExportPanelProps {
  schema: FormSchema;
}

export default function ExportPanel({ schema }: ExportPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const flash = (key: string) => {
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyJSON = async () => {
    await copyToClipboard(JSON.stringify(schema, null, 2));
    flash("json");
  };

  const handleDownloadJSON = () => {
    downloadFile(
      `${schema.title.toLowerCase().replace(/\s+/g, "-")}-schema.json`,
      JSON.stringify(schema, null, 2)
    );
  };

  const handleExportHTML = () => {
    const html = generateHTMLExport(schema);
    downloadFile(
      `${schema.title.toLowerCase().replace(/\s+/g, "-")}.html`,
      html,
      "text/html"
    );
  };

  const handleCopyReact = async () => {
    const jsx = generateReactExport(schema);
    await copyToClipboard(jsx);
    flash("react");
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground mb-1">Export</p>
      <div className="grid grid-cols-2 gap-2">
        <button className="fb-btn-secondary text-xs" onClick={handleCopyJSON}>
          {copied === "json" ? "✓ Copied!" : "📋 Copy JSON"}
        </button>
        <button className="fb-btn-secondary text-xs" onClick={handleDownloadJSON}>
          ⬇ Download JSON
        </button>
        <button className="fb-btn-secondary text-xs" onClick={handleExportHTML}>
          🌐 Export HTML
        </button>
        <button className="fb-btn-secondary text-xs" onClick={handleCopyReact}>
          {copied === "react" ? "✓ Copied!" : "⚛ Copy React"}
        </button>
      </div>
    </div>
  );
}
