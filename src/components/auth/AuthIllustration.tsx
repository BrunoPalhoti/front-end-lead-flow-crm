import { Box } from '@mui/material'

export function AuthIllustration() {
  return (
    <Box
      sx={{
        flex: 1,
        display: { xs: 'none', lg: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#EEF4FF',
        p: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 520,
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: '0 24px 48px rgba(37, 99, 235, 0.12)',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            gap: 0.75,
          }}
        >
          {['#FF5F57', '#FFBD2E', '#28CA41'].map((color) => (
            <Box
              key={color}
              sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }}
            />
          ))}
        </Box>

        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              height: 120,
              borderRadius: 2,
              bgcolor: '#EFF6FF',
              mb: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <svg viewBox="0 0 400 120" width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
              <path
                d="M0,90 L60,70 L120,80 L180,45 L240,55 L300,25 L360,40 L400,15"
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0,90 L60,70 L120,80 L180,45 L240,55 L300,25 L360,40 L400,15 L400,120 L0,120 Z"
                fill="rgba(37,99,235,0.08)"
              />
            </svg>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            {[65, 45, 80, 55].map((height, index) => (
              <Box
                key={index}
                sx={{
                  height: 80,
                  borderRadius: 2,
                  bgcolor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'flex-end',
                  p: 1.5,
                  gap: 0.75,
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: `${height}%`,
                    borderRadius: 1,
                    bgcolor: index % 2 === 0 ? '#2563EB' : '#93C5FD',
                    opacity: 0.85,
                  }}
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {['#2563EB', '#60A5FA', '#93C5FD'].map((color, index) => (
              <Box
                key={color}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: color,
                  opacity: 1 - index * 0.2,
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
