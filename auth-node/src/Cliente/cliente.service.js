import { Cliente } from './cliente.model.js';


export const createCliente = async (clienteData) => {
  const cliente = new Cliente(clienteData);
  await cliente.save();
  return cliente;
};


export const getCliente = async () => {
  return await Cliente.find({ estado: true }).sort({ createdAt: -1 });
};