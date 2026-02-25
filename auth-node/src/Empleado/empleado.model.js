import { Schema, model } from 'mongoose';

const empleadoSchema = new Schema(
  {
    Nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minLength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxLength: [100, 'El nombre no puede exceder los 100 caracteres'],
    },
    Apellido: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true,
      minLength: [2, 'El apellido debe tener al menos 2 caracteres'],
      maxLength: [100, 'El apellido no puede exceder los 100 caracteres'],
    },
    DPI: {
      type: String,
      required: [true, 'El DPI es obligatorio'],
      unique: true,
      minLength: [13, 'El DPI debe tener 13 dígitos'],
      maxLength: [13, 'El DPI debe tener 13 dígitos'],
    },
    Puesto: {
      type: String,
      required: [true, 'El puesto es obligatorio'],
      trim: true,
      minLength: [2, 'El puesto debe tener al menos 2 caracteres'],
      maxLength: [100, 'El puesto no puede exceder los 100 caracteres'],
    },
    Salario: {
      type: Number,
      required: [true, 'El salario es obligatorio'],
      min: [0, 'El salario no puede ser negativo'],
      validate: {
        validator: Number.isFinite,
        message: 'El salario debe ser un número válido',
      },
    },
    Rol: {
      type: String,
      required: [true, 'El rol es obligatorio'],
      enum: {
        values: ['Asesor', 'Cajero', 'Gerente', 'Administrador'],
        message: 'Rol no válido',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

empleadoSchema.index({ isActive: 1 });
empleadoSchema.index({ Nombre: 1 });
empleadoSchema.index({ isActive: 1, Nombre: 1 });

export default model('Empleado', empleadoSchema);