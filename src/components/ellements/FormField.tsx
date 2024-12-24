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

export function FormField({ field, value, onChange }: FormFieldProps) {
  const renderField = () => {
    switch (field.type) {
      case "select":
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            id={field.id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
          />
        );

      case "radio":
        return (
          <RadioGroup value={value} onValueChange={onChange}>
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.id}-${option.value}`}
                />
                <Label htmlFor={`${field.id}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <Checkbox id={field.id} checked={value} onCheckedChange={onChange} />
        );

      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
          />
        );
    }
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={field.id} className="text-right font-medium">
        {field.label}
      </Label>
      <div className="col-span-3">{renderField()}</div>
    </div>
  );
}
