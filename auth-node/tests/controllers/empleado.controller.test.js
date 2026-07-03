import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/Empleado/empleado.service.js', () => ({
    createEmpleadoRecord: vi.fn(),
    getEmpleadosRecord: vi.fn(),
    getEmpleadoById: vi.fn(),
    getEmpleadoByDPI: vi.fn(),
    getEmpleadoByCorreo: vi.fn(),
    getEmpleadosByRol: vi.fn(),
    updateEmpleadoRecord: vi.fn(),
    deleteEmpleadoSoft: vi.fn(),
    deleteEmpleadoAbsolute: vi.fn(),
    cambiarEstadoEmpleado: vi.fn(),
}));

const service = await import('../../src/Empleado/empleado.service.js');
const ctrl = await import('../../src/Empleado/empleado.controller.js');

function mockReqRes(overrides = {}) {
    const req = { body: {}, params: {}, query: {}, ...overrides };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    return { req, res };
}

describe('Empleado Controller', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('createEmpleado', () => {
        it('should return 201 on success', async () => {
            service.createEmpleadoRecord.mockResolvedValue({ _id: 'e1', Nombre: 'Juan' });
            const { req, res } = mockReqRes({ body: { Nombre: 'Juan' } });

            await ctrl.createEmpleado(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 400 on error', async () => {
            service.createEmpleadoRecord.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes();

            await ctrl.createEmpleado(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('getEmpleados', () => {
        it('should return 200 with employees', async () => {
            service.getEmpleadosRecord.mockResolvedValue([{ _id: '1' }, { _id: '2' }]);
            const { req, res } = mockReqRes();

            await ctrl.getEmpleados(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: expect.any(Array), count: 2 });
        });

        it('should return 500 on error', async () => {
            service.getEmpleadosRecord.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes();

            await ctrl.getEmpleados(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getEmpleado', () => {
        it('should return 200 with employee', async () => {
            service.getEmpleadoById.mockResolvedValue({ _id: 'e1' });
            const { req, res } = mockReqRes({ params: { id: 'e1' } });

            await ctrl.getEmpleado(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 on error', async () => {
            service.getEmpleadoById.mockRejectedValue(new Error('not found'));
            const { req, res } = mockReqRes({ params: { id: 'e1' } });

            await ctrl.getEmpleado(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getEmpleadoByDPIController', () => {
        it('should return employee by DPI', async () => {
            service.getEmpleadoByDPI.mockResolvedValue({ DPI: '1234567890123' });
            const { req, res } = mockReqRes({ params: { dpi: '1234567890123' } });

            await ctrl.getEmpleadoByDPIController(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 on error', async () => {
            service.getEmpleadoByDPI.mockRejectedValue(new Error('not found'));
            const { req, res } = mockReqRes({ params: { dpi: '0000000000000' } });

            await ctrl.getEmpleadoByDPIController(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getEmpleadoByCorreoController', () => {
        it('should return employee by email', async () => {
            service.getEmpleadoByCorreo.mockResolvedValue({ Correo: 'a@b.com' });
            const { req, res } = mockReqRes({ params: { correo: 'a@b.com' } });

            await ctrl.getEmpleadoByCorreoController(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 on error', async () => {
            service.getEmpleadoByCorreo.mockRejectedValue(new Error('not found'));
            const { req, res } = mockReqRes({ params: { correo: 'x@y.com' } });

            await ctrl.getEmpleadoByCorreoController(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getEmpleadosByRolController', () => {
        it('should return employees by role', async () => {
            service.getEmpleadosByRol.mockResolvedValue([]);
            const { req, res } = mockReqRes({ params: { rol: 'Cajero' } });

            await ctrl.getEmpleadosByRolController(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 500 on error', async () => {
            service.getEmpleadosByRol.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { rol: 'Cajero' } });

            await ctrl.getEmpleadosByRolController(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateEmpleado', () => {
        it('should return 200 on success', async () => {
            service.updateEmpleadoRecord.mockResolvedValue({ _id: 'e1' });
            const { req, res } = mockReqRes({ params: { id: 'e1' }, body: { Nombre: 'Pedro' } });

            await ctrl.updateEmpleado(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 400 on error', async () => {
            service.updateEmpleadoRecord.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'e1' } });

            await ctrl.updateEmpleado(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('deleteEmpleado (soft)', () => {
        it('should return 200 on success', async () => {
            service.deleteEmpleadoSoft.mockResolvedValue({ _id: 'e1' });
            const { req, res } = mockReqRes({ params: { id: 'e1' } });

            await ctrl.deleteEmpleado(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 500 on error', async () => {
            service.deleteEmpleadoSoft.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'e1' } });

            await ctrl.deleteEmpleado(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deleteEmpleadoHard', () => {
        it('should return 200 on permanent delete', async () => {
            service.deleteEmpleadoAbsolute.mockResolvedValue({ _id: 'e1' });
            const { req, res } = mockReqRes({ params: { id: 'e1' } });

            await ctrl.deleteEmpleadoHard(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 500 on error', async () => {
            service.deleteEmpleadoAbsolute.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'e1' } });

            await ctrl.deleteEmpleadoHard(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('cambiarEstado', () => {
        it('should change employee state', async () => {
            service.cambiarEstadoEmpleado.mockResolvedValue({ Estado: 'SUSPENDIDO' });
            const { req, res } = mockReqRes({ params: { id: 'e1' }, body: { estado: 'SUSPENDIDO' } });

            await ctrl.cambiarEstado(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 400 on error', async () => {
            service.cambiarEstadoEmpleado.mockRejectedValue(new Error('fail'));
            const { req, res } = mockReqRes({ params: { id: 'e1' }, body: { estado: 'INVALID' } });

            await ctrl.cambiarEstado(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
