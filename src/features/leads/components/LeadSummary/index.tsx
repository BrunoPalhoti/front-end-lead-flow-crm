import { Box, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";
import { getLeadSubtitle } from "@/utils/lead";

interface LeadSummaryProps {
  lead: {
    name: string;
    company?: string;
    email: string;
  };
  nameVariant?: TypographyProps["variant"];
  subtitleVariant?: TypographyProps["variant"];
  noWrap?: boolean;
}

export function LeadSummary({
  lead,
  nameVariant = "body2",
  subtitleVariant = "caption",
  noWrap = false,
}: LeadSummaryProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant={nameVariant}
        sx={{ fontWeight: 600 }}
        noWrap={noWrap}
      >
        {lead.name}
      </Typography>
      <Typography
        variant={subtitleVariant}
        color="text.secondary"
        noWrap={noWrap}
      >
        {getLeadSubtitle(lead)}
      </Typography>
    </Box>
  );
}

export default LeadSummary;
