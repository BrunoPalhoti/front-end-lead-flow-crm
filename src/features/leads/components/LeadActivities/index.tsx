import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import type { Lead } from "@/types";

interface Props {
  activities: NonNullable<Lead["activities"]>;
  initials: string;
  currentLead: Lead;
}

export function LeadActivities({
  activities,
  initials,
  currentLead,
}: Props) {
  return (
    <Box sx={{ width: 320 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1">Atividades recentes</Typography>
        <Box />
      </Box>

      <List>
        {activities.length > 0 ? (
          activities.map((act, idx) => (
            <ListItem key={idx} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {act.userInitials ?? initials}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={act.title}
                secondary={act.date ? new Date(act.date).toLocaleString() : ""}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText
              primary={currentLead.notes ?? "Sem atividades"}
              secondary={
                currentLead.updatedAt
                  ? new Date(currentLead.updatedAt).toLocaleDateString()
                  : undefined
              }
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
}

export default LeadActivities;
