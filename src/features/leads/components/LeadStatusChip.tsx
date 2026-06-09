import type { LeadStage } from "@/types";
import { LEAD_STAGE_LABELS } from "@/types";
import { Chip } from "@mui/material";

const stageColors: Record<
  LeadStage,
  "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info"
> = {
  new: "info",
  contacted: "primary",
  qualified: "secondary",
  proposal: "warning",
  negotiation: "warning",
  won: "success",
  lost: "error",
};

interface LeadStatusChipProps {
  stage: LeadStage;
}

export function LeadStatusChip({ stage }: LeadStatusChipProps) {
  return (
    <Chip
      label={LEAD_STAGE_LABELS[stage]}
      color={stageColors[stage]}
      size="small"
      variant="outlined"
    />
  );
}
