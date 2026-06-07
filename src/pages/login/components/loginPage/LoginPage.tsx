import {
  Alert,
  Box,
  Button,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { AuthLogo } from '@/components/auth/AuthLogo'
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons'
import { RHFTextField } from '@/components/form/RHFTextField'
import { useLogin } from '@/pages/login/hooks/useLogin'
import { useLoginForm } from '@/pages/login/hooks/useLoginForm'

export function LoginPage() {
  const login = useLogin()
  const { control, handleSubmit } = useLoginForm()

  return (
    <Box component="form" onSubmit={handleSubmit((values) => login.mutate(values))}>
      <AuthLogo />

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Bem-vindo de volta! 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Faça login para continuar gerenciando seus leads e oportunidades.
      </Typography>

      {login.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {login.error.message}
        </Alert>
      )}

      <Stack spacing={2.5}>
        <RHFTextField
          name="email"
          control={control}
          label="E-mail"
          placeholder="seu@email.com"
          type="email"
        />

        <Box>
          <RHFTextField
            name="password"
            control={control}
            label="Senha"
            placeholder="••••••••"
            type="password"
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <MuiLink
              component="button"
              type="button"
              variant="body2"
              underline="hover"
              sx={{ cursor: 'pointer' }}
            >
              Esqueceu sua senha?
            </MuiLink>
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={login.isPending}
          sx={{ py: 1.4, mt: 1 }}
        >
          {login.isPending ? 'Entrando...' : 'Entrar'}
        </Button>
      </Stack>

      <SocialLoginButtons dividerText="ou continue com" />

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
        Não tem uma conta?{' '}
        <MuiLink component={Link} to="/cadastro" underline="hover" sx={{ fontWeight: 600 }}>
          Cadastre-se
        </MuiLink>
      </Typography>
    </Box>
  )
}
