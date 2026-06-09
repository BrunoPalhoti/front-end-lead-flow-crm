import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { RHFTextField } from "@/shared/components/RHFTextField";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";

export function RegisterPage() {
  const register = useRegister();
  const { control, handleSubmit } = useRegisterForm();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((values) => register.mutate(values))}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Crie sua conta
      </Typography>

      {register.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {register.error.message}
        </Alert>
      )}

      <Stack spacing={2.5}>
        <RHFTextField name="name" control={control} label="Nome" />
        <RHFTextField
          name="email"
          control={control}
          label="E-mail"
          type="email"
        />
        <RHFTextField
          name="password"
          control={control}
          label="Senha"
          type="password"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{ py: 1.4 }}
        >
          Criar conta
        </Button>
      </Stack>
    </Box>
  );
}
