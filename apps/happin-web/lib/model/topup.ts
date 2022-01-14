export type TopupInput = {
    packageId: string,
    // Optional and only valid for usd -> diamond topups
    // Indicate that this transaction will use the stored payment method of index x
    // paymentMethodIndex: number,
    receiptEmail: string,
};
