import { Input } from "@/components/ui/input";

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TableSearch({ value, onChange }: TableSearchProps) {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Filter data..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
