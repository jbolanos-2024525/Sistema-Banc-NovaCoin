import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

import {
  FaEnvelope,
  FaLock
} from "react-icons/fa";

import { IoEyeOutline } from "react-icons/io5";

const Login = () => {
  return (
    <AuthLayout>
      <div className="auth-card">

        <span className="welcome-text">
          Bienvenido de vuelta
        </span>

        <h2>Inicia sesión</h2>

        <div className="input-group">
          <FaEnvelope className="input-icon" />

          <input
            type="email"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />

          <input
            type="password"
            placeholder="********"
          />

          <IoEyeOutline className="eye-icon" />
        </div>

        <div className="auth-options">

          <label>
            <input type="checkbox" />
            Recordarme
          </label>

          <Link to="/recover">
            ¿Olvidaste tu contraseña?
          </Link>

        </div>

        <button className="login-btn">
          Iniciar sesión
        </button>

        <div className="divider">
         
        </div>

       
        <p className="register-text">
          ¿No tienes una cuenta?{" "}

          <Link to="/register">
            Regístrate
          </Link>
        </p>

      </div>
    </AuthLayout>
  );
};

export default Login;