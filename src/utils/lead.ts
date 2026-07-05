import { FUNNEL_STAGES, type Lead, type LeadStage, type User } from "@/types";

export function getLeadSubtitle(lead: {
  company?: string;
  email: string;
}): string {
  return lead.company ?? lead.email;
}

export function getInitialsFromName(name: string, uppercase = false): string {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return uppercase ? initials.toUpperCase() : initials;
}

export function getUserInitials(
  users: User[],
  options: { authName?: string; assignedToId?: string },
): string | undefined {
  if (options.authName) {
    return getInitialsFromName(options.authName, true);
  }

  const user = users.find((item) => item.id === options.assignedToId);
  if (user) {
    return getInitialsFromName(user.name, true);
  }

  return undefined;
}

export function getUserName(users: User[], userId?: string): string {
  return users.find((user) => user.id === userId)?.name ?? "—";
}

export function getLeadTagOptions(leads: Lead[]): string[] {
  const tags = new Set<string>();

  for (const lead of leads) {
    if (Array.isArray(lead.tags)) {
      lead.tags.forEach((tag) => tags.add(tag));
    }
  }

  return Array.from(tags);
}

export function filterLeadsByStage(leads: Lead[], stage: LeadStage): Lead[] {
  return leads.filter((lead) => lead.stage === stage);
}

export function sumLeadValues(leads: Lead[]): number {
  return leads.reduce((sum, lead) => sum + (lead.value ?? 0), 0);
}

export function countLeadsByStage(leads: Lead[]): Record<LeadStage, number> {
  return FUNNEL_STAGES.reduce<Record<LeadStage, number>>(
    (acc, stage) => {
      acc[stage] = filterLeadsByStage(leads, stage).length;
      return acc;
    },
    {} as Record<LeadStage, number>,
  );
}
