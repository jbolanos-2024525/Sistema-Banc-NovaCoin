import { Cuenta } from './cuenta.model.js';


const generarNumeroCuenta = async () => {
  const hoy = new Date();
  const fecha = `${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, '0')}${String(hoy.getDate()).padStart(2, '0')}`;

  let numeroCuenta;
  let existe = true;

  while (existe) {
    const aleatorio = Math.floor(100000 + Math.random() * 900000);
    numeroCuenta = `NC-${fecha}-${aleatorio}`;
    existe = await Cuenta.findOne({ NumeroCuenta: numeroCuenta });
  }

  return numeroCuenta;
};

export const createCuenta = async (accountData) => {
  
  if (!accountData.NumeroCuenta) {
    accountData.NumeroCuenta = await generarNumeroCuenta();
  }

  const cuenta = new Cuenta(accountData);
  await cuenta.save();
  return cuenta;
};

export const getCuentas = async () => {
  return await Cuenta.find({ Estado: true })
    .populate('IdCliente')
    .sort({ createdAt: -1 });
};

export const getCuentaById = async (id) => {
  const cuenta = await Cuenta.findById(id).populate('IdCliente');
  if (!cuenta) throw new Error('Cuenta no encontrada');
  return cuenta;
};

export const getCuentasByCliente = async (clienteId) => {
  return await Cuenta.find({ IdCliente: clienteId, Estado: true })
    .sort({ createdAt: -1 });
};

export const updateCuenta = async (id, accountData) => {
  // No permitir cambiar el número de cuenta
  delete accountData.NumeroCuenta;
  return await Cuenta.findByIdAndUpdate(id, accountData, { new: true });
};

export const deleteCuenta = async (id) => {
  return await Cuenta.findByIdAndUpdate(id, { Estado: false }, { new: true });
};