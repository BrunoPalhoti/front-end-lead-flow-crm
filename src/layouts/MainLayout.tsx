import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { useUiStore } from '@/store/uiStore'

export function MainLayout() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          transition: (theme) =>
            theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Header />

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            maxWidth: 1400,
            mx: 'auto',
            width: '100%',
            ml: sidebarOpen ? 0 : 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
