const mongoose = require("mongoose");

const empleadoSchema = new mongoose.Schema(
{
    IdEmpleado: {
        type: Number,
        required: [true, "El IdEmpleado es obligatorio"],
        unique: true
    },

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

    DPI: {
        type: String,
        required: [true, "El DPI es obligatorio"],
        unique: true,
        minlength: [13, "El DPI debe tener 13 dígitos"],
        maxlength: [13, "El DPI debe tener 13 dígitos"]
    },

    Puesto: {
        type: String,
        required: [true, "El puesto es obligatorio"],
        trim: true
    },

    Salario: {
        type: Number,
        required: [true, "El salario es obligatorio"],
        min: [0, "El salario no puede ser negativo"]
    },

    Rol: {
        type: String,
        required: true,
        enum: {
            values: ["Asesor", "Cajero", "Gerente", "Administrador"],
            message: "Rol no válido"
        }
    }
},
{
    timestamps: true,
    versionKey: false
}
);

empleadoSchema.methods.toJSON = function () {
    const { _id, ...empleado } = this.toObject();
    empleado.uid = _id;
    return empleado;
};

module.exports = mongoose.model("Empleado", empleadoSchema);