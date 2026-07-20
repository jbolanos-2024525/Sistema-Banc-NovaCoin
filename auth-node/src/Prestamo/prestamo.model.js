import mongoose from "mongoose";
import crypto from 'crypto';

const prestamoSchema = new mongoose.Schema({
    tipoPrestamo: {
        type: String,
        enum: {
            values: ["PERSONAL", "HIPOTECARIO", "VEHICULAR"],
            message: "Tipo de préstamo no válido. Debe ser PERSONAL, HIPOTECARIO o VEHICULAR"
        },
        required: [true, "El tipo de préstamo es obligatorio"],
        uppercase: true
    },

    monto: {
        type: Number,
        required: [true, "El monto es obligatorio"],
        min: 1,
        validate: {
            validator: Number.isFinite,
            message: "El monto debe ser un número válido"
        }
    },

    tasaInteres: {
        type: Number,
        default: 12,
        min: 0,
        max: 100,
        validate: {
            validator: Number.isFinite,
            message: "La tasa de interés debe ser un número válido"
        }
    },

    plazoMeses: {
        type: Number,
        required: [true, "El plazo en meses es obligatorio"],
        min: 1,
        max: 360,
        validate: {
            validator: Number.isFinite,
            message: "El plazo debe ser un número válido"
        }
    },

    proposito: {
        type: String,
        trim: true,
        maxlength: [500, "El propósito no puede exceder 500 caracteres"],
        default: null
    },

    cuotaMensual: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isFinite,
            message: "La cuota mensual debe ser un número válido"
        }
    },

    montoPendiente: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isFinite,
            message: "El monto pendiente debe ser un número válido"
        }
    },

    totalPagado: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
            validator: Number.isFinite,
            message: "El total pagado debe ser un número válido"
        }
    },

    numeroCuotasPagadas: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: "El número de cuotas pagadas debe ser un entero"
        }
    },

    fechaAprobacion: {
        type: Date,
        default: Date.now
    },

    fechaVencimiento: {
        type: Date
    },

    estadoPrestamo: {
        type: String,
        enum: {
            values: ["PENDIENTE", "ACTIVO", "PAGADO", "VENCIDO", "CANCELADO", "RECHAZADO"],
            message: "Estado de préstamo no válido"
        },
        default: "PENDIENTE",
        uppercase: true,
        index: true
    },

    cliente: {
        type: String,
        required: [true, "El ID del cliente es obligatorio"],
        trim: true,
        index: true
    },

    cuentaId: {
        type: String,
        trim: true,
        index: true
    },

    empleado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empleado",
        default: null
    },

    Estado: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'prestamos'
});

prestamoSchema.index({ cliente: 1, Estado: 1 });
prestamoSchema.index({ estadoPrestamo: 1, Estado: 1 });
prestamoSchema.index({ empleado: 1, Estado: 1 });

prestamoSchema.pre("save", async function() {
    if (this.fechaAprobacion && this.plazoMeses) {
        const fechaVencimiento = new Date(this.fechaAprobacion);
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + this.plazoMeses);
        this.fechaVencimiento = fechaVencimiento;
    }
});

export default mongoose.model("Prestamo", prestamoSchema);