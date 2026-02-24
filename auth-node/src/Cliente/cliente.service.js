import { Schema, model } from "mongoose";

const ClienteSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true
    },
    apellido: {
        type: String,
        required: [true, "El apellido es obligatorio"],
        trim: true
    },
    dpi: {
        type: String,
        required: [true, "El DPI es obligatorio"],
        unique: true,
        minlength: 13,
        maxlength: 13
    },
    telefono: {
        type: String,
        required: [true, "El teléfono es obligatorio"]
    },
    correo: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true,
        lowercase: true,
        trim: true
    },
    direccion: {
        type: String,
        required: [true, "La dirección es obligatoria"],
        trim: true
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Cliente = model("Cliente", ClienteSchema);