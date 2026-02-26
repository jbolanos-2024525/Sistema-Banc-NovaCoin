import { Schema, model } from "mongoose";

const CuentaSchema = new Schema({
    NumeroCuenta: {
        type: String,
        required: [true, "El número de cuenta es obligatorio"],
        unique: true,
        trim: true
    },
    TipoCuenta: {
        type: String,
        required: [true, "El tipo de cuenta es obligatorio"],
        enum: ["AHORRO", "MONETARIA", "EMPRESARIAL"],
        uppercase: true
    },
    Moneda: {
        type: String,
        required: [true, "La moneda es obligatoria"],
        enum: ["GTQ", "USD"],
        default: "GTQ",
        uppercase: true
    },
    Saldo: {
        type: Number,
        required: [true, "El saldo inicial es obligatorio"],
        min: [0, "El saldo no puede ser negativo"]
    },
    LimiteRetiroDiario: {
        type: Number,
        required: [true, "El límite de retiro es obligatorio"]
    },
    EstadoCuenta: {
        type: String,
        enum: ["ACTIVA", "BLOQUEADA", "CANCELADA"],
        default: "ACTIVA",
        uppercase: true
    },
    IdCliente: {
        type: Schema.Types.ObjectId,
        ref: "Cliente",
        required: [true, "El ID del cliente es obligatorio"]
    },
    Estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Cuenta = model("Cuenta", CuentaSchema);