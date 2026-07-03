import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/Cuenta/cuenta.service.js', () => ({
    createCuenta: vi.fn(),
    getCuentas: vi.fn(),
    getCuentaById: vi.fn(),
    getCuentaByNumero: vi.fn(),
    getCuentasByUsuario: vi.fn(),
    updateCuenta: vi.fn(),
    deleteCuenta: vi.fn(),
    depositar: vi.fn(),
    retirar: vi.fn(),
    transferir: vi.fn(),
    cambiarEstadoCuenta: vi.fn(),
}));

const service = await import('../../src/Cuenta/cuenta.service.js');
const {
    create, getAll, getById, getByNumero, getByUsuario,
    getMisCuentas, update, remove, deposit, withdraw, transfer, cambiarEstado,
} = await import('../../src/Cuenta/cuenta.controller.js');

function mockReqRes(overrides = {}) {
    const req = { body: {}, params: {}, query: {}, ...overrides };
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    };
    return { req, res };
}

describe('Cuenta Controller', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('create', () => {
        it('should return 201 on success', async () => {
            const cuenta = { _id: 'id1', TipoCuenta: 'AHORRO' };
            service.createCuenta.mockResolvedValue(cuenta);
            const { req, res } = mockReqRes({ body: { TipoCuenta: 'AHORRO' } });

            await create(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Cuenta creada correctamente', data: cuenta });
        });

        it('should return 400 on error', async () => {
            service.createCuenta.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes();

            await create(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'fail' });
        });
    });

    describe('getAll', () => {
        it('should return 200 with accounts', async () => {
            const cuentas = [{ _id: '1' }, { _id: '2' }];
            service.getCuentas.mockResolvedValue(cuentas);
            const { req, res } = mockReqRes({ query: { Moneda: 'GTQ' } });

            await getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: cuentas, count: 2 });
        });

        it('should return 500 on error', async () => {
            service.getCuentas.mockRejectedValue(new Error('db error'));
            const { req, res } = mockReqRes();

            await getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getById', () => {
        it('should return 200 with account', async () => {
            service.getCuentaById.mockResolvedValue({ _id: 'id1' });
            const { req, res } = mockReqRes({ params: { id: 'id1' } });

            await getById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 on error', async () => {
            service.getCuentaById.mockRejectedValue(new Error('not found'));
            const { req, res } = mockReqRes({ params: { id: 'id1' } });

            await getById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getByNumero', () => {
        it('should return 200 with account', async () => {
            service.getCuentaByNumero.mockResolvedValue({ NumeroCuenta: 'NC-001' });
            const { req, res } = mockReqRes({ params: { numeroCuenta: 'NC-001' } });

            await getByNumero(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 on error', async () => {
            service.getCuentaByNumero.mockRejectedValue(new Error('not found'));
            const { req, res } = mockReqRes({ params: { numeroCuenta: 'NC-999' } });

            await getByNumero(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getByUsuario', () => {
        it('should return 200 with accounts', async () => {
            service.getCuentasByUsuario.mockResolvedValue([]);
            const { req, res } = mockReqRes({ params: { usuarioId: 'u1' } });

            await getByUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: [], count: 0 });
        });

        it('should return 500 on error', async () => {
            service.getCuentasByUsuario.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { usuarioId: 'u1' } });

            await getByUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getMisCuentas', () => {
        it('should return accounts for authenticated user (req.user.uid)', async () => {
            service.getCuentasByUsuario.mockResolvedValue([{ _id: '1' }]);
            const { req, res } = mockReqRes({ user: { uid: 'u1' } });

            await getMisCuentas(req, res);
            expect(service.getCuentasByUsuario).toHaveBeenCalledWith('u1');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should fallback to req.cliente.id', async () => {
            service.getCuentasByUsuario.mockResolvedValue([]);
            const { req, res } = mockReqRes({ cliente: { id: 'c1' } });

            await getMisCuentas(req, res);
            expect(service.getCuentasByUsuario).toHaveBeenCalledWith('c1');
        });

        it('should return 401 if no user found', async () => {
            const { req, res } = mockReqRes();

            await getMisCuentas(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('should return 500 on service error', async () => {
            service.getCuentasByUsuario.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ user: { uid: 'u1' } });

            await getMisCuentas(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('update', () => {
        it('should return 200 on success', async () => {
            service.updateCuenta.mockResolvedValue({ _id: 'id1' });
            const { req, res } = mockReqRes({ params: { id: 'id1' }, body: { TipoCuenta: 'AHORRO' } });

            await update(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 400 on error', async () => {
            service.updateCuenta.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'id1' } });

            await update(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('remove', () => {
        it('should return 200 on success', async () => {
            service.deleteCuenta.mockResolvedValue({ _id: 'id1' });
            const { req, res } = mockReqRes({ params: { id: 'id1' } });

            await remove(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 500 on error', async () => {
            service.deleteCuenta.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'id1' } });

            await remove(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deposit', () => {
        it('should return 200 on success', async () => {
            service.depositar.mockResolvedValue({ Saldo: 150 });
            const { req, res } = mockReqRes({ params: { cuentaId: 'id1' }, body: { monto: 50 } });

            await deposit(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 400 on error', async () => {
            service.depositar.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { cuentaId: 'id1' }, body: { monto: 50 } });

            await deposit(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('withdraw', () => {
        it('should return 200 on success', async () => {
            service.retirar.mockResolvedValue({ Saldo: 50 });
            const { req, res } = mockReqRes({ params: { cuentaId: 'id1' }, body: { monto: 50 } });

            await withdraw(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 400 on error', async () => {
            service.retirar.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { cuentaId: 'id1' }, body: { monto: 50 } });

            await withdraw(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('transfer', () => {
        it('should return 200 on success', async () => {
            service.transferir.mockResolvedValue({ origen: {}, destino: {} });
            const { req, res } = mockReqRes({ body: { cuentaOrigenId: 'o', cuentaDestinoId: 'd', monto: 100 } });

            await transfer(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 400 on error', async () => {
            service.transferir.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ body: {} });

            await transfer(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('cambiarEstado', () => {
        it('should return 200 on success', async () => {
            service.cambiarEstadoCuenta.mockResolvedValue({ EstadoCuenta: 'BLOQUEADA' });
            const { req, res } = mockReqRes({ params: { id: 'id1' }, body: { estado: 'BLOQUEADA' } });

            await cambiarEstado(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 400 on error', async () => {
            service.cambiarEstadoCuenta.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'id1' }, body: { estado: 'INVALID' } });

            await cambiarEstado(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
