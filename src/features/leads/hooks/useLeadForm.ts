import { useState } from "react";
import type { Lead } from "@/types";

export function useLeadForm(lead?: Lead | null) {
  const [draft, setDraft] = useState<Partial<Lead> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const baseForm: Partial<Lead> = lead ? { ...lead } : {};
  const form = isEditing ? (draft ?? baseForm) : baseForm;

  function setForm(
    value: Partial<Lead> | ((prev: Partial<Lead>) => Partial<Lead>),
  ) {
    setDraft((prev) => {
      const current = prev ?? baseForm;
      return typeof value === "function" ? value(current) : value;
    });
  }

  function handleSetIsEditing(editing: boolean) {
    if (!editing) {
      setDraft(null);
    }
    setIsEditing(editing);
  }

  function resetTo(nextLead?: Lead | null) {
    setDraft(nextLead ? { ...nextLead } : null);
    setIsEditing(false);
  }

  return {
    form,
    setForm,
    isEditing,
    setIsEditing: handleSetIsEditing,
    resetTo,
  } as const;
}
