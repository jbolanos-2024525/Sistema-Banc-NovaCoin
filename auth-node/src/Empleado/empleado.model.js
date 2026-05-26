import { Schema, model } from 'mongoose';

const empleadoSchema = new Schema(
  {
    Nombre: {
      type: String,
      required: true,
      trim: true,
    },

    Apellido: {
      type: String,
      required: true,
      trim: true,
    },

    DPI: {
      type: String,
      required: true,
      unique: true,
      minlength: 13,
      maxlength: 13,
    },

    Correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },


    Puesto: {
      type: String,
      required: true,
    },

    Salario: {
      type: Number,
      required: true,
      min: 0,
    },

    Rol: {
      type: String,
      enum: ['Asesor', 'Cajero', 'Gerente', 'Administrador'],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model('Empleado', empleadoSchema);