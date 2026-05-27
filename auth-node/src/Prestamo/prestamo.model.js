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

    proposito:
    {
        type: String,
        trim: true,
        default: null
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
        type: String,
        required: true,
        trim: true
    },

    empleado:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empleado",
        default: null
    }
},
{ timestamps: true }
);

export default mongoose.model("Prestamo", prestamoSchema);