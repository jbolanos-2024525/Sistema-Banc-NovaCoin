import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

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

    Password: {
  type: String,
  required: true,
  minlength: 6,
  select: false
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
    default: false
},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Encriptar password antes de guardar
empleadoSchema.pre('save', async function () {
  if (!this.isModified('Password')) return;

  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
});

export default model('Empleado', empleadoSchema);