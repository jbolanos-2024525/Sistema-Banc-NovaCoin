import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../../styles/register.css";

import logo from "../../../assets/img/logo2.png";
import { registerRequest } from "../../../shared/apis/authService";

import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
} from "react-icons/fa";

import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const PASSWORD_MIN_LENGTH = 6;

const validateRegister = ({ fullName, email, phone, password, passwordConfirm, termsAccepted }) => {
  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = "El nombre completo es obligatorio.";
  }

  if (!email.trim()) {
    errors.email = "El correo es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Ingresa un correo válido.";
  }

  if (!phone.trim()) {
    errors.phone = "El teléfono es obligatorio.";
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }

  if (!passwordConfirm) {
    errors.passwordConfirm = "Confirma tu contraseña.";
  } else if (password !== passwordConfirm) {
    errors.passwordConfirm = "Las contraseñas no coinciden.";
  }

  if (!termsAccepted) {
    errors.termsAccepted = "Debes aceptar los términos y condiciones.";
  }

  return errors;
};

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    termsAccepted: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const errors = validateRegister(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      await registerRequest({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      });
      setLoading(false);

      navigate("/login");
    } catch (err) {
      setLoading(false);
      setApiError(err.response?.data?.message || "Error al crear la cuenta.");
    }
  };

  const inputStyle = (field) => ({
    borderColor: fieldErrors[field] ? "#ff4d4d" : "#dbe3ee",
  });

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

        {/* FORM */}
        <form onSubmit={handleSubmit} noValidate>

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
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                style={inputStyle("fullName")}
                disabled={loading}
              />

            </div>

            {fieldErrors.fullName && (
              <p className="register-error">⚠ {fieldErrors.fullName}</p>
            )}

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
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={inputStyle("email")}
                disabled={loading}
              />

            </div>

            {fieldErrors.email && (
              <p className="register-error">⚠ {fieldErrors.email}</p>
            )}

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
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                style={inputStyle("phone")}
                disabled={loading}
              />

            </div>

            {fieldErrors.phone && (
              <p className="register-error">⚠ {fieldErrors.phone}</p>
            )}

          </div>

          {/* PASSWORD */}

          <div className="register-group">

            <label>
              Contraseña
            </label>

            <div className="register-input">

              <FaLock className="input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                style={inputStyle("password")}
                disabled={loading}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOffOutline className="eye-icon" /> : <IoEyeOutline className="eye-icon" />}
              </button>

            </div>

            {fieldErrors.password && (
              <p className="register-error">⚠ {fieldErrors.password}</p>
            )}

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="register-group">

            <label>
              Confirmar contraseña
            </label>

            <div className="register-input">

              <FaLock className="input-icon" />

              <input
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="********"
                value={formData.passwordConfirm}
                onChange={(e) => handleChange("passwordConfirm", e.target.value)}
                style={inputStyle("passwordConfirm")}
                disabled={loading}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              >
                {showPasswordConfirm ? <IoEyeOffOutline className="eye-icon" /> : <IoEyeOutline className="eye-icon" />}
              </button>

            </div>

            {fieldErrors.passwordConfirm && (
              <p className="register-error">⚠ {fieldErrors.passwordConfirm}</p>
            )}

          </div>

          {/* TERMS */}

          <div className="terms-box">

            <input 
              type="checkbox" 
              checked={formData.termsAccepted}
              onChange={(e) => handleChange("termsAccepted", e.target.checked)}
              disabled={loading}
            />

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

          {fieldErrors.termsAccepted && (
            <p className="register-error">⚠ {fieldErrors.termsAccepted}</p>
          )}

          {/* BUTTON */}

          <button 
            type="submit" 
            className="register-btn"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          {apiError && (
            <p className="register-error">⚠ {apiError}</p>
          )}

        </form>

        {/* LOGIN */}

        <p className="register-login">

          ¿Ya tienes una cuenta?{" "}

          <Link to="/login">
            Inicia sesión
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Register;
