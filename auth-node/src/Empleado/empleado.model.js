import { Schema, model } from 'mongoose';
import crypto from 'crypto';

const empleadoSchema = new Schema(
  {
    Nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },

    Apellido: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true,
      minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
      maxlength: [50, 'El apellido no puede exceder 50 caracteres']
    },

    DPI: {
      type: String,
      required: [true, 'El DPI es obligatorio'],
      unique: true,
      trim: true,
      minlength: [13, 'El DPI debe tener 13 caracteres'],
      maxlength: [13, 'El DPI debe tener 13 caracteres'],
      match: [/^\d{13}$/, 'El DPI debe contener solo 13 dígitos'],
      index: true
    },

    Correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'El correo electrónico no es válido'],
      index: true
    },

    Telefono: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
      match: [/^\d{8}$/, 'El teléfono debe contener 8 dígitos']
    },

    Puesto: {
      type: String,
      required: [true, 'El puesto es obligatorio'],
      enum: {
        values: ['Asesor', 'Cajero', 'Gerente', 'Administrador'],
        message: 'Puesto no válido. Debe ser Asesor, Cajero, Gerente o Administrador'
      },
      trim: true
    },

    Salario: {
      type: Number,
      required: [true, 'El salario es obligatorio'],
      min: 0,
      validate: {
        validator: Number.isFinite,
        message: 'El salario debe ser un número válido'
      }
    },

    Rol: {
      type: String,
      enum: {
        values: ['Asesor', 'Cajero', 'Gerente', 'Administrador'],
        message: 'Rol no válido'
      },
      required: [true, 'El rol es obligatorio'],
      default: 'Cajero'
    },

    FechaContratacion: {
      type: Date,
      default: Date.now
    },

    Estado: {
      type: String,
      enum: {
        values: ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'],
        message: 'Estado no válido'
      },
      default: 'ACTIVO',
      uppercase: true
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    isVerified: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'empleados'
  }
);

empleadoSchema.index({ DPI: 1, Estado: 1 });
empleadoSchema.index({ Correo: 1, Estado: 1 });

export default model('Empleado', empleadoSchema);