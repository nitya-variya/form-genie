export interface FormField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+\..+/;

export function validateForm(
  schema: FormSchema,
  formValues: Record<string, unknown>
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const field of schema.fields) {
    const value = formValues[field.id];
    const strVal = typeof value === "string" ? value.trim() : "";
    const isEmpty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (field.required && isEmpty) {
      errors[field.id] = `${field.label} is required`;
      continue;
    }

    if (isEmpty) continue;

    if (field.type === "email" && !EMAIL_REGEX.test(strVal)) {
      errors[field.id] = "Please enter a valid email address";
    }

    if (field.type === "url" && !URL_REGEX.test(strVal)) {
      errors[field.id] = "Please enter a valid URL (https://...)";
    }

    if (
      (field.type === "number" || field.type === "range") &&
      typeof value === "number"
    ) {
      if (field.min !== undefined && value < field.min) {
        errors[field.id] = `Value must be at least ${field.min}`;
      }
      if (field.max !== undefined && value > field.max) {
        errors[field.id] = `Value must be at most ${field.max}`;
      }
    }

    if (field.validation && strVal) {
      if (
        field.validation.minLength &&
        strVal.length < field.validation.minLength
      ) {
        errors[field.id] = `Must be at least ${field.validation.minLength} characters`;
      }
      if (
        field.validation.maxLength &&
        strVal.length > field.validation.maxLength
      ) {
        errors[field.id] = `Must be no more than ${field.validation.maxLength} characters`;
      }
      if (field.validation.pattern) {
        try {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(strVal)) {
            errors[field.id] = "Value does not match the required format";
          }
        } catch {
          // Invalid regex pattern, skip
        }
      }
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
