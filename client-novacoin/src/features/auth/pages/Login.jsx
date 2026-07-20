import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword]               = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [rememberMe, setRememberMe]           = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState("");

  // ✅ Ahora también tomamos login
  const { login } = useAuthStore();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await login({ emailOrUsername, password });
      
      if (!result.success) {
        setError(result.error || "Credenciales incorrectas");
        return;
      }

      // ✅ Redirigir según rol
      const user    = useAuthStore.getState().user;
      const isAdmin = user?.role === 'ADMIN-ROLE' || user?.roles?.includes('ADMIN-ROLE');
      navigate(isAdmin ? '/dashboard' : '/user', { replace: true });

    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <span className="welcome-text">Bienvenido de vuelta</span>
        <h2>Inicia sesión</h2>

        {error && (
          <p style={{ color: "red", fontSize: "0.875rem", marginBottom: "8px" }}>
            {error}
          </p>
        )}

        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="text"
            placeholder="Usuario o correo"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {showPassword
            ? <IoEyeOffOutline className="eye-icon" onClick={() => setShowPassword(false)} />
            : <IoEyeOutline    className="eye-icon" onClick={() => setShowPassword(true)}  />
          }
        </div>

        <div className="auth-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Recordarme
          </label>
          <Link to="/recover">¿Olvidaste tu contraseña?</Link>
        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Iniciando..." : "Iniciar sesión"}
        </button>
      </div>
    </AuthLayout>
  );
};

export default Login;