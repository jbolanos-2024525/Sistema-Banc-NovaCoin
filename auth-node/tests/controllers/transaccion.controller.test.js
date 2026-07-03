import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/Transaccion/transaccion.service.js', () => ({
    createTransaccion: vi.fn(),
    getTransacciones: vi.fn(),
    getTransaccionById: vi.fn(),
    getTransaccionesByUsuario: vi.fn(),
    getTransaccionesByCuenta: vi.fn(),
    getTransaccionesByTipo: vi.fn(),
    getTransaccionesByEstado: vi.fn(),
    getTransaccionesByFecha: vi.fn(),
    getTransaccionesByPrestamo: vi.fn(),
    updateTransaccion: vi.fn(),
    deleteTransaccion: vi.fn(),
    cambiarEstadoTransaccion: vi.fn(),
    getResumenTransacciones: vi.fn(),
}));

const service = await import('../../src/Transaccion/transaccion.service.js');
const ctrl = await import('../../src/Transaccion/transaccion.controller.js');

function mockReqRes(overrides = {}) {
    const req = { body: {}, params: {}, query: {}, ip: '127.0.0.1', get: vi.fn().mockReturnValue('test-agent'), ...overrides };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    return { req, res };
}

describe('Transaccion Controller', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('create', () => {
        it('should return 201 with transaction data', async () => {
            service.createTransaccion.mockResolvedValue({ _id: 't1' });
            const { req, res } = mockReqRes({ user: { uid: 'u1' }, body: { TipoTransaccion: 'DEPOSITO', Monto: 100 } });

            await ctrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(service.createTransaccion).toHaveBeenCalledWith(expect.objectContaining({
                TipoTransaccion: 'DEPOSITO',
                Usuario: 'u1',
                IP: '127.0.0.1',
            }));
        });

        it('should return 400 on error', async () => {
            service.createTransaccion.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes();

            await ctrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('getAll', () => {
        it('should return transactions', async () => {
            service.getTransacciones.mockResolvedValue([{ _id: '1' }]);
            const { req, res } = mockReqRes();

            await ctrl.getAll(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, count: 1 }));
        });

        it('should return 500 on error', async () => {
            service.getTransacciones.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes();

            await ctrl.getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getById', () => {
        it('should return transaction', async () => {
            service.getTransaccionById.mockResolvedValue({ _id: 'id1' });
            const { req, res } = mockReqRes({ params: { id: 'id1' } });

            await ctrl.getById(req, res);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { _id: 'id1' } });
        });

        it('should return 404 on error', async () => {
            service.getTransaccionById.mockRejectedValue(new Error('not found'));
            const { req, res } = mockReqRes({ params: { id: 'id1' } });

            await ctrl.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getMisTransacciones', () => {
        it('should return user transactions', async () => {
            service.getTransaccionesByUsuario.mockResolvedValue([]);
            const { req, res } = mockReqRes({ user: { uid: 'u1' } });

            await ctrl.getMisTransacciones(req, res);
            expect(service.getTransaccionesByUsuario).toHaveBeenCalledWith('u1');
        });

        it('should return 401 if user not identified', async () => {
            const { req, res } = mockReqRes();

            await ctrl.getMisTransacciones(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
        });
    });

    describe('getByCuenta', () => {
        it('should return transactions for account', async () => {
            service.getTransaccionesByCuenta.mockResolvedValue([]);
            const { req, res } = mockReqRes({ params: { cuentaId: 'c1' } });

            await ctrl.getByCuenta(req, res);
            expect(service.getTransaccionesByCuenta).toHaveBeenCalledWith('c1');
        });
    });

    describe('getByTipo', () => {
        it('should return transactions by type', async () => {
            service.getTransaccionesByTipo.mockResolvedValue([]);
            const { req, res } = mockReqRes({ params: { tipo: 'DEPOSITO' } });

            await ctrl.getByTipo(req, res);
            expect(service.getTransaccionesByTipo).toHaveBeenCalledWith('DEPOSITO');
        });
    });

    describe('getByEstado', () => {
        it('should return transactions by estado', async () => {
            service.getTransaccionesByEstado.mockResolvedValue([]);
            const { req, res } = mockReqRes({ params: { estado: 'COMPLETADA' } });

            await ctrl.getByEstado(req, res);
            expect(service.getTransaccionesByEstado).toHaveBeenCalledWith('COMPLETADA');
        });
    });

    describe('getByFecha', () => {
        it('should return transactions by date range', async () => {
            service.getTransaccionesByFecha.mockResolvedValue([]);
            const { req, res } = mockReqRes({ query: { fechaInicio: '2025-01-01', fechaFin: '2025-12-31' } });

            await ctrl.getByFecha(req, res);
            expect(service.getTransaccionesByFecha).toHaveBeenCalledWith('2025-01-01', '2025-12-31');
        });
    });

    describe('getByPrestamo', () => {
        it('should return transactions for a loan', async () => {
            service.getTransaccionesByPrestamo.mockResolvedValue([]);
            const { req, res } = mockReqRes({ params: { prestamoId: 'p1' } });

            await ctrl.getByPrestamo(req, res);
            expect(service.getTransaccionesByPrestamo).toHaveBeenCalledWith('p1');
        });
    });

    describe('getResumen', () => {
        it('should return summary for user', async () => {
            service.getResumenTransacciones.mockResolvedValue({ totalTransacciones: 5 });
            const { req, res } = mockReqRes({ user: { uid: 'u1' } });

            await ctrl.getResumen(req, res);
            expect(service.getResumenTransacciones).toHaveBeenCalledWith('u1');
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { totalTransacciones: 5 } });
        });

        it('should return 401 if user not identified', async () => {
            const { req, res } = mockReqRes();

            await ctrl.getResumen(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
        });
    });

    describe('update', () => {
        it('should return updated transaction', async () => {
            service.updateTransaccion.mockResolvedValue({ _id: 'id1' });
            const { req, res } = mockReqRes({ params: { id: 'id1' }, body: { Descripcion: 'x' } });

            await ctrl.update(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 400 on error', async () => {
            service.updateTransaccion.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'id1' } });

            await ctrl.update(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('remove', () => {
        it('should soft delete transaction', async () => {
            service.deleteTransaccion.mockResolvedValue({ _id: 'id1' });
            const { req, res } = mockReqRes({ params: { id: 'id1' } });

            await ctrl.remove(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 500 on error', async () => {
            service.deleteTransaccion.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'id1' } });

            await ctrl.remove(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('cambiarEstado', () => {
        it('should change transaction state', async () => {
            service.cambiarEstadoTransaccion.mockResolvedValue({ EstadoTransaccion: 'PENDIENTE' });
            const { req, res } = mockReqRes({ params: { id: 'id1' }, body: { estado: 'PENDIENTE' } });

            await ctrl.cambiarEstado(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 400 on error', async () => {
            service.cambiarEstadoTransaccion.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'id1' }, body: { estado: 'INVALID' } });

            await ctrl.cambiarEstado(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
