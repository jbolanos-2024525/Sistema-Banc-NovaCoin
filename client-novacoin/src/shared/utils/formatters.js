export const formatCurrency = (amount, moneda = 'GTQ') => {
    const locale   = moneda === 'USD' ? 'en-US' : 'es-GT';
    const currency = moneda === 'USD' ? 'USD'   : 'GTQ';
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount || 0);
};
