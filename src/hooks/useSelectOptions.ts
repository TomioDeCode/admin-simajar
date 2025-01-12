interface SelectOption {
  label: string;
  value: string | number;
}

interface InputOption {
  name?: string;
  title?: string;
  label?: string;
  value?: string | number;
  id?: string | number;
}

import { useState } from "react";

export function useSelectOptions() {
  const [options, setOptions] = useState<Record<string, SelectOption[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const getOptions = async (
    field: string,
    optionsConfig: string | InputOption[]
  ) => {
    if (options[field]) return;

    if (Array.isArray(optionsConfig)) {
      const formattedOptions = optionsConfig.map((item) => ({
        label: item.name || item.title || item.label || "",
        value: item.id || item.value || "",
      }));
      setOptions((prev) => ({ ...prev, [field]: formattedOptions }));
      return;
    }

    setLoading((prev) => ({ ...prev, [field]: true }));
    try {
      const fullUrl = process.env.NEXT_PUBLIC_API_URL + optionsConfig;
      const response = await fetch(fullUrl);
      const data = await response.json();
      const formattedOptions = data.data.map((item: InputOption) => ({
        label: item.name || item.title || item.label || "",
        value: item.id || item.value || "",
      }));
      setOptions((prev) => ({ ...prev, [field]: formattedOptions }));
    } catch (error) {
      console.error(`Error fetching options for ${field}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [field]: false }));
    }
  };

  return { options, loading, getOptions };
}
