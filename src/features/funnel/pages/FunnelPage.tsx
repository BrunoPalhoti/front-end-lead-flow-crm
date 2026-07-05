import { Box } from "@mui/material";
import { PageHeader } from "@/shared/components/PageHeader";
import { AsyncPage } from "@/shared/components/AsyncPage";
import { FunnelBoard } from "@/features/funnel/components/FunnelBoard";
import { useLeads } from "@/features/leads/hooks/useLeads";

export function FunnelPage() {
  const { data: leads = [], isLoading } = useLeads();

  return (
    <AsyncPage isLoading={isLoading}>
      <Box>
        <PageHeader
          title="Funil comercial"
          subtitle="Arraste os cards entre colunas para atualizar o estágio do lead"
          sx={{ mb: 3 }}
        />

        <FunnelBoard leads={leads} />
      </Box>
    </AsyncPage>
  );
}
