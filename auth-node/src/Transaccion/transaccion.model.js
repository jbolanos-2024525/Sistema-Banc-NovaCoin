import { Schema, model } from "mongoose";

const TransaccionSchema = new Schema({

    TipoTransaccion: {
        type: String,
        required: true,
        enum: [
            "DEPOSITO",
            "RETIRO",
            "TRANSFERENCIA"
        ],
        uppercase: true
    },

    CuentaOrigen: {
        type: Schema.Types.ObjectId,
        ref: "Cuenta"
    },

    CuentaDestino: {
        type: Schema.Types.ObjectId,
        ref: "Cuenta"
    },

    Monto: {
        type: Number,
        required: true,
        min: [1, "El monto debe ser mayor a 0"]
    },

    Moneda: {
        type: String,
        enum: ["GTQ", "USD"],
        default: "GTQ",
        uppercase: true
    },

    Descripcion: {
        type: String,
        trim: true,
        maxlength: [200, "Máximo 200 caracteres"]
    },

    Estado: {
        type: String,
        enum: [
            "COMPLETADA",
            "PENDIENTE",
            "RECHAZADA"
        ],
        default: "COMPLETADA",
        uppercase: true
    }

}, {

    timestamps: true,
    versionKey: false

});

export const Transaccion = model(
    "Transaccion",
    TransaccionSchema
);