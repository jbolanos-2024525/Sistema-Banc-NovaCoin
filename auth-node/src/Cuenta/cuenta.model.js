import { Schema, model } from "mongoose";

const CuentaSchema = new Schema({
    NumeroCuenta: {
        type: String,
        unique: true,
        trim: true,
        index: true
    },

    TipoCuenta: {
        type: String,
        required: [true, "El tipo de cuenta es obligatorio"],
        enum: {
            values: ["AHORRO", "MONETARIA", "EMPRESARIAL"],
            message: "Tipo de cuenta no válido. Debe ser AHORRO, MONETARIA o EMPRESARIAL"
        },
        uppercase: true
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

    Saldo: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
            validator: Number.isFinite,
            message: "El saldo debe ser un número válido"
        }
    },

    LimiteRetiroDiario: {
        type: Number,
        default: 5000,
        min: 0
    },

    EstadoCuenta: {
        type: String,
        enum: {
            values: ["ACTIVA", "BLOQUEADA", "CANCELADA"],
            message: "Estado de cuenta no válido"
        },
        default: "ACTIVA",
        uppercase: true
    },

    IdUsuario: {
        type: String,
        required: [true, "El ID del usuario es obligatorio"],
        trim: true,
        index: true
    },

    Estado: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'cuentas'
});

CuentaSchema.pre("save", async function() {
    if (!this.NumeroCuenta) {
        const hoy = new Date();
        const fecha = `${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, '0')}${String(hoy.getDate()).padStart(2, '0')}`;

        let numeroCuenta;
        let existe = true;
        let intentos = 0;
        const maxIntentos = 10;

        while (existe && intentos < maxIntentos) {
            const aleatorio = Math.floor(100000 + Math.random() * 900000);
            numeroCuenta = `NC-${fecha}-${aleatorio}`;
            existe = await model("Cuenta").findOne({ NumeroCuenta: numeroCuenta });
            intentos++;
        }

        if (existe) {
            throw new Error("No se pudo generar un número de cuenta único después de varios intentos");
        }

        this.NumeroCuenta = numeroCuenta;
    }
});

CuentaSchema.index({ NumeroCuenta: 1, Estado: 1 });
CuentaSchema.index({ IdUsuario: 1, Estado: 1 });

export const Cuenta = model("Cuenta", CuentaSchema);