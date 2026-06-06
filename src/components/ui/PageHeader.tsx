import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  sx?: object
}

export function PageHeader({ title, subtitle, actions, sx }: PageHeaderProps) {
  const content = (
    <Box>
      <Typography variant="h5">{title}</Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  )

  if (actions) {
    return (
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          ...sx,
        }}
      >
        {content}
        {actions}
      </Stack>
    )
  }

  return <Box sx={sx}>{content}</Box>
}
