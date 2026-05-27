import { useEffect } from 'react';
import { useAccountStore } from '../store/accountStore';
import { useAuthStore }    from '../../auth/store/authStore';

export const useAccount = () => {

    const { cuentas, loading, error, fetchMisCuentas } = useAccountStore();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        fetchMisCuentas();
    }, []);

    const formatCurrency = (amount, moneda = 'GTQ') => {
        const locale   = moneda === 'USD' ? 'en-US' : 'es-GT';
        const currency = moneda === 'USD' ? 'USD'   : 'GTQ';
        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount || 0);
    };

    return { user, cuentas, loading, error, formatCurrency, refetch: fetchMisCuentas };
};