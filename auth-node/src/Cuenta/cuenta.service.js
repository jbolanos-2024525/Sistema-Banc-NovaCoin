import { Cuenta } from './cuenta.model.js';

export const createCuenta = async (accountData) => {
  const cuenta = new Cuenta(accountData);
  await cuenta.save();
  return cuenta;
};

export const getCuentas = async () => {
  return await Cuenta.find({ Estado: true }).sort({ createdAt: -1 });
};


export const updateCuenta = async (id, accountData) => {
  return await Cuenta.findByIdAndUpdate(id, accountData, { new: true });
};


export const deleteCuenta = async (id) => {
  return await Cuenta.findByIdAndUpdate(id, { Estado: false }, { new: true });
};