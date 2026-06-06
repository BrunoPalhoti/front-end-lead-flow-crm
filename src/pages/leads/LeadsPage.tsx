import AddIcon from '@mui/icons-material/Add'
import { Box, Button } from '@mui/material'
import { useCallback, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { useCreateLead } from '@/hooks/useCreateLead'
import { useLeads } from '@/hooks/useLeads'
import { useUpdateLead } from '@/hooks/useUpdateLead'
import { useUsers } from '@/hooks/useUsers'
import { LeadFormDialog } from '@/pages/leads/components/LeadFormDialog'
import { LeadsDataGrid } from '@/pages/leads/components/LeadsDataGrid'
import type { LeadFormValues } from '@/schemas/lead.schema'
import type { Lead } from '@/types'

export function LeadsPage() {
  const { data: leads = [], isLoading } = useLeads()
  const { data: users = [] } = useUsers()
  const createLead = useCreateLead()
  const updateLead = useUpdateLead()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const handleEdit = useCallback((lead: Lead) => {
    setSelectedLead(lead)
    setDialogOpen(true)
  }, [])

  const handleOpenCreate = useCallback(() => {
    setSelectedLead(null)
    setDialogOpen(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false)
    setSelectedLead(null)
  }, [])

  async function handleSubmit(values: LeadFormValues) {
    const payload = {
      ...values,
      phone: values.phone || undefined,
      company: values.company || undefined,
      assignedToId: values.assignedToId || undefined,
      notes: values.notes || undefined,
    }

    if (selectedLead) {
      await updateLead.mutateAsync({ id: selectedLead.id, ...payload })
    } else {
      await createLead.mutateAsync(payload)
    }

    setSelectedLead(null)
  }

  return (
    <Box>
      <PageHeader
        title="Leads"
        subtitle="Gerencie todos os leads do funil comercial"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Novo lead
          </Button>
        }
        sx={{ mb: 2 }}
      />

      <LeadsDataGrid
        leads={leads}
        users={users}
        isLoading={isLoading}
        onEdit={handleEdit}
      />

      <LeadFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        initialData={selectedLead}
        isSubmitting={createLead.isPending || updateLead.isPending}
      />
    </Box>
  )
}
