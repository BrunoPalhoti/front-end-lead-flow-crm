import { Box, Button, Divider, Typography } from '@mui/material'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c3.4-3.125 3.684-7.735 1.522-11.616z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="1" y="1" width="7.5" height="7.5" fill="#F25022" />
      <rect x="9.5" y="1" width="7.5" height="7.5" fill="#7FBA00" />
      <rect x="1" y="9.5" width="7.5" height="7.5" fill="#00A4EF" />
      <rect x="9.5" y="9.5" width="7.5" height="7.5" fill="#FFB900" />
    </svg>
  )
}

interface SocialLoginButtonsProps {
  dividerText: string
}

export function SocialLoginButtons({ dividerText }: SocialLoginButtonsProps) {
  return (
    <Box sx={{ mt: 3 }}>
      <Divider>
        <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
          {dividerText}
        </Typography>
      </Divider>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.25,
            borderColor: 'divider',
            color: 'text.primary',
            bgcolor: 'background.paper',
          }}
        >
          Google
        </Button>
        <Button
          variant="outlined"
          startIcon={<MicrosoftIcon />}
          sx={{
            py: 1.25,
            borderColor: 'divider',
            color: 'text.primary',
            bgcolor: 'background.paper',
          }}
        >
          Microsoft
        </Button>
      </Box>
    </Box>
  )
}
