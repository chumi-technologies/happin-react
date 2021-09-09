export function currencyFormatter(currency: string) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency || 'USD',
		minimumFractionDigits: 2
	})
}
