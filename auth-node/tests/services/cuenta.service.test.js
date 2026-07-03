import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCuentaInstance = {
    save: vi.fn(),
    Saldo: 0,
    EstadoCuenta: 'ACTIVA',
    LimiteRetiroDiario: 5000,
};

const mockCuentaModel = vi.fn(() => ({ ...mockCuentaInstance, save: vi.fn() }));
mockCuentaModel.find = vi.fn();
mockCuentaModel.findById = vi.fn();
mockCuentaModel.findOne = vi.fn();
mockCuentaModel.findByIdAndUpdate = vi.fn();

vi.mock('../../src/Cuenta/cuenta.model.js', () => ({
    Cuenta: mockCuentaModel,
}));

const {
    createCuenta,
    getCuentas,
    getCuentaById,
    getCuentaByNumero,
    getCuentasByUsuario,
    updateCuenta,
    deleteCuenta,
    depositar,
    retirar,
    transferir,
    cambiarEstadoCuenta,
} = await import('../../src/Cuenta/cuenta.service.js');

describe('Cuenta Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createCuenta', () => {
        it('should create and save a new account', async () => {
            const accountData = { TipoCuenta: 'AHORRO', IdUsuario: 'user1' };
            const saveFn = vi.fn().mockResolvedValue(undefined);
            mockCuentaModel.mockReturnValue({ ...accountData, save: saveFn });

            const result = await createCuenta(accountData);
            expect(saveFn).toHaveBeenCalled();
            expect(result.TipoCuenta).toBe('AHORRO');
        });

        it('should throw on duplicate key error', async () => {
            const saveFn = vi.fn().mockRejectedValue({ code: 11000 });
            mockCuentaModel.mockReturnValue({ save: saveFn });

            await expect(createCuenta({})).rejects.toThrow('Ya existe una cuenta con estos datos');
        });

        it('should rethrow non-duplicate errors', async () => {
            const saveFn = vi.fn().mockRejectedValue(new Error('DB error'));
            mockCuentaModel.mockReturnValue({ save: saveFn });

            await expect(createCuenta({})).rejects.toThrow('DB error');
        });
    });

    describe('getCuentas', () => {
        it('should return accounts with Estado:true and custom filters', async () => {
            const mockData = [{ NumeroCuenta: 'NC-001' }];
            const chain = { sort: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue(mockData) };
            mockCuentaModel.find.mockReturnValue(chain);

            const result = await getCuentas({ Moneda: 'GTQ' });
            expect(mockCuentaModel.find).toHaveBeenCalledWith({ Estado: true, Moneda: 'GTQ' });
            expect(result).toEqual(mockData);
        });

        it('should use default empty filters', async () => {
            const chain = { sort: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue([]) };
            mockCuentaModel.find.mockReturnValue(chain);

            await getCuentas();
            expect(mockCuentaModel.find).toHaveBeenCalledWith({ Estado: true });
        });
    });

    describe('getCuentaById', () => {
        it('should return account by id', async () => {
            const mockAccount = { _id: 'id1', NumeroCuenta: 'NC-001' };
            mockCuentaModel.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue(mockAccount) });

            const result = await getCuentaById('id1');
            expect(result).toEqual(mockAccount);
        });

        it('should throw if id is missing', async () => {
            await expect(getCuentaById(null)).rejects.toThrow('ID de cuenta es requerido');
        });

        it('should throw if account not found', async () => {
            mockCuentaModel.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });

            await expect(getCuentaById('id1')).rejects.toThrow('Cuenta no encontrada');
        });
    });

    describe('getCuentaByNumero', () => {
        it('should return account by number', async () => {
            const mockAccount = { NumeroCuenta: 'NC-001' };
            mockCuentaModel.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(mockAccount) });

            const result = await getCuentaByNumero('NC-001');
            expect(result).toEqual(mockAccount);
        });

        it('should throw if numeroCuenta is missing', async () => {
            await expect(getCuentaByNumero(null)).rejects.toThrow('Número de cuenta es requerido');
        });

        it('should throw if account not found', async () => {
            mockCuentaModel.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });

            await expect(getCuentaByNumero('NC-999')).rejects.toThrow('Cuenta no encontrada');
        });
    });

    describe('getCuentasByUsuario', () => {
        it('should return accounts for a user', async () => {
            const chain = { sort: vi.fn().mockReturnThis(), lean: vi.fn().mockResolvedValue([]) };
            mockCuentaModel.find.mockReturnValue(chain);

            await getCuentasByUsuario('user1');
            expect(mockCuentaModel.find).toHaveBeenCalledWith({ IdUsuario: 'user1', Estado: true });
        });

        it('should throw if usuarioId is missing', async () => {
            await expect(getCuentasByUsuario(null)).rejects.toThrow('ID de usuario es requerido');
        });
    });

    describe('updateCuenta', () => {
        it('should update allowed fields', async () => {
            const updated = { _id: 'id1', TipoCuenta: 'MONETARIA' };
            mockCuentaModel.findByIdAndUpdate.mockResolvedValue(updated);

            const result = await updateCuenta('id1', { TipoCuenta: 'MONETARIA' });
            expect(mockCuentaModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'id1',
                { TipoCuenta: 'MONETARIA' },
                { new: true, runValidators: true }
            );
            expect(result).toEqual(updated);
        });

        it('should throw if id is missing', async () => {
            await expect(updateCuenta(null, {})).rejects.toThrow('ID de cuenta es requerido');
        });

        it('should throw if no valid fields to update', async () => {
            await expect(updateCuenta('id1', { invalidField: 'value' })).rejects.toThrow('No hay campos válidos para actualizar');
        });

        it('should throw if account not found', async () => {
            mockCuentaModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(updateCuenta('id1', { TipoCuenta: 'AHORRO' })).rejects.toThrow('Cuenta no encontrada');
        });

        it('should filter out non-allowed fields', async () => {
            mockCuentaModel.findByIdAndUpdate.mockResolvedValue({ _id: 'id1' });

            await updateCuenta('id1', { TipoCuenta: 'AHORRO', Saldo: 9999, NumeroCuenta: 'hack' });
            expect(mockCuentaModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'id1',
                { TipoCuenta: 'AHORRO' },
                { new: true, runValidators: true }
            );
        });
    });

    describe('deleteCuenta', () => {
        it('should soft-delete by setting Estado to false', async () => {
            mockCuentaModel.findByIdAndUpdate.mockResolvedValue({ _id: 'id1', Estado: false });

            const result = await deleteCuenta('id1');
            expect(mockCuentaModel.findByIdAndUpdate).toHaveBeenCalledWith('id1', { Estado: false }, { new: true });
            expect(result.Estado).toBe(false);
        });

        it('should throw if id is missing', async () => {
            await expect(deleteCuenta(null)).rejects.toThrow('ID de cuenta es requerido');
        });

        it('should throw if account not found', async () => {
            mockCuentaModel.findByIdAndUpdate.mockResolvedValue(null);
            await expect(deleteCuenta('id1')).rejects.toThrow('Cuenta no encontrada');
        });
    });

    describe('depositar', () => {
        it('should add monto to account balance', async () => {
            const cuenta = { Saldo: 100, EstadoCuenta: 'ACTIVA', save: vi.fn() };
            mockCuentaModel.findById.mockResolvedValue(cuenta);

            const result = await depositar('id1', 50);
            expect(result.Saldo).toBe(150);
            expect(cuenta.save).toHaveBeenCalled();
        });

        it('should throw if cuentaId is missing', async () => {
            await expect(depositar(null, 50)).rejects.toThrow('ID de cuenta es requerido');
        });

        it('should throw if monto is invalid', async () => {
            await expect(depositar('id1', 0)).rejects.toThrow('Monto inválido');
            await expect(depositar('id1', -10)).rejects.toThrow('Monto inválido');
            await expect(depositar('id1', null)).rejects.toThrow('Monto inválido');
        });

        it('should throw if account not found', async () => {
            mockCuentaModel.findById.mockResolvedValue(null);
            await expect(depositar('id1', 50)).rejects.toThrow('Cuenta no encontrada');
        });

        it('should throw if account is not active', async () => {
            mockCuentaModel.findById.mockResolvedValue({ EstadoCuenta: 'BLOQUEADA' });
            await expect(depositar('id1', 50)).rejects.toThrow('La cuenta no está activa');
        });
    });

    describe('retirar', () => {
        it('should subtract monto from account balance', async () => {
            const cuenta = { Saldo: 100, EstadoCuenta: 'ACTIVA', LimiteRetiroDiario: 5000, save: vi.fn() };
            mockCuentaModel.findById.mockResolvedValue(cuenta);

            const result = await retirar('id1', 50);
            expect(result.Saldo).toBe(50);
        });

        it('should throw if cuentaId is missing', async () => {
            await expect(retirar(null, 50)).rejects.toThrow('ID de cuenta es requerido');
        });

        it('should throw if monto is invalid', async () => {
            await expect(retirar('id1', 0)).rejects.toThrow('Monto inválido');
        });

        it('should throw if insufficient balance', async () => {
            mockCuentaModel.findById.mockResolvedValue({ Saldo: 10, EstadoCuenta: 'ACTIVA', LimiteRetiroDiario: 5000 });
            await expect(retirar('id1', 50)).rejects.toThrow('Saldo insuficiente');
        });

        it('should throw if exceeds daily withdrawal limit', async () => {
            mockCuentaModel.findById.mockResolvedValue({ Saldo: 10000, EstadoCuenta: 'ACTIVA', LimiteRetiroDiario: 100 });
            await expect(retirar('id1', 500)).rejects.toThrow('Monto excede el límite de retiro diario');
        });

        it('should throw if account is not active', async () => {
            mockCuentaModel.findById.mockResolvedValue({ EstadoCuenta: 'CANCELADA' });
            await expect(retirar('id1', 50)).rejects.toThrow('La cuenta no está activa');
        });
    });

    describe('transferir', () => {
        it('should transfer between two accounts', async () => {
            const origen = { Saldo: 500, EstadoCuenta: 'ACTIVA', LimiteRetiroDiario: 5000, save: vi.fn() };
            const destino = { Saldo: 100, EstadoCuenta: 'ACTIVA', save: vi.fn() };
            mockCuentaModel.findById.mockResolvedValueOnce(origen).mockResolvedValueOnce(destino);

            const result = await transferir('id1', 'id2', 200);
            expect(result.origen.Saldo).toBe(300);
            expect(result.destino.Saldo).toBe(300);
        });

        it('should throw if IDs are missing', async () => {
            await expect(transferir(null, 'id2', 100)).rejects.toThrow('IDs de cuentas son requeridos');
            await expect(transferir('id1', null, 100)).rejects.toThrow('IDs de cuentas son requeridos');
        });

        it('should throw if monto is invalid', async () => {
            await expect(transferir('id1', 'id2', 0)).rejects.toThrow('Monto inválido');
        });

        it('should throw if same account', async () => {
            await expect(transferir('id1', 'id1', 100)).rejects.toThrow('No se puede transferir a la misma cuenta');
        });

        it('should throw if an account is not found', async () => {
            mockCuentaModel.findById.mockResolvedValueOnce(null).mockResolvedValueOnce({});
            await expect(transferir('id1', 'id2', 100)).rejects.toThrow('Cuenta no encontrada');
        });

        it('should throw if origin is not active', async () => {
            const origen = { Saldo: 500, EstadoCuenta: 'BLOQUEADA', LimiteRetiroDiario: 5000 };
            const destino = { Saldo: 100, EstadoCuenta: 'ACTIVA' };
            mockCuentaModel.findById.mockResolvedValueOnce(origen).mockResolvedValueOnce(destino);

            await expect(transferir('id1', 'id2', 100)).rejects.toThrow('La cuenta de origen no está activa');
        });

        it('should throw if destination is not active', async () => {
            const origen = { Saldo: 500, EstadoCuenta: 'ACTIVA', LimiteRetiroDiario: 5000 };
            const destino = { Saldo: 100, EstadoCuenta: 'BLOQUEADA' };
            mockCuentaModel.findById.mockResolvedValueOnce(origen).mockResolvedValueOnce(destino);

            await expect(transferir('id1', 'id2', 100)).rejects.toThrow('La cuenta de destino no está activa');
        });

        it('should throw if insufficient balance', async () => {
            const origen = { Saldo: 50, EstadoCuenta: 'ACTIVA', LimiteRetiroDiario: 5000 };
            const destino = { Saldo: 100, EstadoCuenta: 'ACTIVA' };
            mockCuentaModel.findById.mockResolvedValueOnce(origen).mockResolvedValueOnce(destino);

            await expect(transferir('id1', 'id2', 100)).rejects.toThrow('Saldo insuficiente');
        });

        it('should throw if exceeds daily limit', async () => {
            const origen = { Saldo: 5000, EstadoCuenta: 'ACTIVA', LimiteRetiroDiario: 100 };
            const destino = { Saldo: 100, EstadoCuenta: 'ACTIVA' };
            mockCuentaModel.findById.mockResolvedValueOnce(origen).mockResolvedValueOnce(destino);

            await expect(transferir('id1', 'id2', 500)).rejects.toThrow('Monto excede el límite de retiro diario');
        });
    });

    describe('cambiarEstadoCuenta', () => {
        it('should change account state', async () => {
            mockCuentaModel.findByIdAndUpdate.mockResolvedValue({ EstadoCuenta: 'BLOQUEADA' });

            const result = await cambiarEstadoCuenta('id1', 'BLOQUEADA');
            expect(result.EstadoCuenta).toBe('BLOQUEADA');
        });

        it('should throw if id is missing', async () => {
            await expect(cambiarEstadoCuenta(null, 'ACTIVA')).rejects.toThrow('ID de cuenta es requerido');
        });

        it('should throw if state is invalid', async () => {
            await expect(cambiarEstadoCuenta('id1', 'INVALID')).rejects.toThrow('Estado no válido');
        });

        it('should throw if account not found', async () => {
            mockCuentaModel.findByIdAndUpdate.mockResolvedValue(null);
            await expect(cambiarEstadoCuenta('id1', 'ACTIVA')).rejects.toThrow('Cuenta no encontrada');
        });

        it('should accept all valid states', async () => {
            for (const estado of ['ACTIVA', 'BLOQUEADA', 'CANCELADA']) {
                mockCuentaModel.findByIdAndUpdate.mockResolvedValue({ EstadoCuenta: estado });
                const result = await cambiarEstadoCuenta('id1', estado);
                expect(result.EstadoCuenta).toBe(estado);
            }
        });
    });
});
