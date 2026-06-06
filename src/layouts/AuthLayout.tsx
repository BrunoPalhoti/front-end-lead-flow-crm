import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { AuthIllustration } from '@/components/auth/AuthIllustration'

export function AuthLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.paper' }}>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 4, md: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Outlet />
        </Box>
      </Box>

      <AuthIllustration />
    </Box>
  )
}
