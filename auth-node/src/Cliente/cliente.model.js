import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const ClienteSchema = new Schema(
  {
    Nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: [50, "El nombre no puede exceder 50 caracteres"]
    },

    Apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
      maxlength: [50, "El apellido no puede exceder 50 caracteres"]
    },

    dpi: {
      type: String,
      required: [true, "El DPI es obligatorio"],
      unique: true,
      match: [/^\d{13}$/, "El DPI debe tener exactamente 13 dígitos"]
    },

    Telefono: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      match: [/^\d{8,15}$/, "El teléfono debe contener entre 8 y 15 dígitos"]
    },

    Correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Ingrese un correo electrónico válido"
      ]
    },

    Password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener mínimo 6 caracteres"],
      select: false
    },

    Rol: {
      type: String,
      default: "Cliente"
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    Direccion: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      trim: true,
      maxlength: [200, "La dirección no puede exceder 200 caracteres"]
    },

    Estado: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// ENCRIPTAR PASSWORD
ClienteSchema.pre("save", async function () {

    if (!this.isModified("Password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.Password = await bcrypt.hash(
        this.Password,
        salt
    );

});

export const Cliente = model("Cliente", ClienteSchema);