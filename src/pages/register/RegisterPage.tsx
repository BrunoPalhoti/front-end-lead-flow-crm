import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Button,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLogo } from '@/components/auth/AuthLogo'
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons'
import { RHFTextField } from '@/components/form/RHFTextField'
import { useRegister } from '@/hooks/useRegister'
import { registerSchema, type RegisterFormValues } from '@/schemas/auth.schema'

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useRegister()

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  return (
    <Stack
      component="form"
      spacing={2.5}
      onSubmit={handleSubmit(async (values) => {
        await register.mutateAsync({
          name: values.name,
          email: values.email,
          password: values.password,
        })
        navigate('/')
      })}
    >
      <AuthLogo />

      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Criar sua conta
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Preencha os dados abaixo para começar a usar o LeadFlow.
      </Typography>

      {register.isError && (
        <Alert severity="error">{register.error.message}</Alert>
      )}

      <RHFTextField name="name" control={control} label="Nome completo" placeholder="Seu nome" />
      <RHFTextField
        name="email"
        control={control}
        label="E-mail"
        placeholder="seu@email.com"
        type="email"
      />
      <RHFTextField
        name="password"
        control={control}
        label="Senha"
        placeholder="••••••••"
        type="password"
      />
      <RHFTextField
        name="confirmPassword"
        control={control}
        label="Confirmar senha"
        placeholder="••••••••"
        type="password"
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={register.isPending}
        sx={{ py: 1.4 }}
      >
        {register.isPending ? 'Criando conta...' : 'Criar conta'}
      </Button>

      <SocialLoginButtons dividerText="ou cadastre-se com" />

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        Já tem uma conta?{' '}
        <MuiLink component={Link} to="/login" underline="hover" sx={{ fontWeight: 600 }}>
          Faça login
        </MuiLink>
      </Typography>
    </Stack>
  )
}
