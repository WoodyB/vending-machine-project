export function formatCurrency(amount: number): string {
    const amountString = amount.toString().padStart(2, '0');
    let dollars = amountString.slice(0, -2);
    if (dollars === '') {
        dollars = '0';
    }
    const cents = amountString.slice(-2);
    return dollars + "." + cents;
}
