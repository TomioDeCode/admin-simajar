import { useState, useEffect } from "react";
import { SelectOption } from "@/types/tableReus";

export function useSelectOptions() {
  const [options, setOptions] = useState<Record<string, SelectOption[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const fetchOptions = async (field: string, url: string) => {
    if (options[field]) return;

    setLoading((prev) => ({ ...prev, [field]: true }));
    try {
      const response = await fetch(url);
      const data = await response.json();
      const formattedOptions = data.map((item: any) => ({
        label: item.name || item.title,
        value: item.id,
      }));
      setOptions((prev) => ({ ...prev, [field]: formattedOptions }));
    } catch (error) {
      console.error(`Error fetching options for ${field}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [field]: false }));
    }
  };

  return { options, loading, fetchOptions };
}
