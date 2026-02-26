import Prestamo from "./prestamo.model.js";

/* calcular cuota */
const calcularCuota = (monto, interesAnual, plazoMeses) =>
{
    const i = interesAnual / 100 / 12;
    const cuota = monto * (i * Math.pow(1 + i, plazoMeses)) / (Math.pow(1 + i, plazoMeses) - 1);
    return Number(cuota.toFixed(2));
};

export const createPrestamo = async (data) =>
{
    if (!data.monto || !data.plazoMeses)
        throw new Error("Datos obligatorios incompletos");

    const tasa = data.tasaInteres ?? 12;

    const cuota = calcularCuota(data.monto, tasa, data.plazoMeses);

    const prestamo = new Prestamo({
        ...data,
        tasaInteres: tasa,
        cuotaMensual: cuota,
        montoPendiente: data.monto
    });

    return await prestamo.save();
};

export const getPrestamos = async () =>
{
    return Prestamo.find()
        .populate("cliente")
        .populate("empleado")
        .sort({ createdAt: -1 });
};

export const getPrestamoById = async (id) =>
{
    const prestamo = await Prestamo.findById(id)
        .populate("cliente")
        .populate("empleado");

    if (!prestamo)
        throw new Error("Prestamo no encontrado");

    return prestamo;
};

export const updatePrestamo = async (id, data) =>
{
    const prestamo = await Prestamo.findById(id);

    if (!prestamo)
        throw new Error("Prestamo no encontrado");

    if (prestamo.estadoPrestamo === "CANCELADO")
        throw new Error("No se puede editar un prestamo cancelado");

    if (data.monto || data.plazoMeses || data.tasaInteres)
    {
        const monto = data.monto ?? prestamo.monto;
        const plazo = data.plazoMeses ?? prestamo.plazoMeses;
        const tasa = data.tasaInteres ?? prestamo.tasaInteres;

        data.cuotaMensual = calcularCuota(monto, tasa, plazo);
    }

    return Prestamo.findByIdAndUpdate(id, data, { new: true });
};

export const cancelarPrestamo = async (id) =>
{
    const prestamo = await Prestamo.findById(id);

    if (!prestamo)
        throw new Error("Prestamo no encontrado");

    if (prestamo.estadoPrestamo === "CANCELADO")
        throw new Error("El prestamo ya esta cancelado");

    prestamo.estadoPrestamo = "CANCELADO";

    return prestamo.save();
};