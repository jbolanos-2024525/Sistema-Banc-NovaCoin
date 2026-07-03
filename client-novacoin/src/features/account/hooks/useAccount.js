import { useEffect } from 'react';
import { useAccountStore } from '../store/accountStore';
import { useAuthStore }    from '../../auth/store/authStore';
import { formatCurrency }  from '../../../shared/utils/formatters';

export const useAccount = () => {

    const { cuentas, loading, error, fetchMisCuentas } = useAccountStore();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        fetchMisCuentas();
    }, []);

    return { user, cuentas, loading, error, formatCurrency, refetch: fetchMisCuentas };
};
