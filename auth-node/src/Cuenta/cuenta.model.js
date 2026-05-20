import { Schema, model } from "mongoose";

const CuentaSchema = new Schema({

    NumeroCuenta: {
        type: String,
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
        enum: ["GTQ", "USD"],
        default: "GTQ",
        uppercase: true
    },

    Saldo: {
        type: Number,
        default: 0,
        min: [0, "El saldo no puede ser negativo"]
    },

    LimiteRetiroDiario: {
        type: Number,
        default: 5000
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
        required: [true, "El cliente es obligatorio"]
    },

    Estado: {
        type: Boolean,
        default: true
    }

}, {

    timestamps: true,
    versionKey: false

});

// GENERAR NÚMERO DE CUENTA AUTOMÁTICO
CuentaSchema.pre("save", async function () {

    if (!this.NumeroCuenta) {

        const random = Math.floor(
            1000000000 + Math.random() * 9000000000
        );

        this.NumeroCuenta = `NC-${random}`;
    }

});

export const Cuenta = model(
    "Cuenta",
    CuentaSchema
);