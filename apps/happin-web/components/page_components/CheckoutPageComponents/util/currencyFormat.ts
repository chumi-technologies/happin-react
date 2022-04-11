export function currencyFormatter(currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency === 'N/A' || !currency) ? 'USD' : currency,
    minimumFractionDigits: 2
  })
}
