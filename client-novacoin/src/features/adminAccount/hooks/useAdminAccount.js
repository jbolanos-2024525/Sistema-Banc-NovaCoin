import { useEffect, useState } from 'react';
import { useAdminAccountStore } from '../store/adminAccountStore';
import { formatCurrency } from '../../../shared/utils/formatters';

export const useAdminAccount = () => {

    const store = useAdminAccountStore();
    const [showModal, setShowModal]           = useState(false);
    const [filterUsuarioId, setFilterUsuarioId] = useState('');

    useEffect(() => {
        store.fetchCuentas();
    }, []);

    const openCreate = () => { store.setSelected(null); setShowModal(true); };
    const openEdit   = (cuenta) => { store.setSelected(cuenta); setShowModal(true); };
    const closeModal = () => { store.setSelected(null); setShowModal(false); };

    const handleFilterByUsuario = () => {
        if (filterUsuarioId.trim()) {
            store.fetchCuentasByUsuario(filterUsuarioId.trim());
        } else {
            store.fetchCuentas();
        }
    };

    const handleClearFilter = () => {
        setFilterUsuarioId('');
        store.fetchCuentas();
    };

    return {
        ...store,
        showModal,
        openCreate, openEdit, closeModal,
        filterUsuarioId, setFilterUsuarioId,
        handleFilterByUsuario, handleClearFilter,
        formatCurrency
    };
};
