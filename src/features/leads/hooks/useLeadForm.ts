import { useState } from "react";
import type { Lead } from "@/types";

export function useLeadForm(initial?: Lead | null) {
  const [form, setForm] = useState<Partial<Lead>>(() => (initial ? { ...initial } : {}));
  const [isEditing, setIsEditing] = useState(false);

  function resetTo(lead?: Lead | null) {
    setForm(lead ? { ...lead } : {});
    setIsEditing(false);
  }

  return { form, setForm, isEditing, setIsEditing, resetTo } as const;
}

export default useLeadForm;
