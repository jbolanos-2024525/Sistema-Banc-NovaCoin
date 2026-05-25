import React, { useEffect, useState } from 'react';
import { useLoanStore } from '../store/loanStore.jsx';
import { LoanList } from '../components/Loan.jsx';
import { LoanModal } from '../components/LoanModal.jsx';

export const LoanPage = () => {
    const { loans, loading, error, fetchLoans, requestLoan } = useLoanStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const handleRequestLoan = async (loanDto) => {
        const result = await requestLoan(loanDto);
        if (result.success) {
            setIsModalOpen(false);
            fetchLoans();
        }
    };

    return (
        <div style={{ padding: '24px', color: '#f3f4f6', minHeight: '100vh', backgroundColor: '#0d1117' }}>
            {/* Encabezado */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '32px', borderBottom: '1px solid #1f2937', paddingBottom: '16px'
            }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                        Mis Préstamos
                    </h1>
                    <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
                        Gestiona y solicita préstamos desde tu cuenta NovaCoin.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        backgroundColor: '#00f2fe', color: '#050c18',
                        padding: '10px 20px', borderRadius: '6px',
                        border: 'none', fontWeight: '600', cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0,242,254,0.2)'
                    }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#00c8d4'}
                    onMouseLeave={e => e.target.style.backgroundColor = '#00f2fe'}
                >
                    + Solicitar Préstamo
                </button>
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    backgroundColor: '#7f1d1d', color: '#fca5a5',
                    padding: '16px', borderRadius: '6px', marginBottom: '20px',
                    border: '1px solid #991b1b'
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Lista */}
            {loading && loans.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px', color: '#00f2fe' }}>
                    <p>Cargando préstamos...</p>
                </div>
            ) : (
                <LoanList loans={loans} />
            )}

            {/* Modal */}
            {isModalOpen && (
                <LoanModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleRequestLoan}
                />
            )}
        </div>
    );
};