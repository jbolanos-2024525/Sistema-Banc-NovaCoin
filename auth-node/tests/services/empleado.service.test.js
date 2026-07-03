import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockEmpleadoModel = vi.fn();
mockEmpleadoModel.find = vi.fn();
mockEmpleadoModel.findById = vi.fn();
mockEmpleadoModel.findOne = vi.fn();
mockEmpleadoModel.findByIdAndUpdate = vi.fn();
mockEmpleadoModel.findByIdAndDelete = vi.fn();

vi.mock('../../src/Empleado/empleado.model.js', () => ({
    default: mockEmpleadoModel,
}));

const {
    createEmpleadoRecord,
    getEmpleadosRecord,
    getEmpleadoById,
    getEmpleadoByDPI,
    getEmpleadoByCorreo,
    getEmpleadosByRol,
    updateEmpleadoRecord,
    deleteEmpleadoSoft,
    deleteEmpleadoAbsolute,
    cambiarEstadoEmpleado,
} = await import('../../src/Empleado/empleado.service.js');

describe('Empleado Service', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('createEmpleadoRecord', () => {
        it('should create and return employee as plain object', async () => {
            const saveFn = vi.fn().mockResolvedValue(undefined);
            const toObjectFn = vi.fn().mockReturnValue({ Nombre: 'Juan', DPI: '1234567890123' });
            mockEmpleadoModel.mockReturnValue({ save: saveFn, toObject: toObjectFn });

            const result = await createEmpleadoRecord({ Nombre: 'Juan', DPI: '1234567890123' });
            expect(saveFn).toHaveBeenCalled();
            expect(toObjectFn).toHaveBeenCalled();
            expect(result.Nombre).toBe('Juan');
        });

        it('should throw on duplicate key (DPI or correo)', async () => {
            mockEmpleadoModel.mockReturnValue({ save: vi.fn().mockRejectedValue({ code: 11000 }) });
            await expect(createEmpleadoRecord({})).rejects.toThrow('Ya existe un empleado con estos datos (DPI o correo)');
        });

        it('should rethrow non-duplicate errors', async () => {
            mockEmpleadoModel.mockReturnValue({ save: vi.fn().mockRejectedValue(new Error('db error')) });
            await expect(createEmpleadoRecord({})).rejects.toThrow('db error');
        });
    });

    describe('getEmpleadosRecord', () => {
        it('should return employees with isActive:true', async () => {
            const chain = { sort: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue([{ _id: '1' }]) };
            mockEmpleadoModel.find.mockReturnValue(chain);

            const result = await getEmpleadosRecord();
            expect(mockEmpleadoModel.find).toHaveBeenCalledWith({ isActive: true });
            expect(result).toHaveLength(1);
        });

        it('should merge custom filters', async () => {
            const chain = { sort: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue([]) };
            mockEmpleadoModel.find.mockReturnValue(chain);

            await getEmpleadosRecord({ Rol: 'Cajero' });
            expect(mockEmpleadoModel.find).toHaveBeenCalledWith({ isActive: true, Rol: 'Cajero' });
        });
    });

    describe('getEmpleadoById', () => {
        it('should return employee by id', async () => {
            mockEmpleadoModel.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue({ _id: 'e1' }) });
            const result = await getEmpleadoById('e1');
            expect(result._id).toBe('e1');
        });

        it('should throw if id is missing', async () => {
            await expect(getEmpleadoById(null)).rejects.toThrow('ID de empleado es requerido');
        });

        it('should throw if not found', async () => {
            mockEmpleadoModel.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
            await expect(getEmpleadoById('e1')).rejects.toThrow('Empleado no encontrado');
        });
    });

    describe('getEmpleadoByDPI', () => {
        it('should return employee by DPI', async () => {
            mockEmpleadoModel.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue({ DPI: '1234567890123' }) });
            const result = await getEmpleadoByDPI('1234567890123');
            expect(result.DPI).toBe('1234567890123');
        });

        it('should throw if DPI is missing', async () => {
            await expect(getEmpleadoByDPI(null)).rejects.toThrow('DPI es requerido');
        });

        it('should throw if not found', async () => {
            mockEmpleadoModel.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
            await expect(getEmpleadoByDPI('1234567890123')).rejects.toThrow('Empleado no encontrado');
        });
    });

    describe('getEmpleadoByCorreo', () => {
        it('should return employee by email (lowercased)', async () => {
            mockEmpleadoModel.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue({ Correo: 'test@test.com' }) });
            const result = await getEmpleadoByCorreo('Test@Test.com');
            expect(mockEmpleadoModel.findOne).toHaveBeenCalledWith({ Correo: 'test@test.com' });
            expect(result.Correo).toBe('test@test.com');
        });

        it('should throw if correo is missing', async () => {
            await expect(getEmpleadoByCorreo(null)).rejects.toThrow('Correo es requerido');
        });

        it('should throw if not found', async () => {
            mockEmpleadoModel.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
            await expect(getEmpleadoByCorreo('a@b.com')).rejects.toThrow('Empleado no encontrado');
        });
    });

    describe('getEmpleadosByRol', () => {
        it('should return employees by role', async () => {
            const chain = { sort: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue([]) };
            mockEmpleadoModel.find.mockReturnValue(chain);

            await getEmpleadosByRol('Cajero');
            expect(mockEmpleadoModel.find).toHaveBeenCalledWith({ Rol: 'Cajero', isActive: true });
        });

        it('should throw if rol is missing', async () => {
            await expect(getEmpleadosByRol(null)).rejects.toThrow('Rol es requerido');
        });
    });

    describe('updateEmpleadoRecord', () => {
        it('should update allowed fields', async () => {
            mockEmpleadoModel.findByIdAndUpdate.mockResolvedValue({ _id: 'e1', Nombre: 'Pedro' });

            await updateEmpleadoRecord('e1', { Nombre: 'Pedro', Telefono: '12345678' });
            expect(mockEmpleadoModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'e1',
                { Nombre: 'Pedro', Telefono: '12345678' },
                { new: true, runValidators: true }
            );
        });

        it('should throw if id is missing', async () => {
            await expect(updateEmpleadoRecord(null, {})).rejects.toThrow('ID de empleado es requerido');
        });

        it('should throw if no valid fields', async () => {
            await expect(updateEmpleadoRecord('e1', { DPI: '9999' })).rejects.toThrow('No hay campos válidos para actualizar');
        });

        it('should throw if not found', async () => {
            mockEmpleadoModel.findByIdAndUpdate.mockResolvedValue(null);
            await expect(updateEmpleadoRecord('e1', { Nombre: 'X' })).rejects.toThrow('Empleado no encontrado');
        });

        it('should filter out non-allowed fields', async () => {
            mockEmpleadoModel.findByIdAndUpdate.mockResolvedValue({ _id: 'e1' });

            await updateEmpleadoRecord('e1', { Nombre: 'X', DPI: 'hack', Correo: 'hack@x.com' });
            expect(mockEmpleadoModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'e1',
                { Nombre: 'X' },
                { new: true, runValidators: true }
            );
        });
    });

    describe('deleteEmpleadoSoft', () => {
        it('should soft delete by setting isActive to false', async () => {
            mockEmpleadoModel.findByIdAndUpdate.mockResolvedValue({ isActive: false });
            const result = await deleteEmpleadoSoft('e1');
            expect(mockEmpleadoModel.findByIdAndUpdate).toHaveBeenCalledWith('e1', { isActive: false }, { new: true });
            expect(result.isActive).toBe(false);
        });

        it('should throw if id is missing', async () => {
            await expect(deleteEmpleadoSoft(null)).rejects.toThrow('ID de empleado es requerido');
        });

        it('should throw if not found', async () => {
            mockEmpleadoModel.findByIdAndUpdate.mockResolvedValue(null);
            await expect(deleteEmpleadoSoft('e1')).rejects.toThrow('Empleado no encontrado');
        });
    });

    describe('deleteEmpleadoAbsolute', () => {
        it('should permanently delete', async () => {
            mockEmpleadoModel.findByIdAndDelete.mockResolvedValue({ _id: 'e1' });
            const result = await deleteEmpleadoAbsolute('e1');
            expect(result._id).toBe('e1');
        });

        it('should throw if id is missing', async () => {
            await expect(deleteEmpleadoAbsolute(null)).rejects.toThrow('ID de empleado es requerido');
        });

        it('should throw if not found', async () => {
            mockEmpleadoModel.findByIdAndDelete.mockResolvedValue(null);
            await expect(deleteEmpleadoAbsolute('e1')).rejects.toThrow('Empleado no encontrado');
        });
    });

    describe('cambiarEstadoEmpleado', () => {
        it('should change employee state', async () => {
            mockEmpleadoModel.findByIdAndUpdate.mockResolvedValue({ Estado: 'SUSPENDIDO' });
            const result = await cambiarEstadoEmpleado('e1', 'SUSPENDIDO');
            expect(result.Estado).toBe('SUSPENDIDO');
        });

        it('should throw if id is missing', async () => {
            await expect(cambiarEstadoEmpleado(null, 'ACTIVO')).rejects.toThrow('ID de empleado es requerido');
        });

        it('should throw on invalid state', async () => {
            await expect(cambiarEstadoEmpleado('e1', 'FIRED')).rejects.toThrow('Estado no válido');
        });

        it('should accept all valid states', async () => {
            for (const e of ['ACTIVO', 'INACTIVO', 'SUSPENDIDO']) {
                mockEmpleadoModel.findByIdAndUpdate.mockResolvedValue({ Estado: e });
                const r = await cambiarEstadoEmpleado('e1', e);
                expect(r.Estado).toBe(e);
            }
        });

        it('should throw if not found', async () => {
            mockEmpleadoModel.findByIdAndUpdate.mockResolvedValue(null);
            await expect(cambiarEstadoEmpleado('e1', 'ACTIVO')).rejects.toThrow('Empleado no encontrado');
        });
    });
});
