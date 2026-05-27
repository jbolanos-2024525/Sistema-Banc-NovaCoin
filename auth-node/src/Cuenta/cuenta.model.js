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

    // UUID del usuario registrado en el auth-service (C#)
    IdUsuario: {
        type: String,
        required: [true, "El ID del usuario es obligatorio"],
        trim: true
    },

    Estado: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true,
    versionKey: false
});

CuentaSchema.pre("save", async function () {

    if (!this.NumeroCuenta) {

        const hoy = new Date();
        const fecha = `${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, '0')}${String(hoy.getDate()).padStart(2, '0')}`;

        let numeroCuenta;
        let existe = true;

        while (existe) {
            const aleatorio = Math.floor(100000 + Math.random() * 900000);
            numeroCuenta = `NC-${fecha}-${aleatorio}`;
            existe = await model("Cuenta").findOne({ NumeroCuenta: numeroCuenta });
        }

        this.NumeroCuenta = numeroCuenta;
    }

});

export const Cuenta = model("Cuenta", CuentaSchema);