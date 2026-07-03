import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrestamoModel = vi.fn(() => ({ save: vi.fn() }));
mockPrestamoModel.find = vi.fn();
mockPrestamoModel.findById = vi.fn();
mockPrestamoModel.findByIdAndUpdate = vi.fn();
mockPrestamoModel.findByIdAndDelete = vi.fn();

vi.mock('../../src/Prestamo/prestamo.model.js', () => ({
    default: mockPrestamoModel,
}));

const {
    createPrestamo,
    getPrestamos,
    getPrestamoById,
    getPrestamosByCliente,
    getPrestamosByEstado,
    getPrestamosByEmpleado,
    updatePrestamo,
    pagarCuota,
    cancelarPrestamo,
    deletePrestamo,
    cambiarEstadoPrestamo,
} = await import('../../src/Prestamo/prestamo.service.js');

function chainMock(data) {
    return {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(data),
    };
}

describe('Prestamo Service', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('createPrestamo', () => {
        it('should create a loan with calculated cuota', async () => {
            const saveFn = vi.fn().mockResolvedValue(undefined);
            mockPrestamoModel.mockReturnValue({
                monto: 10000,
                plazoMeses: 12,
                tasaInteres: 12,
                cuotaMensual: expect.any(Number),
                montoPendiente: 10000,
                estadoPrestamo: 'ACTIVO',
                save: saveFn,
            });

            const result = await createPrestamo({ monto: 10000, plazoMeses: 12, cliente: 'c1' });
            expect(saveFn).toHaveBeenCalled();
        });

        it('should throw if monto or plazoMeses is missing', async () => {
            await expect(createPrestamo({ plazoMeses: 12, cliente: 'c1' })).rejects.toThrow('Datos obligatorios incompletos');
            await expect(createPrestamo({ monto: 10000, cliente: 'c1' })).rejects.toThrow('Datos obligatorios incompletos');
        });

        it('should throw if cliente is missing', async () => {
            await expect(createPrestamo({ monto: 10000, plazoMeses: 12 })).rejects.toThrow('El ID del cliente es obligatorio');
        });

        it('should throw on duplicate key', async () => {
            mockPrestamoModel.mockReturnValue({ save: vi.fn().mockRejectedValue({ code: 11000 }) });
            await expect(createPrestamo({ monto: 100, plazoMeses: 12, cliente: 'c1' }))
                .rejects.toThrow('Ya existe un préstamo con estos datos');
        });

        it('should default tasaInteres to 12 if not provided', async () => {
            const saveFn = vi.fn().mockResolvedValue(undefined);
            let constructedWith;
            mockPrestamoModel.mockImplementation((data) => {
                constructedWith = data;
                return { ...data, save: saveFn };
            });

            await createPrestamo({ monto: 10000, plazoMeses: 12, cliente: 'c1' });
            expect(constructedWith.tasaInteres).toBe(12);
        });
    });

    describe('getPrestamos', () => {
        it('should return loans with filters', async () => {
            mockPrestamoModel.find.mockReturnValue(chainMock([{ _id: '1' }]));
            const result = await getPrestamos({ estadoPrestamo: 'ACTIVO' });
            expect(mockPrestamoModel.find).toHaveBeenCalledWith({ Estado: true, estadoPrestamo: 'ACTIVO' });
            expect(result).toHaveLength(1);
        });
    });

    describe('getPrestamoById', () => {
        it('should return loan by id', async () => {
            mockPrestamoModel.findById.mockReturnValue({ populate: vi.fn().mockResolvedValue({ _id: 'p1' }) });
            const result = await getPrestamoById('p1');
            expect(result._id).toBe('p1');
        });

        it('should throw if id is missing', async () => {
            await expect(getPrestamoById(null)).rejects.toThrow('ID de préstamo es requerido');
        });

        it('should throw if not found', async () => {
            mockPrestamoModel.findById.mockReturnValue({ populate: vi.fn().mockResolvedValue(null) });
            await expect(getPrestamoById('p1')).rejects.toThrow('Préstamo no encontrado');
        });
    });

    describe('getPrestamosByCliente', () => {
        it('should return loans for client', async () => {
            mockPrestamoModel.find.mockReturnValue(chainMock([]));
            await getPrestamosByCliente('c1');
            expect(mockPrestamoModel.find).toHaveBeenCalledWith({ cliente: 'c1', Estado: true });
        });

        it('should throw if clienteId is missing', async () => {
            await expect(getPrestamosByCliente(null)).rejects.toThrow('ID de cliente es requerido');
        });
    });

    describe('getPrestamosByEstado', () => {
        it('should return loans by state', async () => {
            mockPrestamoModel.find.mockReturnValue(chainMock([]));
            await getPrestamosByEstado('ACTIVO');
            expect(mockPrestamoModel.find).toHaveBeenCalledWith({ estadoPrestamo: 'ACTIVO', Estado: true });
        });

        it('should throw if estado is missing', async () => {
            await expect(getPrestamosByEstado(null)).rejects.toThrow('Estado es requerido');
        });
    });

    describe('getPrestamosByEmpleado', () => {
        it('should return loans by employee', async () => {
            mockPrestamoModel.find.mockReturnValue(chainMock([]));
            await getPrestamosByEmpleado('e1');
            expect(mockPrestamoModel.find).toHaveBeenCalledWith({ empleado: 'e1', Estado: true });
        });

        it('should throw if empleadoId is missing', async () => {
            await expect(getPrestamosByEmpleado(null)).rejects.toThrow('ID de empleado es requerido');
        });
    });

    describe('updatePrestamo', () => {
        it('should update allowed fields', async () => {
            mockPrestamoModel.findById.mockResolvedValue({ estadoPrestamo: 'ACTIVO' });
            mockPrestamoModel.findByIdAndUpdate.mockResolvedValue({ _id: 'p1' });

            await updatePrestamo('p1', { proposito: 'casa' });
            expect(mockPrestamoModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'p1', { proposito: 'casa' }, { new: true, runValidators: true }
            );
        });

        it('should throw if id is missing', async () => {
            await expect(updatePrestamo(null, {})).rejects.toThrow('ID de préstamo es requerido');
        });

        it('should throw if loan not found', async () => {
            mockPrestamoModel.findById.mockResolvedValue(null);
            await expect(updatePrestamo('p1', { proposito: 'x' })).rejects.toThrow('Préstamo no encontrado');
        });

        it('should throw if loan is CANCELADO', async () => {
            mockPrestamoModel.findById.mockResolvedValue({ estadoPrestamo: 'CANCELADO' });
            await expect(updatePrestamo('p1', { proposito: 'x' }))
                .rejects.toThrow('No se puede editar un préstamo cancelado o pagado');
        });

        it('should throw if loan is PAGADO', async () => {
            mockPrestamoModel.findById.mockResolvedValue({ estadoPrestamo: 'PAGADO' });
            await expect(updatePrestamo('p1', { proposito: 'x' }))
                .rejects.toThrow('No se puede editar un préstamo cancelado o pagado');
        });

        it('should throw if no valid fields', async () => {
            mockPrestamoModel.findById.mockResolvedValue({ estadoPrestamo: 'ACTIVO' });
            await expect(updatePrestamo('p1', { monto: 999 })).rejects.toThrow('No hay campos válidos para actualizar');
        });
    });

    describe('pagarCuota', () => {
        it('should reduce pending amount and increment payments', async () => {
            const prestamo = {
                estadoPrestamo: 'ACTIVO',
                montoPendiente: 1000,
                totalPagado: 0,
                numeroCuotasPagadas: 0,
                save: vi.fn(),
            };
            mockPrestamoModel.findById.mockResolvedValue(prestamo);

            const result = await pagarCuota('p1', 200);
            expect(result.montoPendiente).toBe(800);
            expect(result.totalPagado).toBe(200);
            expect(result.numeroCuotasPagadas).toBe(1);
        });

        it('should set PAGADO when fully paid', async () => {
            const prestamo = {
                estadoPrestamo: 'ACTIVO',
                montoPendiente: 100,
                totalPagado: 900,
                numeroCuotasPagadas: 9,
                save: vi.fn(),
            };
            mockPrestamoModel.findById.mockResolvedValue(prestamo);

            const result = await pagarCuota('p1', 100);
            expect(result.montoPendiente).toBe(0);
            expect(result.estadoPrestamo).toBe('PAGADO');
        });

        it('should throw if id is missing', async () => {
            await expect(pagarCuota(null, 100)).rejects.toThrow('ID de préstamo es requerido');
        });

        it('should throw if monto is invalid', async () => {
            await expect(pagarCuota('p1', 0)).rejects.toThrow('Monto de pago inválido');
            await expect(pagarCuota('p1', -10)).rejects.toThrow('Monto de pago inválido');
        });

        it('should throw if loan is not active', async () => {
            mockPrestamoModel.findById.mockResolvedValue({ estadoPrestamo: 'CANCELADO' });
            await expect(pagarCuota('p1', 100)).rejects.toThrow('Solo se pueden pagar cuotas de préstamos activos');
        });

        it('should throw if payment exceeds pending', async () => {
            mockPrestamoModel.findById.mockResolvedValue({
                estadoPrestamo: 'ACTIVO',
                montoPendiente: 50,
            });
            await expect(pagarCuota('p1', 100)).rejects.toThrow('El monto del pago excede el saldo pendiente');
        });
    });

    describe('cancelarPrestamo', () => {
        it('should cancel an active loan', async () => {
            const prestamo = { estadoPrestamo: 'ACTIVO', save: vi.fn() };
            mockPrestamoModel.findById.mockResolvedValue(prestamo);

            const result = await cancelarPrestamo('p1');
            expect(result.estadoPrestamo).toBe('CANCELADO');
            expect(prestamo.save).toHaveBeenCalled();
        });

        it('should throw if id is missing', async () => {
            await expect(cancelarPrestamo(null)).rejects.toThrow('ID de préstamo es requerido');
        });

        it('should throw if already cancelled', async () => {
            mockPrestamoModel.findById.mockResolvedValue({ estadoPrestamo: 'CANCELADO' });
            await expect(cancelarPrestamo('p1')).rejects.toThrow('El préstamo ya está cancelado');
        });

        it('should throw if already paid', async () => {
            mockPrestamoModel.findById.mockResolvedValue({ estadoPrestamo: 'PAGADO' });
            await expect(cancelarPrestamo('p1')).rejects.toThrow('No se puede cancelar un préstamo ya pagado');
        });

        it('should throw if not found', async () => {
            mockPrestamoModel.findById.mockResolvedValue(null);
            await expect(cancelarPrestamo('p1')).rejects.toThrow('Préstamo no encontrado');
        });
    });

    describe('deletePrestamo', () => {
        it('should soft delete', async () => {
            mockPrestamoModel.findByIdAndUpdate.mockResolvedValue({ Estado: false });
            const result = await deletePrestamo('p1');
            expect(result.Estado).toBe(false);
        });

        it('should throw if id is missing', async () => {
            await expect(deletePrestamo(null)).rejects.toThrow('ID de préstamo es requerido');
        });

        it('should throw if not found', async () => {
            mockPrestamoModel.findByIdAndUpdate.mockResolvedValue(null);
            await expect(deletePrestamo('p1')).rejects.toThrow('Préstamo no encontrado');
        });
    });

    describe('cambiarEstadoPrestamo', () => {
        it('should change state', async () => {
            mockPrestamoModel.findByIdAndUpdate.mockResolvedValue({ estadoPrestamo: 'VENCIDO' });
            const result = await cambiarEstadoPrestamo('p1', 'VENCIDO');
            expect(result.estadoPrestamo).toBe('VENCIDO');
        });

        it('should throw if id is missing', async () => {
            await expect(cambiarEstadoPrestamo(null, 'ACTIVO')).rejects.toThrow('ID de préstamo es requerido');
        });

        it('should throw on invalid state', async () => {
            await expect(cambiarEstadoPrestamo('p1', 'INVALID')).rejects.toThrow('Estado no válido');
        });

        it('should accept all valid states', async () => {
            for (const e of ['ACTIVO', 'PAGADO', 'VENCIDO', 'CANCELADO', 'RECHAZADO']) {
                mockPrestamoModel.findByIdAndUpdate.mockResolvedValue({ estadoPrestamo: e });
                const r = await cambiarEstadoPrestamo('p1', e);
                expect(r.estadoPrestamo).toBe(e);
            }
        });

        it('should throw if not found', async () => {
            mockPrestamoModel.findByIdAndUpdate.mockResolvedValue(null);
            await expect(cambiarEstadoPrestamo('p1', 'ACTIVO')).rejects.toThrow('Préstamo no encontrado');
        });
    });
});
