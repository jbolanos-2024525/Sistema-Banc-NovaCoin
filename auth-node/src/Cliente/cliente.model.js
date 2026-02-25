import { Schema, model } from "mongoose";

const ClienteSchema = new Schema({
    Nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true
    },
    Apellido: {
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
    Telefono: {
        type: String,
        required: [true, "El teléfono es obligatorio"]
    },
    Correo: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true,
        lowercase: true,
        trim: true
    },
    Direccion: {
        type: String,
        required: [true, "La dirección es obligatoria"],
        trim: true
    },
    Estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Cliente = model("Cliente", ClienteSchema);