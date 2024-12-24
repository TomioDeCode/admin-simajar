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
import { Pencil, Plus } from "lucide-react";
import { useState, useCallback } from "react";
import { FormFields } from "@/components/ellements/FormField";
import { FormField as FormFieldType } from "@/types/form";

interface DialogFormProps {
  title: string;
  description: string;
  fields: FormFieldType[];
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  initialData?: Record<string, any>;
  isUpdate?: boolean;
}

export function DialogForm({
  title,
  description,
  fields,
  onSubmit,
  initialData = {},
  isUpdate = false,
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
                initialData[field.id] ?? (field.type === "checkbox" ? false : ""),
            }),
            {}
          )
        );
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fields, formData, initialData, onSubmit]
  );

  const handleFieldChange = useCallback((id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isUpdate ? "ghost" : "default"}
          className="flex items-center gap-2 px-4 py-2 transition-colors duration-200"
        >
          {isUpdate ? (
            <div className="w-6 h-6 flex items-center justify-center">
              <Pencil className="w-4 h-4" />
            </div>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            {fields.map((field) => (
              <FormFields
                key={field.id}
                field={field}
                value={formData[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
              />
            ))}
          </div>
          <DialogFooter className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 px-4 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : isUpdate ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
