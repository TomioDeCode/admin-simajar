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
import { useEffect, useState } from "react";

interface FormFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
}

export function FormFields({ field, value, onChange }: FormFieldProps) {
  const [radioOptions, setRadioOptions] = useState<{value: string, label: string}[]>([]);
  const [selectOptions, setSelectOptions] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      if (field.options) {
        const options = typeof field.options === 'function' ? await field.options() : field.options;
        if (field.type === 'radio') {
          setRadioOptions(options);
        } else if (field.type === 'select') {
          setSelectOptions(options);
        }
      }
    };
    loadOptions();
  }, [field.options, field.type]);

  const renderRadioOptions = () => {
    return radioOptions.map((option) => (
      <div key={option.value} className="flex items-center space-x-2">
        <RadioGroupItem
          value={option.value}
          id={`${field.id}-${option.value}`}
        />
        <Label htmlFor={`${field.id}-${option.value}`}>
          {option.label}
        </Label>
      </div>
    ));
  };

  const renderSelectOptions = () => {
    return selectOptions.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ));
  };

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
        if (field.type === "date" && value) {
          const date = new Date(value);
          const formattedDate = date.toISOString().slice(0, 10);
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
    <div className="grid gap-2">
      <Label
        htmlFor={field.id}
        className="text-sm font-medium text-gray-700 flex items-center"
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1 text-sm">*</span>}
      </Label>
      <div className="relative">
        {renderField()}
        <div className="absolute inset-0 pointer-events-none border border-gray-200 rounded-md focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200" />
      </div>
    </div>
  );
}
