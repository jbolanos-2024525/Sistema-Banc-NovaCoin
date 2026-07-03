import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockTransaccionModel = vi.fn(() => ({ save: vi.fn() }));
mockTransaccionModel.find = vi.fn();
mockTransaccionModel.findById = vi.fn();
mockTransaccionModel.findByIdAndUpdate = vi.fn();

vi.mock('../../src/Transaccion/transaccion.model.js', () => ({
    Transaccion: mockTransaccionModel,
}));

const {
    createTransaccion,
    getTransacciones,
    getTransaccionById,
    getTransaccionesByUsuario,
    getTransaccionesByCuenta,
    getTransaccionesByTipo,
    getTransaccionesByEstado,
    getTransaccionesByFecha,
    getTransaccionesByPrestamo,
    updateTransaccion,
    deleteTransaccion,
    cambiarEstadoTransaccion,
    getResumenTransacciones,
} = await import('../../src/Transaccion/transaccion.service.js');

function chainMock(data) {
    return {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(data),
    };
}

describe('Transaccion Service', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('createTransaccion', () => {
        it('should create and save a transaction', async () => {
            const saveFn = vi.fn().mockResolvedValue(undefined);
            const data = { TipoTransaccion: 'DEPOSITO', Monto: 100, Usuario: 'u1' };
            mockTransaccionModel.mockReturnValue({ ...data, save: saveFn });

            const result = await createTransaccion(data);
            expect(saveFn).toHaveBeenCalled();
            expect(result.TipoTransaccion).toBe('DEPOSITO');
        });

        it('should throw on duplicate key', async () => {
            mockTransaccionModel.mockReturnValue({ save: vi.fn().mockRejectedValue({ code: 11000 }) });
            await expect(createTransaccion({})).rejects.toThrow('Ya existe una transacción con estos datos');
        });

        it('should rethrow non-duplicate errors', async () => {
            mockTransaccionModel.mockReturnValue({ save: vi.fn().mockRejectedValue(new Error('fail')) });
            await expect(createTransaccion({})).rejects.toThrow('fail');
        });
    });

    describe('getTransacciones', () => {
        it('should return filtered transactions', async () => {
            mockTransaccionModel.find.mockReturnValue(chainMock([{ _id: '1' }]));

            const result = await getTransacciones({ Moneda: 'GTQ' });
            expect(mockTransaccionModel.find).toHaveBeenCalledWith({ Estado: true, Moneda: 'GTQ' });
            expect(result).toHaveLength(1);
        });
    });

    describe('getTransaccionById', () => {
        it('should return a transaction by id', async () => {
            mockTransaccionModel.findById.mockReturnValue({ populate: vi.fn().mockResolvedValue({ _id: 'id1' }) });

            const result = await getTransaccionById('id1');
            expect(result._id).toBe('id1');
        });

        it('should throw if id is missing', async () => {
            await expect(getTransaccionById(null)).rejects.toThrow('ID de transacción es requerido');
        });

        it('should throw if not found', async () => {
            mockTransaccionModel.findById.mockReturnValue({ populate: vi.fn().mockResolvedValue(null) });
            await expect(getTransaccionById('id1')).rejects.toThrow('Transacción no encontrada');
        });
    });

    describe('getTransaccionesByUsuario', () => {
        it('should return transactions for user', async () => {
            mockTransaccionModel.find.mockReturnValue(chainMock([]));
            await getTransaccionesByUsuario('u1');
            expect(mockTransaccionModel.find).toHaveBeenCalledWith({ Usuario: 'u1', Estado: true });
        });

        it('should throw if userId is missing', async () => {
            await expect(getTransaccionesByUsuario(null)).rejects.toThrow('ID de usuario es requerido');
        });
    });

    describe('getTransaccionesByCuenta', () => {
        it('should find by cuenta origin or destination', async () => {
            mockTransaccionModel.find.mockReturnValue(chainMock([]));
            await getTransaccionesByCuenta('c1');
            expect(mockTransaccionModel.find).toHaveBeenCalledWith({
                $or: [{ CuentaOrigen: 'c1' }, { CuentaDestino: 'c1' }],
                Estado: true,
            });
        });

        it('should throw if cuentaId is missing', async () => {
            await expect(getTransaccionesByCuenta(null)).rejects.toThrow('ID de cuenta es requerido');
        });
    });

    describe('getTransaccionesByTipo', () => {
        it('should filter by type', async () => {
            mockTransaccionModel.find.mockReturnValue(chainMock([]));
            await getTransaccionesByTipo('DEPOSITO');
            expect(mockTransaccionModel.find).toHaveBeenCalledWith({ TipoTransaccion: 'DEPOSITO', Estado: true });
        });

        it('should throw if tipo is missing', async () => {
            await expect(getTransaccionesByTipo(null)).rejects.toThrow('Tipo de transacción es requerido');
        });
    });

    describe('getTransaccionesByEstado', () => {
        it('should filter by estado', async () => {
            mockTransaccionModel.find.mockReturnValue(chainMock([]));
            await getTransaccionesByEstado('COMPLETADA');
            expect(mockTransaccionModel.find).toHaveBeenCalledWith({ EstadoTransaccion: 'COMPLETADA', Estado: true });
        });

        it('should throw if estado is missing', async () => {
            await expect(getTransaccionesByEstado(null)).rejects.toThrow('Estado es requerido');
        });
    });

    describe('getTransaccionesByFecha', () => {
        it('should filter by date range', async () => {
            mockTransaccionModel.find.mockReturnValue(chainMock([]));
            await getTransaccionesByFecha('2025-01-01', '2025-12-31');
            const callArgs = mockTransaccionModel.find.mock.calls[0][0];
            expect(callArgs.FechaTransaccion.$gte).toBeInstanceOf(Date);
            expect(callArgs.FechaTransaccion.$lte).toBeInstanceOf(Date);
        });

        it('should throw if dates are missing', async () => {
            await expect(getTransaccionesByFecha(null, '2025-12-31')).rejects.toThrow('Fechas de inicio y fin son requeridas');
            await expect(getTransaccionesByFecha('2025-01-01', null)).rejects.toThrow('Fechas de inicio y fin son requeridas');
        });
    });

    describe('getTransaccionesByPrestamo', () => {
        it('should filter by prestamo id', async () => {
            mockTransaccionModel.find.mockReturnValue(chainMock([]));
            await getTransaccionesByPrestamo('p1');
            expect(mockTransaccionModel.find).toHaveBeenCalledWith({ PrestamoId: 'p1', Estado: true });
        });

        it('should throw if prestamoId is missing', async () => {
            await expect(getTransaccionesByPrestamo(null)).rejects.toThrow('ID de préstamo es requerido');
        });
    });

    describe('updateTransaccion', () => {
        it('should update allowed fields', async () => {
            mockTransaccionModel.findByIdAndUpdate.mockResolvedValue({ _id: 'id1' });
            await updateTransaccion('id1', { Descripcion: 'updated', Referencia: 'REF-1' });
            expect(mockTransaccionModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'id1',
                { Descripcion: 'updated', Referencia: 'REF-1' },
                { new: true, runValidators: true }
            );
        });

        it('should throw if id is missing', async () => {
            await expect(updateTransaccion(null, {})).rejects.toThrow('ID de transacción es requerido');
        });

        it('should throw if no valid fields', async () => {
            await expect(updateTransaccion('id1', { Monto: 999 })).rejects.toThrow('No hay campos válidos para actualizar');
        });

        it('should throw if not found', async () => {
            mockTransaccionModel.findByIdAndUpdate.mockResolvedValue(null);
            await expect(updateTransaccion('id1', { Descripcion: 'x' })).rejects.toThrow('Transacción no encontrada');
        });
    });

    describe('deleteTransaccion', () => {
        it('should soft delete', async () => {
            mockTransaccionModel.findByIdAndUpdate.mockResolvedValue({ Estado: false });
            const result = await deleteTransaccion('id1');
            expect(mockTransaccionModel.findByIdAndUpdate).toHaveBeenCalledWith('id1', { Estado: false }, { new: true });
            expect(result.Estado).toBe(false);
        });

        it('should throw if id is missing', async () => {
            await expect(deleteTransaccion(null)).rejects.toThrow('ID de transacción es requerido');
        });

        it('should throw if not found', async () => {
            mockTransaccionModel.findByIdAndUpdate.mockResolvedValue(null);
            await expect(deleteTransaccion('id1')).rejects.toThrow('Transacción no encontrada');
        });
    });

    describe('cambiarEstadoTransaccion', () => {
        it('should change state', async () => {
            mockTransaccionModel.findByIdAndUpdate.mockResolvedValue({ EstadoTransaccion: 'PENDIENTE' });
            const result = await cambiarEstadoTransaccion('id1', 'PENDIENTE');
            expect(result.EstadoTransaccion).toBe('PENDIENTE');
        });

        it('should throw if id is missing', async () => {
            await expect(cambiarEstadoTransaccion(null, 'COMPLETADA')).rejects.toThrow('ID de transacción es requerido');
        });

        it('should throw on invalid state', async () => {
            await expect(cambiarEstadoTransaccion('id1', 'INVALID')).rejects.toThrow('Estado no válido');
        });

        it('should accept all valid states', async () => {
            for (const e of ['COMPLETADA', 'PENDIENTE', 'FALLIDA', 'CANCELADA']) {
                mockTransaccionModel.findByIdAndUpdate.mockResolvedValue({ EstadoTransaccion: e });
                const r = await cambiarEstadoTransaccion('id1', e);
                expect(r.EstadoTransaccion).toBe(e);
            }
        });

        it('should throw if not found', async () => {
            mockTransaccionModel.findByIdAndUpdate.mockResolvedValue(null);
            await expect(cambiarEstadoTransaccion('id1', 'COMPLETADA')).rejects.toThrow('Transacción no encontrada');
        });
    });

    describe('getResumenTransacciones', () => {
        it('should calculate summary correctly', async () => {
            const transactions = [
                { TipoTransaccion: 'DEPOSITO', Monto: 100 },
                { TipoTransaccion: 'DEPOSITO', Monto: 200 },
                { TipoTransaccion: 'RETIRO', Monto: 50 },
                { TipoTransaccion: 'TRANSFERENCIA', Monto: 75 },
                { TipoTransaccion: 'TRANSFERENCIA_RECIBIDA', Monto: 120 },
                { TipoTransaccion: 'PAGO_PRESTAMO', Monto: 500 },
            ];
            mockTransaccionModel.find.mockReturnValue({ lean: vi.fn().mockResolvedValue(transactions) });

            const result = await getResumenTransacciones('u1');
            expect(result.totalTransacciones).toBe(6);
            expect(result.depositos).toBe(2);
            expect(result.montoTotalDepositos).toBe(300);
            expect(result.retiros).toBe(1);
            expect(result.montoTotalRetiros).toBe(50);
            expect(result.transferenciasEnviadas).toBe(1);
            expect(result.montoTotalTransferenciasEnviadas).toBe(75);
            expect(result.transferenciasRecibidas).toBe(1);
            expect(result.montoTotalTransferenciasRecibidas).toBe(120);
            expect(result.pagosPrestamo).toBe(1);
            expect(result.montoTotalPagosPrestamo).toBe(500);
        });

        it('should throw if userId is missing', async () => {
            await expect(getResumenTransacciones(null)).rejects.toThrow('ID de usuario es requerido');
        });

        it('should return zeros for empty transactions', async () => {
            mockTransaccionModel.find.mockReturnValue({ lean: vi.fn().mockResolvedValue([]) });
            const result = await getResumenTransacciones('u1');
            expect(result.totalTransacciones).toBe(0);
            expect(result.depositos).toBe(0);
        });
    });
});
