import type { Lead, User } from "@/types";

export interface LeadDetailPanelProps {
  lead: Lead | null;
  users: User[];
}

export type { Lead, User };
