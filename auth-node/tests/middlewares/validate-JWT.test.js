import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('jsonwebtoken', () => ({
    default: { verify: vi.fn() },
}));

const mockEmpleadoModel = { findById: vi.fn() };
vi.mock('../../src/Empleado/empleado.model.js', () => ({
    default: mockEmpleadoModel,
}));

const jwt = (await import('jsonwebtoken')).default;
const { validateJWT } = await import('../../middlewares/validate-JWT.js');

function mockReqResNext() {
    const req = { header: vi.fn() };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    const next = vi.fn();
    return { req, res, next };
}

describe('validateJWT middleware', () => {
    beforeEach(() => vi.clearAllMocks());

    it('should return 401 if no token', async () => {
        const { req, res, next } = mockReqResNext();
        req.header.mockReturnValue(null);

        await validateJWT(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Token requerido' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
        const { req, res, next } = mockReqResNext();
        req.header.mockReturnValue('Bearer bad-token');
        jwt.verify.mockImplementation(() => { throw new Error('invalid'); });

        await validateJWT(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Token inválido' });
    });

    it('should set req.empleado and req.cliente when userId is a Mongo ObjectId and empleado exists', async () => {
        const { req, res, next } = mockReqResNext();
        req.header.mockReturnValue('Bearer valid-token');
        jwt.verify.mockReturnValue({ sub: '507f1f77bcf86cd799439011' });
        const empleadoDoc = { _id: '507f1f77bcf86cd799439011', Nombre: 'Juan' };
        mockEmpleadoModel.findById.mockResolvedValue(empleadoDoc);

        await validateJWT(req, res, next);
        expect(req.empleado).toBe(empleadoDoc);
        expect(req.cliente).toBe(empleadoDoc);
        expect(next).toHaveBeenCalled();
    });

    it('should set req.cliente from decoded token when userId is not a Mongo ObjectId', async () => {
        const { req, res, next } = mockReqResNext();
        req.header.mockReturnValue('Bearer valid-token');
        jwt.verify.mockReturnValue({
            sub: 'guid-not-mongoid',
            email: 'test@test.com',
            username: 'testuser',
            role: 'USER_ROLE',
        });

        await validateJWT(req, res, next);
        expect(req.cliente).toEqual({
            id: 'guid-not-mongoid',
            email: 'test@test.com',
            username: 'testuser',
            role: 'USER_ROLE',
        });
        expect(next).toHaveBeenCalled();
    });

    it('should set req.cliente when MongoId but empleado not found', async () => {
        const { req, res, next } = mockReqResNext();
        req.header.mockReturnValue('Bearer valid-token');
        jwt.verify.mockReturnValue({
            sub: '507f1f77bcf86cd799439011',
            email: 'x@y.com',
            role: 'USER_ROLE',
        });
        mockEmpleadoModel.findById.mockResolvedValue(null);

        await validateJWT(req, res, next);
        expect(req.cliente.id).toBe('507f1f77bcf86cd799439011');
        expect(next).toHaveBeenCalled();
    });

    it('should strip Bearer prefix from token', async () => {
        const { req, res, next } = mockReqResNext();
        req.header.mockReturnValue('Bearer my-token');
        jwt.verify.mockReturnValue({ sub: 'u1' });

        await validateJWT(req, res, next);
        expect(jwt.verify).toHaveBeenCalledWith('my-token', process.env.JWT_SECRET);
    });

    it('should use decoded.id fallback if sub is missing', async () => {
        const { req, res, next } = mockReqResNext();
        req.header.mockReturnValue('token-no-bearer');
        jwt.verify.mockReturnValue({ id: 'user-id-1', email: 'a@b.com' });

        await validateJWT(req, res, next);
        expect(req.cliente.id).toBe('user-id-1');
    });
});
