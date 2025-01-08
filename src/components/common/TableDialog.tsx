import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useSelectOptions } from "@/hooks/useSelectOptions";
import { ColumnConfig, TableData } from "@/types/tableReus";

interface TableDialogProps<T> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<T>) => void;
  onDelete?: () => void;
  columns: ColumnConfig[];
  initialData?: T | null;
  isSubmitting?: boolean;
}

export function TableDialog<T extends TableData>({
  open,
  onClose,
  onSubmit,
  onDelete,
  columns,
  initialData,
  isSubmitting,
}: TableDialogProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(initialData || {});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { options, loading, fetchOptions } = useSelectOptions();

  useEffect(() => {
    if (open) {
      setFormData(initialData || {});
      columns.forEach((column) => {
        if (column.type === "select" && column.optionsUrl) {
          fetchOptions(column.accessor, column.optionsUrl);
        }
      });
    }
  }, [open, initialData, columns]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setShowDeleteDialog(false);
    }
  };

  const renderField = (column: ColumnConfig) => {
    const value = formData[column.accessor as keyof T] || "";

    switch (column.type) {
      case "select":
        return (
          <Select
            value={String(value)}
            onValueChange={(value) =>
              setFormData({ ...formData, [column.accessor]: value })
            }
            disabled={isSubmitting || loading[column.accessor]}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${column.header}`} />
            </SelectTrigger>
            <SelectContent>
              {options[column.accessor]?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [column.accessor]: e.target.value })
            }
            disabled={isSubmitting}
            required={column.validation?.required}
          />
        );
      default:
        return (
          <Input
            type={column.type}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [column.accessor]: e.target.value })
            }
            disabled={isSubmitting}
            required={column.validation?.required}
            pattern={column.validation?.pattern?.source}
            min={column.validation?.min}
            max={column.validation?.max}
          />
        );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{initialData ? "Edit" : "Add"} Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {columns.map((column) => (
              <div key={column.accessor} className="space-y-2">
                <Label htmlFor={column.accessor}>{column.header}</Label>
                {renderField(column)}
              </div>
            ))}
            <DialogFooter className="flex justify-between gap-2">
              {initialData && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
