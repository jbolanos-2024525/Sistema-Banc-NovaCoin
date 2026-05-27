import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  Headphones,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import logo from "../../../assets/img/logo2.png";
import { resetPasswordRequest } from "../../../shared/apis/authService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotification(null);

    if (!newPassword.trim()) {
      setError("La nueva contraseña es requerida.");
      return;
    }
    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!token) {
      setNotification({
        type: "error",
        message: "El enlace no es válido o ha expirado. Solicita uno nuevo.",
      });
      return;
    }

    setLoading(true);
    try {
      await resetPasswordRequest(token, newPassword);
      setNotification({
        type: "success",
        message:
          "¡Contraseña restablecida exitosamente! Serás redirigido al inicio de sesión.",
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "El enlace ha expirado o no es válido. Solicita uno nuevo.";
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

      <span className="recover-subtitle">Restablecer contraseña</span>

      <h1>Crea una nueva contraseña</h1>

      {/* ICON */}
      <div className="recover-image">
        <div className="mail-circle">
          <Lock size={70} strokeWidth={1.8} />
        </div>
      </div>

      <p className="recover-text">
        Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
      </p>

      {/* FORM */}
      <form className="recover-form" onSubmit={handleSubmit}>

        <label>Nueva contraseña</label>
        <div className="recover-input-group" style={{ position: "relative" }}>
          <Lock size={18} />
          <input
            type={showNew ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <span
            onClick={() => setShowNew((v) => !v)}
            style={{ cursor: "pointer", position: "absolute", right: "12px" }}
          >
            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <label style={{ marginTop: "12px" }}>Confirmar contraseña</label>
        <div className="recover-input-group" style={{ position: "relative" }}>
          <Lock size={18} />
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <span
            onClick={() => setShowConfirm((v) => !v)}
            style={{ cursor: "pointer", position: "absolute", right: "12px" }}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {error && (
          <div
            style={{ color: "#dc2626", marginTop: "8px", fontSize: "0.88rem" }}
          >
            {error}
          </div>
        )}

        <button
          className="recover-btn"
          type="submit"
          disabled={loading || notification?.type === "success"}
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                style={{ animation: "spin 1s linear infinite" }}
              />
              Guardando...
            </>
          ) : (
            <>
              Restablecer contraseña
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

export default ResetPassword;   