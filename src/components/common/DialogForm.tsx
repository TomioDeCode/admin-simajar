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
import { useState } from "react";
import { FormField } from "@/components/ellements/FormField";
import { FormField as FormFieldType } from "@/types/form";

interface DialogFormProps {
  title: string;
  description: string;
  fields: FormFieldType[];
  onSubmit: (data: Record<string, any>) => void;
}

export function DialogForm({
  title,
  description,
  fields,
  onSubmit,
  initialData = {},
  isUpdate = false,
}: DialogFormProps & {
  initialData?: Record<string, any>;
  isUpdate?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(
    fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.id]:
          initialData[field.id] ?? (field.type === "checkbox" ? false : ""),
      }),
      {}
    )
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isUpdate ? "ghost" : "default"}
          className="flex items-center gap-2 px-4 py-2 transition-colors duration-200"
        >
          {isUpdate ? (
            <div className="w-1 h-1 flex items-center justify-center">
              <Pencil />
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
              <FormField
                key={field.id}
                field={field}
                value={formData[field.id]}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, [field.id]: value }))
                }
              />
            ))}
          </div>
          <DialogFooter className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 px-4 py-2">
              {isUpdate ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
