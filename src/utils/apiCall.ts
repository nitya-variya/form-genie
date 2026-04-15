import { FormSchema } from "./validation";

const SYSTEM_PROMPT = `You are a JSON form schema generator.
The user describes a form. You respond ONLY with a valid JSON object matching this exact schema — no explanation, no markdown, no code blocks, just raw JSON:
{ "title": "...", "description": "...", "fields": [...] }

Field types allowed: text, email, tel, number, textarea, select, radio, checkbox, range, date, url, password.
Use "options" array only for select, radio, checkbox.
Use "min", "max", "step" only for range and number.
Use "validation" object only when the field clearly needs length or pattern constraints.
All field ids must be unique snake_case strings.
required defaults to true unless the field is clearly optional.`;

export async function generateFormSchema(userPrompt: string): Promise<FormSchema> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Backend not configured. Please enable Lovable Cloud.");
  }

  const resp = await fetch(`${supabaseUrl}/functions/v1/generate-form`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ prompt: userPrompt }),
  });

  if (resp.status === 429) {
    throw new Error("Rate limit exceeded. Please wait a moment and try again.");
  }
  if (resp.status === 402) {
    throw new Error("AI credits exhausted. Please add funds in Settings > Workspace > Usage.");
  }
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`API error: ${errText}`);
  }

  const data = await resp.json();

  if (!data || !data.title || !Array.isArray(data.fields)) {
    throw new Error("AI returned an invalid form schema. Please try again with a clearer description.");
  }

  return data as FormSchema;
}
