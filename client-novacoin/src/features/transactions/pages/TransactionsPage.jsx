import React, { useEffect, useState } from 'react';
import { useTransactionsStore } from '../store/transactionsStore';
import { TransactionsList }     from '../components/transactions';
import { TransactionsModal }    from '../components/transactionsModal';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import { useAuthStore } from '../../auth/store/authStore';

export const TransactionsPage = () => {

    const { transactions, loading, error, fetchTransactions, executeTransaction, updateTransaction, deleteTransaction, cancelTransaction } = useTransactionsStore();
    const { user } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState(null);
    const [pendingTransactionData, setPendingTransactionData] = useState(null);
    const [transactionToEdit, setTransactionToEdit] = useState(null);

    const isAdmin = user?.role === 'ADMIN_ROLE';

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleCreateTransaction = async (transactionDto) => {
        setPendingTransactionData(transactionDto);
        setConfirmConfig({
            title: 'Confirmar Transacción',
            message: `¿Estás seguro de realizar una transacción de ${transactionDto.TipoTransaccion} por ${transactionDto.Monto}?`,
            confirmText: 'Sí, Realizar',
            confirmColor: '#00f2fe',
            onConfirm: async () => {
                if (!executeTransaction) return;
                const result = await executeTransaction(transactionDto);
                if (result.success) {
                    setIsModalOpen(false);
                    fetchTransactions();
                }
                setConfirmConfig(null);
                setPendingTransactionData(null);
            },
            onClose: () => setConfirmConfig(null)
        });
    };

    const handleUpdateTransaction = async (transactionDto) => {
        setPendingTransactionData(transactionDto);
        setConfirmConfig({
            title: 'Confirmar Actualización',
            message: `¿Estás seguro de actualizar esta transacción?`,
            confirmText: 'Sí, Actualizar',
            confirmColor: '#f59e0b',
            onConfirm: async () => {
                const id = transactionToEdit._id || transactionToEdit.id;
                const result = await updateTransaction(id, transactionDto);
                if (result.success) {
                    setIsModalOpen(false);
                    setTransactionToEdit(null);
                    fetchTransactions();
                }
                setConfirmConfig(null);
                setPendingTransactionData(null);
            },
            onClose: () => setConfirmConfig(null)
        });
    };

    const handleDeleteTransaction = (id) => {
        setConfirmConfig({
            title: 'Eliminar Transacción',
            message: 'Esta acción es permanente e irreversible. ¿Estás seguro de eliminar esta transacción?',
            confirmText: 'Sí, Eliminar',
            confirmColor: '#dc2626',
            onConfirm: async () => {
                const result = await deleteTransaction(id);
                if (result.success) {
                    fetchTransactions();
                }
                setConfirmConfig(null);
            },
            onClose: () => setConfirmConfig(null)
        });
    };

    const handleCancelTransaction = (id) => {
        setConfirmConfig({
            title: 'Cancelar Transacción',
            message: '¿Estás seguro de cancelar esta transacción? Esta acción no se puede deshacer.',
            confirmText: 'Sí, Cancelar',
            confirmColor: '#ef4444',
            onConfirm: async () => {
                const result = await cancelTransaction(id);
                if (result.success) {
                    fetchTransactions();
                }
                setConfirmConfig(null);
            },
            onClose: () => setConfirmConfig(null)
        });
    };

    const handleOpenEdit = (transaction) => {
        setTransactionToEdit(transaction);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTransactionToEdit(null);
    };

    return (
        <div style={{ padding: '24px', color: '#f3f4f6', minHeight: '100vh', backgroundColor: '#0d1117' }}>

            {/* Encabezado */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #1f2937', paddingBottom: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                        Historial de Transacciones
                    </h1>
                    <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
                        Monitorea y gestiona todos los movimientos de tus cuentas en tiempo real.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ backgroundColor: '#00f2fe', color: '#050c18', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,242,254,0.2)' }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#00c8d4'}
                    onMouseLeave={e => e.target.style.backgroundColor = '#00f2fe'}
                >
                    + Nueva Transacción
                </button>
            </div>

            {/* Error */}
            {error && (
                <div style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '16px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #991b1b' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Lista */}
            {loading && transactions.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px', color: '#00f2fe' }}>
                    <p>Cargando movimientos financieros...</p>
                </div>
            ) : (
                <TransactionsList 
                    transactions={transactions} 
                    isAdmin={isAdmin}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteTransaction}
                    onCancel={handleCancelTransaction}
                />
            )}

            {/* Modal */}
            {isModalOpen && (
                <TransactionsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={transactionToEdit ? handleUpdateTransaction : handleCreateTransaction}
                    isAdmin={isAdmin}
                    transaction={transactionToEdit}
                />
            )}

            {/* Modal confirmación */}
            {confirmConfig && (
                <ConfirmModal
                    isOpen={true}
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    confirmText={confirmConfig.confirmText}
                    confirmColor={confirmConfig.confirmColor}
                    onConfirm={confirmConfig.onConfirm}
                    onClose={confirmConfig.onClose}
                />
            )}
        </div>
    );
};