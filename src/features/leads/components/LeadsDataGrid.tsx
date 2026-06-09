import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, Button } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { LeadStatusChip } from "@/features/leads/components/LeadStatusChip";
import { formatCurrency } from "@/utils/formatCurrency";
import type { Lead, User } from "@/types";

interface LeadsDataGridProps {
  leads: Lead[];
  users: User[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
}

export function LeadsDataGrid({
  leads,
  users,
  isLoading,
  onEdit,
}: LeadsDataGridProps) {
  const usersMap = useMemo(
    () => new Map(users.map((user) => [user.id, user.name])),
    [users],
  );

  const columns: GridColDef<Lead>[] = useMemo(
    () => [
      { field: "name", headerName: "Nome", flex: 1, minWidth: 160 },
      { field: "company", headerName: "Empresa", flex: 1, minWidth: 140 },
      { field: "email", headerName: "E-mail", flex: 1.2, minWidth: 180 },
      {
        field: "stage",
        headerName: "Estágio",
        width: 140,
        renderCell: ({ value }) => <LeadStatusChip stage={value} />,
      },
      {
        field: "value",
        headerName: "Valor",
        width: 130,
        valueFormatter: (value: number | undefined) => formatCurrency(value),
      },
      {
        field: "assignedToId",
        headerName: "Responsável",
        width: 150,
        valueGetter: (_value, row) =>
          usersMap.get(row.assignedToId ?? "") ?? "—",
      },
      {
        field: "actions",
        headerName: "Ações",
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Button
            size="small"
            startIcon={<EditOutlinedIcon />}
            onClick={() => onEdit(row)}
          >
            Editar
          </Button>
        ),
      },
    ],
    [usersMap, onEdit],
  );

  return (
    <Box sx={{ height: 520, bgcolor: "background.paper", borderRadius: 2 }}>
      <DataGrid
        rows={leads}
        columns={columns}
        loading={isLoading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
      />
    </Box>
  );
}
