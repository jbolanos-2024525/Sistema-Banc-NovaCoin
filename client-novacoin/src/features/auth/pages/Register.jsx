import { Link } from "react-router-dom";

import "../../../styles/register.css";

import logo from "../../../assets/img/logo2.png";

import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
} from "react-icons/fa";

import { IoEyeOutline } from "react-icons/io5";

const Register = () => {
  return (
    <div className="register-page">

      <div className="register-card">

        {/* LOGO */}

        <img
          src={logo}
          alt="NovaCoin"
          className="register-logo"
        />

        {/* TEXT */}

        <span className="register-subtitle">
          Crea tu cuenta
        </span>

        <h2>
          Regístrate
        </h2>

        {/* NOMBRE */}

        <div className="register-group">

          <label>
            Nombre completo
          </label>

          <div className="register-input">

            <FaUser className="input-icon" />

            <input
              type="text"
              placeholder="Ingresa tu nombre completo"
            />

          </div>

        </div>

        {/* EMAIL */}

        <div className="register-group">

          <label>
            Correo electrónico
          </label>

          <div className="register-input">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              placeholder="ejemplo@correo.com"
            />

          </div>

        </div>

        {/* TELEFONO */}

        <div className="register-group">

          <label>
            Número de teléfono
          </label>

          <div className="register-input">

            <FaPhoneAlt className="input-icon" />

            <input
              type="text"
              placeholder="+502 1234 5678"
            />

          </div>

        </div>

        {/* PASSWORD */}

        <div className="register-group">

          <label>
            Contraseña
          </label>

          <div className="register-input">

            <FaLock className="input-icon" />

            <input
              type="password"
              placeholder="********"
            />

            <IoEyeOutline className="eye-icon" />

          </div>

        </div>

        {/* CONFIRM PASSWORD */}

        <div className="register-group">

          <label>
            Confirmar contraseña
          </label>

          <div className="register-input">

            <FaLock className="input-icon" />

            <input
              type="password"
              placeholder="********"
            />

            <IoEyeOutline className="eye-icon" />

          </div>

        </div>

        {/* TERMS */}

        <div className="terms-box">

          <input type="checkbox" />

          <p>
            Acepto los{" "}

            <span>
              Términos y Condiciones
            </span>

            <br />

            y la{" "}

            <span>
              Política de Privacidad
            </span>

          </p>

        </div>

        {/* BUTTON */}

        <button className="register-btn">
          Crear cuenta
        </button>

        {/* LOGIN */}

        <p className="register-login">

          ¿Ya tienes una cuenta?{" "}

          <Link to="/">
            Inicia sesión
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Register;