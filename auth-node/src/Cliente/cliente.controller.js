import {

  createCliente,
  getCliente,
  getClienteById,
  updateCliente,
  deleteCliente,

  loginCliente,
  verifyClienteEmail

} from "./cliente.service.js";

// CREAR CLIENTE
export const create = async (req, res) => {

  try {

    const cliente = await createCliente(req.body);

    res.status(201).json({
      success: true,
      message: "Cliente registrado. Revisa tu correo",
      cliente
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

// LOGIN CLIENTE
export const login = async (req, res) => {

  try {

    const {
      Correo,
      Password
    } = req.body;

    const result = await loginCliente(
      Correo,
      Password
    );

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      token: result.token,
      cliente: result.cliente
    });

  } catch (error) {

    res.status(401).json({
      success: false,
      message: error.message
    });

  }

};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {

  try {

    await verifyClienteEmail(
      req.params.token
    );

    res.status(200).json({
      success: true,
      message: "Correo verificado correctamente"
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

// OBTENER TODOS
export const getAll = async (req, res) => {

  try {

    const clientes = await getCliente();

    res.status(200).json({
      success: true,
      clientes
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// OBTENER POR ID
export const getById = async (req, res) => {

  try {

    const cliente = await getClienteById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      cliente
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};

// ACTUALIZAR
export const update = async (req, res) => {

  try {

    const cliente = await updateCliente(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Cliente actualizado correctamente",
      cliente
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

// ELIMINAR
export const remove = async (req, res) => {

  try {

    const cliente = await deleteCliente(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Cliente eliminado correctamente",
      cliente
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};