import Prestamo from "./prestamo.model.js";

const calcularCuota = (monto, interesAnual, plazoMeses) => {
    if (!monto || !interesAnual || !plazoMeses) {
        throw new Error("Datos insuficientes para calcular cuota");
    }
    
    const i = interesAnual / 100 / 12;
    const cuota = monto * (i * Math.pow(1 + i, plazoMeses)) / (Math.pow(1 + i, plazoMeses) - 1);
    return Number(cuota.toFixed(2));
};

export const createPrestamo = async (data) => {
    try {
        if (!data.monto || !data.plazoMeses) {
            throw new Error("Datos obligatorios incompletos: monto y plazoMeses son requeridos");
        }

        if (!data.cliente) {
            throw new Error("El ID del cliente es obligatorio");
        }

        const tasa = data.tasaInteres ?? 12;
        const cuota = calcularCuota(data.monto, tasa, data.plazoMeses);

        const prestamo = new Prestamo({
            ...data,
            tasaInteres: tasa,
            cuotaMensual: cuota,
            montoPendiente: data.monto,
            estadoPrestamo: data.estadoPrestamo || "ACTIVO"
        });

        await prestamo.save();
        return prestamo;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Ya existe un préstamo con estos datos');
        }
        throw error;
    }
};

const sanitizeFilters = (filters) => {
    const clean = {};
    const allowed = ['tipoPrestamo', 'estadoPrestamo', 'cliente'];
    for (const key of allowed) {
        if (filters[key] !== undefined && typeof filters[key] === 'string') {
            clean[key] = filters[key];
        }
    }
    return clean;
};

export const getPrestamos = async (filters = {}) => {
    const query = { Estado: true, ...sanitizeFilters(filters) };
    return await Prestamo.find(query)
        .populate("empleado", "Nombre Apellido Rol")
        .sort({ createdAt: -1 })
        .lean();
};

export const getPrestamoById = async (id) => {
    if (!id) throw new Error("ID de préstamo es requerido");
    
    const prestamo = await Prestamo.findById(id)
        .populate("empleado", "Nombre Apellido Rol");

    if (!prestamo) throw new Error("Préstamo no encontrado");

    return prestamo;
};

export const getPrestamosByCliente = async (clienteId) => {
    if (!clienteId) throw new Error("ID de cliente es requerido");
    
    return await Prestamo.find({ 
        cliente: String(clienteId), 
        Estado: true 
    })
    .populate("empleado", "Nombre Apellido Rol")
    .sort({ createdAt: -1 })
    .lean();
};

export const getPrestamosByEstado = async (estado) => {
    if (!estado) throw new Error("Estado es requerido");
    
    return await Prestamo.find({ 
        estadoPrestamo: estado, 
        Estado: true 
    })
    .populate("empleado", "Nombre Apellido Rol")
    .sort({ createdAt: -1 })
    .lean();
};

export const getPrestamosByEmpleado = async (empleadoId) => {
    if (!empleadoId) throw new Error("ID de empleado es requerido");
    
    return await Prestamo.find({ 
        empleado: empleadoId, 
        Estado: true 
    })
    .populate("empleado", "Nombre Apellido Rol")
    .sort({ createdAt: -1 })
    .lean();
};

export const updatePrestamo = async (id, data) => {
    if (!id) throw new Error("ID de préstamo es requerido");
    
    const prestamo = await Prestamo.findById(id);
    if (!prestamo) throw new Error("Préstamo no encontrado");

    if (prestamo.estadoPrestamo === "CANCELADO" || prestamo.estadoPrestamo === "PAGADO") {
        throw new Error("No se puede editar un préstamo cancelado o pagado");
    }

    const allowedUpdates = ['proposito', 'estadoPrestamo', 'cuentaId'];
    const updates = {};

    for (const key of allowedUpdates) {
        if (data[key] !== undefined) {
            updates[key] = data[key];
        }
    }

    if (Object.keys(updates).length === 0) {
        throw new Error("No hay campos válidos para actualizar");
    }

    return await Prestamo.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};

export const pagarCuota = async (id, montoPago) => {
    if (!id) throw new Error("ID de préstamo es requerido");
    if (!montoPago || montoPago <= 0) throw new Error("Monto de pago inválido");
    
    const prestamo = await Prestamo.findById(id);
    if (!prestamo) throw new Error("Préstamo no encontrado");
    
    if (prestamo.estadoPrestamo !== "ACTIVO") {
        throw new Error("Solo se pueden pagar cuotas de préstamos activos");
    }

    if (montoPago > prestamo.montoPendiente) {
        throw new Error("El monto del pago excede el saldo pendiente");
    }

    prestamo.montoPendiente -= montoPago;
    prestamo.totalPagado += montoPago;
    prestamo.numeroCuotasPagadas += 1;

    if (prestamo.montoPendiente <= 0) {
        prestamo.montoPendiente = 0;
        prestamo.estadoPrestamo = "PAGADO";
    }

    await prestamo.save();
    return prestamo;
};

export const cancelarPrestamo = async (id) => {
    if (!id) throw new Error("ID de préstamo es requerido");
    
    const prestamo = await Prestamo.findById(id);
    if (!prestamo) throw new Error("Préstamo no encontrado");

    if (prestamo.estadoPrestamo === "CANCELADO") {
        throw new Error("El préstamo ya está cancelado");
    }

    if (prestamo.estadoPrestamo === "PAGADO") {
        throw new Error("No se puede cancelar un préstamo ya pagado");
    }

    prestamo.estadoPrestamo = "CANCELADO";
    await prestamo.save();

    return prestamo;
};

export const deletePrestamo = async (id) => {
    if (!id) throw new Error("ID de préstamo es requerido");
    
    const prestamo = await Prestamo.findByIdAndUpdate(
        id, 
        { Estado: false }, 
        { new: true }
    );
    
    if (!prestamo) throw new Error("Préstamo no encontrado");

    return prestamo;
};

export const cambiarEstadoPrestamo = async (id, nuevoEstado) => {
    if (!id) throw new Error("ID de préstamo es requerido");
    if (!['ACTIVO', 'PAGADO', 'VENCIDO', 'CANCELADO', 'RECHAZADO'].includes(nuevoEstado)) {
        throw new Error('Estado no válido');
    }
    
    const prestamo = await Prestamo.findByIdAndUpdate(
        id,
        { estadoPrestamo: nuevoEstado },
        { new: true, runValidators: true }
    );
    
    if (!prestamo) throw new Error("Préstamo no encontrado");
    
    return prestamo;
};