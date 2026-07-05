import type { CreateLeadPayload } from "@/types";
import type { LeadFormValues } from "@/schemas/lead.schema";
import { LEAD_FORM_DEFAULT_VALUES } from "@/features/leads/utils/leadForm";

export function formValuesToCreatePayload(
  values: LeadFormValues,
): CreateLeadPayload {
  return {
    name: values.name,
    email: values.email,
    phone: values.phone || undefined,
    company: values.company || undefined,
    cnpj: values.cnpj || undefined,
    role: values.role || undefined,
    origin: values.origin || undefined,
    stage: values.stage,
    value: values.value ?? undefined,
    assignedToId: values.assignedToId || undefined,
    notes: values.notes || undefined,
    probability: values.probability ?? undefined,
    expectedAt: values.expectedAt
      ? new Date(values.expectedAt).toISOString()
      : undefined,
    tags: values.tags && values.tags.length > 0 ? values.tags : undefined,
    activities:
      values.activities && values.activities.length > 0
        ? values.activities
        : undefined,
  };
}

export function normalizeCreateLeadPayload(
  values: CreateLeadPayload,
): CreateLeadPayload {
  return formValuesToCreatePayload({
    ...LEAD_FORM_DEFAULT_VALUES,
    ...values,
    stage: values.stage ?? "new",
    phone: values.phone ?? "",
    company: values.company ?? "",
    cnpj: values.cnpj ?? "",
    role: values.role ?? "",
    origin: values.origin ?? "",
    assignedToId: values.assignedToId ?? "",
    notes: values.notes ?? "",
    expectedAt: values.expectedAt ? values.expectedAt.slice(0, 10) : "",
    tags: values.tags ?? [],
    activities: values.activities ?? [],
  });
}
