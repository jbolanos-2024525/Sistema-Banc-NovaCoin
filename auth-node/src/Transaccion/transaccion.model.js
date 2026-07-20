import { Schema, model } from "mongoose";
import crypto from 'crypto';

const transaccionSchema = new Schema({
    TipoTransaccion: {
        type: String,
        enum: {
            values: ["DEPOSITO", "RETIRO", "TRANSFERENCIA", "PAGO_PRESTAMO", "TRANSFERENCIA_RECIBIDA"],
            message: "Tipo de transacción no válido"
        },
        required: [true, "El tipo de transacción es obligatorio"],
        uppercase: true,
        index: true
    },

    Monto: {
        type: Number,
        required: [true, "El monto es obligatorio"],
        min: 0.01,
        validate: {
            validator: Number.isFinite,
            message: "El monto debe ser un número válido"
        }
    },

    Moneda: {
        type: String,
        enum: {
            values: ["GTQ", "USD"],
            message: "Moneda no válida. Debe ser GTQ o USD"
        },
        default: "GTQ",
        uppercase: true
    },

    CuentaOrigen: {
        type: String,
        trim: true,
        index: true
    },

    CuentaDestino: {
        type: String,
        trim: true,
        index: true
    },

    NumeroCuentaOrigen: {
        type: String,
        trim: true
    },

    NumeroCuentaDestino: {
        type: String,
        trim: true
    },

    Descripcion: {
        type: String,
        trim: true,
        maxlength: [500, "La descripción no puede exceder 500 caracteres"],
        default: ""
    },

    Referencia: {
        type: String,
        trim: true,
        maxlength: [100, "La referencia no puede exceder 100 caracteres"],
        default: ""
    },

    EstadoTransaccion: {
        type: String,
        enum: {
            values: ["COMPLETADA", "PENDIENTE", "FALLIDA", "CANCELADA"],
            message: "Estado de transacción no válido"
        },
        default: "COMPLETADA",
        uppercase: true,
        index: true
    },

    FechaTransaccion: {
        type: Date,
        default: Date.now,
        index: true
    },

    Usuario: {
        type: String,
        required: [true, "El ID del usuario es obligatorio"],
        trim: true,
        index: true
    },

    Empleado: {
        type: Schema.Types.ObjectId,
        ref: "Empleado",
        default: null
    },

    PrestamoId: {
        type: String,
        trim: true,
        index: true
    },

    SaldoAnteriorOrigen: {
        type: Number,
        default: 0
    },

    SaldoPosteriorOrigen: {
        type: Number,
        default: 0
    },

    SaldoAnteriorDestino: {
        type: Number,
        default: 0
    },

    SaldoPosteriorDestino: {
        type: Number,
        default: 0
    },

    IP: {
        type: String,
        trim: true
    },

    Dispositivo: {
        type: String,
        trim: true
    },

    Estado: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'transacciones'
});

transaccionSchema.index({ Usuario: 1, Estado: 1 });
transaccionSchema.index({ CuentaOrigen: 1, Estado: 1 });
transaccionSchema.index({ CuentaDestino: 1, Estado: 1 });
transaccionSchema.index({ TipoTransaccion: 1, EstadoTransaccion: 1 });
transaccionSchema.index({ FechaTransaccion: -1 });

transaccionSchema.pre("save", function() {
    if (this.isNew) {
        this.FechaTransaccion = this.FechaTransaccion || new Date();
    }
});

export const Transaccion = model("Transaccion", transaccionSchema);
