"use client";

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
import { useEffect, useState, useCallback } from "react";

interface Option {
  value: string | boolean | null;
  label: string;
}

interface FormFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  className?: string;
}

export function FormFields({ field, value, onChange, className = "" }: FormFieldProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOptions = useCallback(async () => {
    if (!field.options) return;

    try {
      setIsLoading(true);
      setError(null);
      const loadedOptions = typeof field.options === 'function'
        ? await field.options()
        : field.options;
      setOptions(loadedOptions as Option[]);
    } catch (err) {
      setError('Failed to load options');
      console.error('Error loading options:', err);
    } finally {
      setIsLoading(false);
    }
  }, [field.options]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const renderRadioOptions = () => {
    if (isLoading) return <div className="text-sm text-gray-500">Loading options...</div>;
    if (error) return <div className="text-sm text-red-500">{error}</div>;

    return options.map((option) => (
      <div key={String(option.value)} className="flex items-center space-x-2">
        <RadioGroupItem
          value={String(option.value)}
          id={`${field.id}-${option.value}`}
        />
        <Label htmlFor={`${field.id}-${option.value}`}>
          {option.label}
        </Label>
      </div>
    ));
  };

  const renderSelectOptions = () => {
    if (isLoading) {
      return (
        <SelectItem value="loading" disabled>
          Loading options...
        </SelectItem>
      );
    }

    if (error) {
      return (
        <SelectItem value="error" disabled>
          {error}
        </SelectItem>
      );
    }

    return options.map((option) => {
      const optionValue = String(option.value || 'undefined');
      return (
        <SelectItem key={optionValue} value={optionValue}>
          {option.label}
        </SelectItem>
      );
    });
  };

  const renderField = () => {
    const commonProps = {
      id: field.id,
      value: value ?? '',
      placeholder: field.placeholder,
      disabled: field.disabled,
      "aria-required": field.required,
      "aria-label": field.label,
    };

    switch (field.type) {
      case "select":
        const selectValue = String(value ?? 'undefined');
        return (
          <Select
            value={selectValue}
            onValueChange={onChange}
            disabled={field.disabled || isLoading}
          >
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
          <RadioGroup
            value={String(value ?? '')}
            onValueChange={onChange}
            disabled={field.disabled || isLoading}
          >
            {renderRadioOptions()}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <Checkbox
            id={field.id}
            checked={!!value}
            onCheckedChange={onChange}
            disabled={field.disabled}
            aria-label={field.label}
          />
        );

      default:
        if (field.type === "date" && value) {
          const date = new Date(value);
          const formattedDate = date.toISOString().slice(0, 10);
          return (
            <Input
              {...commonProps}
              type="date"
              value={formattedDate}
              onChange={(e) => onChange(e.target.value)}
              min={field.min}
              max={field.max}
            />
          );
        }
        return (
          <Input
            {...commonProps}
            type={field.type || "text"}
            onChange={(e) => onChange(e.target.value)}
            min={field.min}
            max={field.max}
          />
        );
    }
  };

  return (
    <div className={`grid gap-2 ${className}`}>
      <Label
        htmlFor={field.id}
        className="text-sm font-medium text-gray-700 flex items-center"
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1 text-sm">*</span>}
      </Label>
      <div className="relative">
        {renderField()}
        {field.description && (
          <p className="mt-1 text-sm text-gray-500">{field.description}</p>
        )}
      </div>
    </div>
  );
}