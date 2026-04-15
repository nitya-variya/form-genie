import { FormSchema } from "../utils/validation";
import FormFieldComponent from "./FormFieldComponent";
import FieldControls from "./FieldControls";
import ProgressBar from "./ProgressBar";

interface FormRendererProps {
  schema: FormSchema;
  formValues: Record<string, unknown>;
  formErrors: Record<string, string>;
  onChange: (id: string, value: unknown) => void;
  onSubmit: () => void;
  onMoveField: (index: number, dir: -1 | 1) => void;
  onDeleteField: (index: number) => void;
  onDuplicateField: (index: number) => void;
}

export default function FormRenderer({
  schema,
  formValues,
  formErrors,
  onChange,
  onSubmit,
  onMoveField,
  onDeleteField,
  onDuplicateField,
}: FormRendererProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-1">
      <ProgressBar schema={schema} formValues={formValues} />
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {schema.title}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {schema.description}
        </p>
      </div>

      <div className="space-y-4">
        {schema.fields.map((field, index) => (
          <div
            key={field.id}
            className="fb-field-card group"
            id={`field-${field.id}`}
          >
            <FieldControls
              index={index}
              total={schema.fields.length}
              onMoveUp={() => onMoveField(index, -1)}
              onMoveDown={() => onMoveField(index, 1)}
              onDelete={() => onDeleteField(index)}
              onDuplicate={() => onDuplicateField(index)}
            />
            <FormFieldComponent
              field={field}
              value={formValues[field.id]}
              error={formErrors[field.id]}
              onChange={onChange}
            />
          </div>
        ))}
      </div>

      {schema.fields.length > 0 && (
        <div className="pt-4">
          <button type="submit" className="fb-btn-primary w-full text-base py-3"> Submit Form </button>
        </div>
      )}
    </form>
  );
}
