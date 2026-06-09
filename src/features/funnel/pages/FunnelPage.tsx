import { Box } from "@mui/material";
import { PageHeader } from "@/shared/components/PageHeader";
import { PageLoader } from "@/shared/components/PageLoader";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { FunnelBoard } from "@/features/funnel/components/FunnelBoard";

export function FunnelPage() {
  const { data: leads = [], isLoading } = useLeads();

  if (isLoading) {
    return <PageLoader />;
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
  );
}
