import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Lock,
  Headphones
} from "lucide-react";

import logo from "../../../assets/img/logo2.png";

const ForgotPassword = () => {
  return (
    <div className="recover-card">

      {/* LOGO */}
      <div className="recover-logo">
        <img src={logo} alt="Novacoin Logo" />
      </div>

      <span className="recover-subtitle">
        Recuperar contraseña
      </span>

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
      <form className="recover-form">

        <label>Correo electrónico</label>

        <div className="input-group">
          <Mail size={18} />
          <input
            type="email"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <button className="recover-btn">
          Enviar enlace de recuperación
          <ArrowRight size={18} />
        </button>

      </form>

      <button className="back-login">
        ← Volver al inicio de sesión
      </button>

      {/* FOOTER */}
      <div className="recover-footer">

        <div className="footer-item">
          <ShieldCheck size={28} />
          <h4>Seguro</h4>
          <p>
            Protegemos tu información con los más altos estándares.
          </p>
        </div>

        <div className="footer-item">
          <Lock size={28} />
          <h4>Privado</h4>
          <p>
            Tu información está siempre encriptada.
          </p>
        </div>

        <div className="footer-item">
          <Headphones size={28} />
          <h4>Soporte 24/7</h4>
          <p>
            Estamos aquí para ayudarte siempre.
          </p>
        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;