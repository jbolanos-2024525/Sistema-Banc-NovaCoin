import mongoose from "mongoose";

const prestamoSchema = new mongoose.Schema(
{
    tipoPrestamo:
    {
        type: String,
        enum: ["PERSONAL", "HIPOTECARIO", "VEHICULAR"],
        required: true
    },

    monto:
    {
        type: Number,
        required: true,
        min: 1
    },

    tasaInteres:
    {
        type: Number,
        default: 12
    },

    plazoMeses:
    {
        type: Number,
        required: true,
        min: 1
    },

    cuotaMensual:
    {
        type: Number
    },

    montoPendiente:
    {
        type: Number
    },

    totalPagado:
    {
        type: Number,
        default: 0
    },

    numeroCuotasPagadas:
    {
        type: Number,
        default: 0
    },

    estadoPrestamo:
    {
        type: String,
        enum: ["ACTIVO", "PAGADO", "VENCIDO", "CANCELADO"],
        default: "ACTIVO"
    },

    cliente:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true
    },

    empleado:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empleado",
        required: true
    }
},
{ timestamps: true }
);

export default mongoose.model("Prestamo", prestamoSchema);