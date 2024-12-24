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
  options?: { value: string; label: string }[];
  required?: boolean;
  rows?: number;
  min?: number;
  max?: number;
}

export interface DataType {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}