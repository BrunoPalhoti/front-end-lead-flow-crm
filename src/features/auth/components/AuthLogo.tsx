import BarChartIcon from "@mui/icons-material/BarChart";
import { Box, Typography } from "@mui/material";

export function AuthLogo() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 4 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: "grid",
          placeItems: "center",
        }}
      >
        <BarChartIcon fontSize="small" />
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
        LeadFlow
      </Typography>
    </Box>
  );
}
