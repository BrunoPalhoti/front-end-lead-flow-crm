import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useUiStore } from "@/store/uiStore";

const DRAWER_WIDTH = 260;
export const SIDEBAR_MENU_BUTTON_ID = "sidebar-menu-button";

function focusSidebarMenuButton() {
  document.getElementById(SIDEBAR_MENU_BUTTON_ID)?.focus();
}

const navItems = [
  { label: "Dashboard", path: "/", icon: <DashboardOutlinedIcon /> },
  { label: "Leads", path: "/leads", icon: <PeopleAltOutlinedIcon /> },
  { label: "Funil", path: "/funnel", icon: <FilterAltOutlinedIcon /> },
];

export function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ px: 2.5, gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          LF
        </Box>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, lineHeight: 1.2 }}
          >
            LeadFlow
          </Typography>
          <Typography variant="caption" color="text.secondary">
            CRM Comercial
          </Typography>
        </Box>
      </Toolbar>

      <List sx={{ px: 1.5, flex: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === "/"}
            onClick={() => {
              if (isMobile) {
                focusSidebarMenuButton();
                setSidebarOpen(false);
              }
            }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&.active": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": { color: "primary.contrastText" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => {
          focusSidebarMenuButton();
          setSidebarOpen(false);
        }}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="persistent"
      open={sidebarOpen}
      sx={{
        width: sidebarOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}
