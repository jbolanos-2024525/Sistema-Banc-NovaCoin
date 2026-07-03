import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/Prestamo/prestamo.service.js', () => ({
    createPrestamo: vi.fn(),
    getPrestamos: vi.fn(),
    getPrestamoById: vi.fn(),
    getPrestamosByCliente: vi.fn(),
    getPrestamosByEstado: vi.fn(),
    getPrestamosByEmpleado: vi.fn(),
    updatePrestamo: vi.fn(),
    pagarCuota: vi.fn(),
    cancelarPrestamo: vi.fn(),
    deletePrestamo: vi.fn(),
    cambiarEstadoPrestamo: vi.fn(),
}));

const service = await import('../../src/Prestamo/prestamo.service.js');
const ctrl = await import('../../src/Prestamo/prestamo.controller.js');

function mockReqRes(overrides = {}) {
    const req = { body: {}, params: {}, query: {}, ...overrides };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    return { req, res };
}

describe('Prestamo Controller', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('create', () => {
        it('should return 201 on success', async () => {
            service.createPrestamo.mockResolvedValue({ _id: 'p1' });
            const { req, res } = mockReqRes({
                user: { uid: 'u1' },
                body: { monto: 10000, plazoMeses: 12, tipoPrestamo: 'PERSONAL' },
            });

            await ctrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(service.createPrestamo).toHaveBeenCalledWith(expect.objectContaining({ cliente: 'u1' }));
        });

        it('should return 400 on error', async () => {
            service.createPrestamo.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes();

            await ctrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should use empleado id when available', async () => {
            service.createPrestamo.mockResolvedValue({ _id: 'p1' });
            const { req, res } = mockReqRes({
                user: { uid: 'u1' },
                empleado: { _id: { toString: () => 'emp1' } },
                body: { monto: 100, plazoMeses: 6 },
            });

            await ctrl.create(req, res);
            expect(service.createPrestamo).toHaveBeenCalledWith(expect.objectContaining({ empleado: 'emp1' }));
        });
    });

    describe('getAll', () => {
        it('should return loans', async () => {
            service.getPrestamos.mockResolvedValue([{ _id: '1' }]);
            const { req, res } = mockReqRes();

            await ctrl.getAll(req, res);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ _id: '1' }], count: 1 });
        });

        it('should return 500 on error', async () => {
            service.getPrestamos.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes();

            await ctrl.getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getById', () => {
        it('should return loan', async () => {
            service.getPrestamoById.mockResolvedValue({ _id: 'p1' });
            const { req, res } = mockReqRes({ params: { id: 'p1' } });

            await ctrl.getById(req, res);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { _id: 'p1' } });
        });

        it('should return 404 on error', async () => {
            service.getPrestamoById.mockRejectedValue(new Error('not found'));
            const { req, res } = mockReqRes({ params: { id: 'p1' } });

            await ctrl.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getByCliente', () => {
        it('should return loans for client', async () => {
            service.getPrestamosByCliente.mockResolvedValue([]);
            const { req, res } = mockReqRes({ params: { clienteId: 'c1' } });

            await ctrl.getByCliente(req, res);
            expect(service.getPrestamosByCliente).toHaveBeenCalledWith('c1');
        });
    });

    describe('getByEstado', () => {
        it('should return loans by state', async () => {
            service.getPrestamosByEstado.mockResolvedValue([]);
            const { req, res } = mockReqRes({ params: { estado: 'ACTIVO' } });

            await ctrl.getByEstado(req, res);
            expect(service.getPrestamosByEstado).toHaveBeenCalledWith('ACTIVO');
        });
    });

    describe('getByEmpleado', () => {
        it('should return loans by employee', async () => {
            service.getPrestamosByEmpleado.mockResolvedValue([]);
            const { req, res } = mockReqRes({ params: { empleadoId: 'e1' } });

            await ctrl.getByEmpleado(req, res);
            expect(service.getPrestamosByEmpleado).toHaveBeenCalledWith('e1');
        });
    });

    describe('update', () => {
        it('should update loan', async () => {
            service.updatePrestamo.mockResolvedValue({ _id: 'p1' });
            const { req, res } = mockReqRes({ params: { id: 'p1' }, body: { proposito: 'casa' } });

            await ctrl.update(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 400 on error', async () => {
            service.updatePrestamo.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'p1' } });

            await ctrl.update(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('pagar', () => {
        it('should pay a cuota', async () => {
            service.pagarCuota.mockResolvedValue({ _id: 'p1' });
            const { req, res } = mockReqRes({ params: { id: 'p1' }, body: { monto: 500 } });

            await ctrl.pagar(req, res);
            expect(service.pagarCuota).toHaveBeenCalledWith('p1', 500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 400 on error', async () => {
            service.pagarCuota.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'p1' }, body: { monto: 500 } });

            await ctrl.pagar(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('cancelar', () => {
        it('should cancel a loan', async () => {
            service.cancelarPrestamo.mockResolvedValue({ estadoPrestamo: 'CANCELADO' });
            const { req, res } = mockReqRes({ params: { id: 'p1' } });

            await ctrl.cancelar(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 400 on error', async () => {
            service.cancelarPrestamo.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'p1' } });

            await ctrl.cancelar(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('remove', () => {
        it('should soft delete', async () => {
            service.deletePrestamo.mockResolvedValue({ _id: 'p1' });
            const { req, res } = mockReqRes({ params: { id: 'p1' } });

            await ctrl.remove(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 404 on error', async () => {
            service.deletePrestamo.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'p1' } });

            await ctrl.remove(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('cambiarEstado', () => {
        it('should change state', async () => {
            service.cambiarEstadoPrestamo.mockResolvedValue({ estadoPrestamo: 'VENCIDO' });
            const { req, res } = mockReqRes({ params: { id: 'p1' }, body: { estado: 'VENCIDO' } });

            await ctrl.cambiarEstado(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 400 on error', async () => {
            service.cambiarEstadoPrestamo.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'p1' }, body: {} });

            await ctrl.cambiarEstado(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
