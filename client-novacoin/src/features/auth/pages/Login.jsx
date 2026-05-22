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

  // ✅ Ahora también tomamos setUser
  const { setTokens, setUser } = useAuthStore();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5262/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await response.json();
      console.log('USER DETAILS:', data.userDetails);


      if (!response.ok || !data.success) {
        setError(data.message || "Credenciales incorrectas");
        return;
      }

      // Guardar en storage si marcó "Recordarme"
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("accessToken",  data.accessToken);
      storage.setItem("refreshToken", data.refreshToken);
      storage.setItem("user",         JSON.stringify(data.userDetails));

      // ✅ Guardar tokens Y user en el store
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.userDetails);

      // ✅ Redirigir según rol
      const user    = data.userDetails;
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