import logo from "../../../assets/img/logoNovacoin.png";
import shield from "../../../assets/img/shield.png";

import "../../../styles/auth.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-left">

          <img
            src={logo}
            alt="NovaCoin"
            className="logo"
          />

          <h2>
            Tu dinero,
            <br />
            tu <span>futuro.</span>
          </h2>

          <p>
            Accede a tu cuenta y administra tus
            finanzas de manera segura.
          </p>

          <img
            src={shield}
            alt="Seguridad"
            className="shield-image"
          />

        </div>

        <div className="auth-right">
          {children}
        </div>

      </div>

    </div>
  );
};

export default AuthLayout;