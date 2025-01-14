import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  onDelete?: (data: T) => void;
  columns: ColumnConfig[];
  initialData?: T | null;
  isSubmitting?: boolean;
}

export function TableDialog<T extends TableData>({
  open,
  onClose,
  onSubmit,
  columns,
  initialData,
  isSubmitting,
}: TableDialogProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(initialData || {});
  const { options, loading, getOptions } = useSelectOptions();

  useEffect(() => {
    if (open) {
      const processedData = { ...initialData };
      columns.forEach((column) => {
        if (column.type === "switch") {
          processedData[column.accessor] =
            typeof initialData?.[column.accessor] === "string"
              ? initialData[column.accessor] === "true"
              : Boolean(initialData?.[column.accessor]);
        }
      });
      setFormData(processedData as Partial<T>);

      columns.forEach((column) => {
        if (column.type === "select" && column.optionsUrl) {
          getOptions(column.accessor, column.optionsUrl);
        }
      });
    }
  }, [open, initialData, columns]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (column: ColumnConfig) => {
    const value = formData[column.accessor as keyof T];

    switch (column.type) {
      case "switch":
        return (
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor={column.accessor} className="text-sm">
              {column.header}
            </Label>
            <Switch
              id={column.accessor}
              checked={Boolean(value)}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({
                  ...prev,
                  [column.accessor]: checked,
                }));
              }}
              disabled={isSubmitting}
            />
          </div>
        );
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
                <SelectItem key={opt.value} value={String(opt.value)}>
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
            value={String(value)}
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
            value={String(value)}
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
                {column.type !== "switch" && (
                  <Label htmlFor={column.accessor}>{column.header}</Label>
                )}
                {renderField(column)}
              </div>
            ))}
            <DialogFooter className="flex justify-between gap-2">
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
    </>
  );
}
