export function currencyFormatter(currency: string) {
  if (currency === 'N/A') {
    return ''
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    })
  }
}
