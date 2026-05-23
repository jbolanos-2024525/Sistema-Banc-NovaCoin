import React, { useEffect, useState } from 'react';
// Usamos tu importación original exacta para que Vite no proteste por las rutas
import { useTransactionsStore } from '../store/transactionsStore';
import { TransactionsList } from '../components/transactions';
import { TransactionsModal } from '../components/transactionsModal';

export const TransactionsPage = () => {
  // Extraemos las variables y la función de envío real 'executeTransaction'
  const { transactions, loading, error, fetchTransactions, executeTransaction } = useTransactionsStore();
  
  // Estado local para abrir/cerrar el modal de nueva transferencia
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar las transacciones automáticamente al entrar
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Manejador del envío del formulario del modal
  const handleCreateTransaction = async (transactionDto) => {
    if (!executeTransaction) {
      console.error("La acción executeTransaction no está mapeada en el store.");
      return;
    }

    // Despachamos los datos a Zustand -> Axios -> Backend en C#
    const result = await executeTransaction(transactionDto);

    if (result.success) {
      setIsModalOpen(false); // Cierra el modal si todo sale bien
      fetchTransactions();   // Refresca la tabla automáticamente
    }
  };

  return (
    <div style={{ padding: '24px', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Encabezado Principal */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        borderBottom: '1px solid #1f2937',
        paddingBottom: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
            Historial de Transacciones
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
            Monitorea y gestiona todos los movimientos de tus cuentas en tiempo real.
          </p>
        </div>

        {/* Botón Nueva Transacción */}
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#059669', 
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
        >
          + Nueva Transacción
        </button>
      </div>

      {/* Mensajes de error globales del backend */}
      {error && (
        <div style={{ 
          backgroundColor: '#7f1d1d', 
          color: '#fca5a5', 
          padding: '16px', 
          borderRadius: '6px', 
          marginBottom: '20px',
          border: '1px solid #991b1b'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && transactions.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px', color: '#10b981' }}>
          <p>Cargando movimientos financieros...</p>
        </div>
      ) : (
        <TransactionsList transactions={transactions} />
      )}

      {/* Modal Conectado */}
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