import Empleado from './empleado.model.js';


export const createEmpleadoRecord = async ({ empleadoData }) => {
  const empleado = new Empleado(empleadoData);
  await empleado.save();
  return empleado;
};


export const getEmpleadosRecord = async () => {
  return await Empleado.find({ isActive: true }).sort({ createdAt: -1 });
};