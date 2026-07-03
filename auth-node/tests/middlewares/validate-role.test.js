import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAdmin, hasRole } from '../../middlewares/validate-role.js';

function mockReqResNext(overrides = {}) {
    const req = { ...overrides };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    const next = vi.fn();
    return { req, res, next };
}

describe('validate-role middleware', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('isAdmin', () => {
        it('should call next if cliente.role is ADMIN_ROLE', () => {
            const { req, res, next } = mockReqResNext({ cliente: { role: 'ADMIN_ROLE' } });
            isAdmin(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should call next if cliente.Role is ADMIN_ROLE', () => {
            const { req, res, next } = mockReqResNext({ cliente: { Role: 'ADMIN_ROLE' } });
            isAdmin(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should call next if empleado.Rol is Administrador', () => {
            const { req, res, next } = mockReqResNext({
                cliente: { role: 'USER_ROLE' },
                empleado: { Rol: 'Administrador' },
            });
            isAdmin(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 401 if no cliente and no empleado', () => {
            const { req, res, next } = mockReqResNext({});
            isAdmin(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Usuario no autenticado' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 403 if user is not admin', () => {
            const { req, res, next } = mockReqResNext({ cliente: { role: 'USER_ROLE' } });
            isAdmin(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Acceso denegado' });
        });

        it('should return 403 if empleado has non-admin role', () => {
            const { req, res, next } = mockReqResNext({
                cliente: { role: 'USER_ROLE' },
                empleado: { Rol: 'Cajero' },
            });
            isAdmin(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('hasRole', () => {
        it('should call next if role matches', () => {
            const middleware = hasRole('Cajero', 'Gerente');
            const { req, res, next } = mockReqResNext({ cliente: { role: 'Cajero' } });
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should use empleado.Rol as fallback', () => {
            const middleware = hasRole('Gerente');
            const { req, res, next } = mockReqResNext({ empleado: { Rol: 'Gerente' } });
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 401 if no role found', () => {
            const middleware = hasRole('Cajero');
            const { req, res, next } = mockReqResNext({});
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Usuario no autenticado' });
        });

        it('should return 403 if role not in allowed list', () => {
            const middleware = hasRole('Gerente', 'Administrador');
            const { req, res, next } = mockReqResNext({ cliente: { role: 'Cajero' } });
            middleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'No tiene permisos' });
        });

        it('should handle multiple allowed roles', () => {
            const middleware = hasRole('Asesor', 'Cajero', 'Gerente', 'Administrador');
            const { req, res, next } = mockReqResNext({ cliente: { role: 'Asesor' } });
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
