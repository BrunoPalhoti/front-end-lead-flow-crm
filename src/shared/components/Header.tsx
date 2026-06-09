import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { SIDEBAR_MENU_BUTTON_ID } from "@/shared/components/Sidebar";
import { useUiStore } from "@/store/uiStore";

export function Header() {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Toolbar>
        <IconButton
          id={SIDEBAR_MENU_BUTTON_ID}
          edge="start"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={sidebarOpen}
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" color="text.primary">
            LeadFlow CRM
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          {user?.name ?? "Usuário"}
        </Typography>

        <IconButton onClick={handleLogout} aria-label="Sair">
          <LogoutOutlinedIcon fontSize="small" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
