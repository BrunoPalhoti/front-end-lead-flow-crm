import { Box } from '@mui/material'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageLoader } from '@/components/ui/PageLoader'
import { useLeads } from '@/hooks/useLeads'
import { FunnelBoard } from '@/pages/funnel/components/FunnelBoard'

export function FunnelPage() {
  const { data: leads = [], isLoading } = useLeads()

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <Box>
      <PageHeader
        title="Funil comercial"
        subtitle="Arraste os cards entre colunas para atualizar o estágio do lead"
        sx={{ mb: 3 }}
      />

      <FunnelBoard leads={leads} />
    </Box>
  )
}
