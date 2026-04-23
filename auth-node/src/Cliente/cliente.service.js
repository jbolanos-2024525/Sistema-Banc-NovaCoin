import { Cliente } from './cliente.model.js';

export const createCliente = async (clienteData) => {
  const cliente = new Cliente(clienteData);
  await cliente.save();
  return cliente;
};

export const getCliente = async () => {
 
  return await Cliente.find({ Estado: true }).sort({ createdAt: -1 });
};

export const getClienteById = async (id) => {
  const cliente = await Cliente.findById(id);
  if (!cliente) throw new Error('Cliente no encontrado');
  return cliente;
};

export const updateCliente = async (id, clienteData) => {
  const cliente = await Cliente.findById(id);
  if (!cliente) throw new Error('Cliente no encontrado');
  if (!cliente.Estado) throw new Error('El cliente está inactivo');

 
  delete clienteData.dpi;

  return await Cliente.findByIdAndUpdate(id, clienteData, { new: true, runValidators: true });
};

export const deleteCliente = async (id) => {
  const cliente = await Cliente.findById(id);
  if (!cliente) throw new Error('Cliente no encontrado');

  return await Cliente.findByIdAndUpdate(id, { Estado: false }, { new: true });
};