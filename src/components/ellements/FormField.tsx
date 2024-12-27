import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/types/form";

interface FormFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
}

export function FormFields({ field, value, onChange }: FormFieldProps) {
  const renderRadioOptions = () => (
    field.options?.map((option) => (
      <div key={option.value} className="flex items-center space-x-2">
        <RadioGroupItem
          value={option.value}
          id={`${field.id}-${option.value}`}
        />
        <Label htmlFor={`${field.id}-${option.value}`}>
          {option.label}
        </Label>
      </div>
    ))
  );

  const renderSelectOptions = () => (
    field.options?.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))
  );

  const renderField = () => {
    const commonProps = {
      id: field.id,
      value,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case "select":
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {renderSelectOptions()}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            onChange={(e) => onChange(e.target.value)}
            rows={field.rows || 3}
          />
        );

      case "radio":
        return (
          <RadioGroup value={value} onValueChange={onChange}>
            {renderRadioOptions()}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <Checkbox
            id={field.id}
            checked={value}
            onCheckedChange={onChange}
          />
        );

      default:
        if (field.type === "datetime-local" && value) {
          const date = new Date(value);
          const formattedDate = date.toISOString().slice(0, 16);
          return (
            <Input
              {...commonProps}
              type={field.type}
              value={formattedDate}
              onChange={(e) => onChange(e.target.value)}
              required={field.required}
              min={field.min}
              max={field.max}
            />
          );
        }
        return (
          <Input
            {...commonProps}
            type={field.type}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            min={field.min}
            max={field.max}
          />
        );
    }
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label
        htmlFor={field.id}
        className="text-right font-medium"
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="col-span-3">{renderField()}</div>
    </div>
  );
}
