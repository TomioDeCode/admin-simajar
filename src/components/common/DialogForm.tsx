"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Pencil, Plus, X } from "lucide-react";
import { useState, useCallback, ReactNode } from "react";
import { FormFields } from "@/components/ellements/FormField";
import { FormField as FormFieldType } from "@/types/form";

interface DialogFormProps {
  title: string;
  description: string;
  fields: FormFieldType[];
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  initialData?: Record<string, any>;
  isUpdate?: boolean;
  trigger?: ReactNode;
}

export function DialogForm({
  title,
  description,
  fields,
  onSubmit,
  initialData = {},
  isUpdate = false,
  trigger,
}: DialogFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(() =>
    fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.id]:
          initialData[field.id] ?? (field.type === "checkbox" ? false : ""),
      }),
      {}
    )
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setIsSubmitting(true);
        await onSubmit(formData);
        setOpen(false);
        setFormData(
          fields.reduce(
            (acc, field) => ({
              ...acc,
              [field.id]:
                initialData[field.id] ??
                (field.type === "checkbox" ? false : ""),
            }),
            {}
          )
        );
      } catch (error) {
        console.error("Form submission error:", {
          error,
          formData,
          component: "DialogForm"
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [fields, formData, initialData, onSubmit]
  );

  const handleFieldChange = useCallback((id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setOpen(false);
    }
  }, [isSubmitting]);

  const defaultTrigger = isUpdate ? (
    <Button
      variant="ghost"
      size="icon"
      className="hover:bg-gray-100 rounded-full focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 w-8 h-8"
    >
      <Pencil className="w-4 h-4 text-gray-600" />
    </Button>
  ) : (
    <Button
      variant="default"
      className="grid grid-flow-col gap-2 shadow-sm hover:shadow-md px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-all duration-200 group"
    >
      <Plus className="group-hover:rotate-90 w-4 h-4 transition-transform duration-200" />
      <span>Create</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>

      <DialogContent className="shadow-lg p-2 rounded-xl sm:max-w-[425px] overflow-hidden">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <DialogHeader className="relative space-y-3 bg-gradient-to-b from-gray-50 to-white p-6">
            <DialogTitle className="font-semibold text-gray-900 text-xl tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 mt-1 px-6 pt-1 max-h-[60vh] overflow-y-auto">
            {fields.map((field) => (
              <FormFields
                key={field.id}
                field={field}
                value={formData[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
              />
            ))}
          </div>

          <DialogFooter className="grid grid-cols-2 gap-3 border-gray-100 bg-gradient-to-t from-gray-50 to-white p-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-200 hover:bg-gray-50 disabled:opacity-50 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 text-gray-700 hover:text-gray-900"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="justify-center items-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="grid grid-flow-col gap-2 place-items-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : isUpdate ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
