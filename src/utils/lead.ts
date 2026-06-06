interface LeadSubtitle {
  company?: string
  email: string
}

export function getLeadSubtitle(lead: LeadSubtitle): string {
  return lead.company ?? lead.email
}
