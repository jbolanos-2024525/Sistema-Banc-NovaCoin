import React, { useEffect, useState } from 'react';
import { useTransactionsStore } from '../store/transactionsStore';
import { TransactionsList }     from '../components/transactions';
import { TransactionsModal }    from '../components/transactionsModal';

export const TransactionsPage = () => {

    const { transactions, loading, error, fetchTransactions, executeTransaction } = useTransactionsStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleCreateTransaction = async (transactionDto) => {
        if (!executeTransaction) return;
        const result = await executeTransaction(transactionDto);
        if (result.success) {
            setIsModalOpen(false);
            fetchTransactions();
        }
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
                <TransactionsList transactions={transactions} />
            )}

            {/* Modal */}
            {isModalOpen && (
                <TransactionsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleCreateTransaction}
                />
            )}
        </div>
    );
};