import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Lock,
  Headphones,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

import logo from "../../../assets/img/logo2.png";
import { forgotPasswordRequest } from "../../../shared/apis/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);
    setError("");

    if (!email.trim()) {
      setError("El correo electrónico es requerido.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    try {
      await forgotPasswordRequest(email);
      setNotification({
        type: "success",
        message: `Se ha enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada.`,
      });
      setEmail("");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "No se pudo enviar el correo. Intenta de nuevo más tarde.";
      setNotification({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recover-card">

      {/* NOTIFICACIÓN BANNER */}
      {notification && (
        <div
          className={`recover-notification ${notification.type}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "18px",
            fontSize: "0.92rem",
            lineHeight: "1.45",
            fontWeight: 500,
            backgroundColor:
              notification.type === "success" ? "#ecfdf5" : "#fef2f2",
            color:
              notification.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${
              notification.type === "success" ? "#6ee7b7" : "#fca5a5"
            }`,
          }}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} style={{ flexShrink: 0, marginTop: "1px", color: "#059669" }} />
          ) : (
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "1px", color: "#dc2626" }} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* LOGO */}
      <div className="recover-logo">
        <img src={logo} alt="Novacoin Logo" />
      </div>

      <span className="recover-subtitle">Recuperar contraseña</span>

      <h1>¿Olvidaste tu contraseña?</h1>

      {/* ICON */}
      <div className="recover-image">
        <div className="mail-circle">
          <Mail size={70} strokeWidth={1.8} />
        </div>
      </div>

      <p className="recover-text">
        No te preocupes, sucede. Ingresa tu correo electrónico
        y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      {/* FORM */}
      <form className="recover-form" onSubmit={handleSubmit}>

        <label>Correo electrónico</label>

        <div className="recover-input-group">
          <Mail size={18} />
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && (
          <div
            className="error-message"
            style={{ color: "#dc2626", marginTop: "8px", fontSize: "0.88rem" }}
          >
            {error}
          </div>
        )}

        <button className="recover-btn" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={18} className="spin" style={{ animation: "spin 1s linear infinite" }} />
              Enviando...
            </>
          ) : (
            <>
              Enviar enlace de recuperación
              <ArrowRight size={18} />
            </>
          )}
        </button>

      </form>

      <button className="back-login" onClick={() => navigate("/login")}>
        ← Volver al inicio de sesión
      </button>

      {/* FOOTER */}
      <div className="recover-footer">
        <div className="footer-item">
          <ShieldCheck size={28} />
          <h4>Seguro</h4>
          <p>Protegemos tu información con los más altos estándares.</p>
        </div>
        <div className="footer-item">
          <Lock size={28} />
          <h4>Privado</h4>
          <p>Tu información está siempre encriptada.</p>
        </div>
        <div className="footer-item">
          <Headphones size={28} />
          <h4>Soporte 24/7</h4>
          <p>Estamos aquí para ayudarte siempre.</p>
        </div>
      </div>

    </div>
  );
};

export default ForgotPassword;