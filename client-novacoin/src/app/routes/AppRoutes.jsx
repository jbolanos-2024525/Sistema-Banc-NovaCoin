import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore }      from '../../features/auth/store/authStore';
import { AuthPage }          from '../../features/auth/pages/AuthPage';
import { DashboardPage }     from '../layouts/DashboardPage.jsx';
import { UserDashboardPage } from '../layouts/UserDashboardPage.jsx';
import { DashboardHome }     from '../../features/dashboard/pages/DashboardHome.jsx';
import { UserDashboardHome } from '../../features/dashboard/pages/UserDashboardHome.jsx';
import { VerifyEmailPage }   from '../../features/auth/pages/VerifyEmailPage';
import Recover               from '../../features/auth/pages/Recover';
import ResetPasswordPage     from '../../features/auth/pages/ResetPasswordPage.jsx';

// Panel Usuario
import { AccountPage }       from '../../features/account/pages/AccountPage.jsx';

// Panel Admin
import { AdminAccountPage }  from '../../features/adminAccount/pages/AdminAccountPage.jsx';
import { EmployeePage }      from '../../features/employee/pages/EmployeePage.jsx';
import { LoanPage }          from '../../features/loan/pages/LoanPage.jsx';
import { TransactionsPage }  from '../../features/transactions/pages/TransactionsPage.jsx';
import { Users }             from '../../features/users/components/Users.jsx';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login"        element={<AuthPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/recover"        element={<Recover />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Panel Administrador */}
            <Route path="/dashboard/*" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}>
                <Route index               element={<DashboardHome />} />
                <Route path="accounts"     element={<AdminAccountPage />} />
                <Route path="employees"    element={<EmployeePage />} />
                <Route path="loans"        element={<LoanPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="users"        element={<Users />} />
            </Route>

            {/* Panel Usuario */}
            <Route path="/user/*" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>}>
                <Route index               element={<UserDashboardHome />} />
                <Route path="account"      element={<AccountPage />} />
                <Route path="loans"        element={<LoanPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};