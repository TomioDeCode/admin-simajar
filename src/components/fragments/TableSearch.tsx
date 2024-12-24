import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TableSearch({ value, onChange, className }: TableSearchProps) {
  return (
    <div className={cn("flex items-center py-4", className)}>
      <Input
        placeholder="Filter data..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
