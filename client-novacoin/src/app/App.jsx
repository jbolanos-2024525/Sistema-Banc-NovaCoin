import { Routes, Route, Navigate } from "react-router-dom";
 
import Login from "../features/auth/pages/Login.jsx";
import Recover from "../features/auth/pages/Recover.jsx";
import { VerifyEmailPage } from "../features/auth/pages/VerifyEmailPage.jsx";
import { useAuthStore } from "../features/auth/store/authStore.js";
 
// Dashboard Admin
import { DashboardPage } from "./layouts/DashboardPage.jsx";
import { DashboardHome } from '../features/dashboard/pages/DashboardHome.jsx';
import { AccountPage } from "../features/account/pages/AccountPage.jsx"; 
import { EmployeePage } from "../features/employee/pages/EmployeePage.jsx";
import { LoanPage } from "../features/loan/pages/LoanPage.jsx";
import { TransactionsPage } from "../features/transactions/pages/TransactionsPage.jsx";
import { Users } from "../features/users/components/Users.jsx";
import { AdminAccountPage } from '../features/adminAccount/pages/AdminAccountPage.jsx';

// Dashboard Usuario
import { UserDashboardPage } from "./layouts/UserDashboardPage.jsx";
import { UserDashboardHome } from "../features/dashboard/pages/UserDashboardHome.jsx";

 
// ─── Guard genérico: requiere sesión ───────────────────────────
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};
 
// ─── Guard solo para Admin ──────────────────────────────────────
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');
  if (!isAdmin) return <Navigate to="/user" replace />;
  return children;
};
 
// ─── Guard solo para User ───────────────────────────────────────
const UserRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');
  if (isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};
 
// ─── Redirige al dashboard correcto según rol ───────────────────
const RoleRedirect = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');
  return <Navigate to={isAdmin ? '/dashboard' : '/user'} replace />;
};
 
function App() {
  return (
    <Routes>
 
      {/* ── Rutas públicas ── */}
      <Route path="/"             element={<Navigate to="/login" replace />} />
      <Route path="/login"        element={<Login />} />
      <Route path="/recover"      element={<Recover />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
 
      {/* Redirige al home correcto según rol */}
      <Route path="/home" element={
        <ProtectedRoute><RoleRedirect /></ProtectedRoute>
      } />
 
      {/* ── Dashboard Admin ── */}
      <Route path="/dashboard/*" element={
        <AdminRoute><DashboardPage /></AdminRoute>
      }>
        <Route index                  element={<DashboardHome />} />
        <Route path="accounts" element={<AdminAccountPage />} />
        <Route path="employees"       element={<EmployeePage />} />
        <Route path="loans"           element={<LoanPage />} />
        <Route path="transactions"    element={<TransactionsPage />} />
        <Route path="users"           element={<Users />} />
      </Route>
 
      {/* ── Dashboard Usuario (CORREGIDO Y CONFIGURADO) ── */}
      <Route path="/user/*" element={
        <UserRoute><UserDashboardPage /></UserRoute>
      }>
        <Route index                  element={<UserDashboardHome />} />
        <Route path="loans"           element={<LoanPage />} />
        <Route path="transactions"    element={<TransactionsPage />} />
        
        {/* 🌿 Descomentamos y apuntamos a la AccountPage dinámica que creamos en tus carpetas */}
        <Route path="account"         element={<AccountPage />} /> 
        
        {/* <Route path="security"     element={<UserSecurityPage />} /> */}
      </Route>
 
      {/* Comodín */}
      <Route path="*" element={<Navigate to="/login" replace />} />
 
    </Routes>
  );
}
 
export default App;