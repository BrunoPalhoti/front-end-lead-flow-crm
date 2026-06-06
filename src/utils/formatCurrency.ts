interface FormatCurrencyOptions {
  maximumFractionDigits?: number
  fallback?: string | null
}

export function formatCurrency(
  value?: number | null,
  options: FormatCurrencyOptions = {},
): string | null {
  const { maximumFractionDigits, fallback = '—' } = options

  if (value == null) return fallback

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    ...(maximumFractionDigits !== undefined && { maximumFractionDigits }),
  })
}
