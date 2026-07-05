import type { Lead } from "@/types";
import type { LeadFormValues } from "@/schemas/lead.schema";

export const LEAD_FORM_DEFAULT_VALUES: LeadFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  stage: "new",
  value: undefined,
  assignedToId: "",
  notes: "",
  cnpj: "",
  role: "",
  origin: "",
  probability: undefined,
  expectedAt: "",
  tags: [],
  activities: [],
};

export function leadToFormValues(lead: Lead): LeadFormValues {
  return {
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? "",
    company: lead.company ?? "",
    cnpj: lead.cnpj ?? "",
    role: lead.role ?? "",
    origin: lead.origin ?? "",
    stage: lead.stage,
    value: lead.value,
    assignedToId: lead.assignedToId ?? "",
    probability: lead.probability ?? undefined,
    expectedAt: lead.expectedAt ? lead.expectedAt.slice(0, 10) : "",
    tags: lead.tags ?? [],
    activities: lead.activities ?? [],
    notes: lead.notes ?? "",
  };
}
