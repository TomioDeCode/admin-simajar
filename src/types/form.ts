export interface FormField {
  id: string;
  label: string;
  type:
  | "text"
  | "email"
  | "select"
  | "textarea"
  | "radio"
  | "checkbox"
  | "date"
  | "number"
  | "tel"
  | "password";
  placeholder?: string;
  options?: { value: string | boolean | null; label: string }[] | (() => Promise<{ value: string | boolean | null; label: string }[]>);
  required?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  description?: string;
}
