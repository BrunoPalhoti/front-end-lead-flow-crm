import React from "react";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import type { Lead, User } from "@/types";

interface Props {
  lead: Lead;
  users: User[];
  initials: string;
}

export default function LeadHeader({ lead, users, initials }: Props) {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Avatar sx={{ width: 64, height: 64 }}>{initials}</Avatar>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="h6">{lead.name}</Typography>
        </Box>
        <Typography color="text.secondary">{lead.company ?? "—"}</Typography>
        <Typography color="text.secondary" variant="body2">
          {lead.cnpj ?? ""}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1}>
        <IconButton
          component="a"
          aria-label="phone"
          href={lead.phone ? `tel:${lead.phone}` : undefined}
          size="small"
        >
          <PhoneIcon />
        </IconButton>
        <IconButton
          component="a"
          aria-label="email"
          href={`mailto:${lead.email}`}
          size="small"
        >
          <EmailIcon />
        </IconButton>
        <IconButton
          component="a"
          aria-label="whatsapp"
          href={
            lead.phone
              ? `https://wa.me/${lead.phone.replace(/\D/g, "")}`
              : undefined
          }
          size="small"
        >
          <WhatsAppIcon />
        </IconButton>
        <IconButton aria-label="more" size="small">
          <MoreHorizIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
