import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import { AuthPage } from '../../features/auth/pages/AuthPage';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { DashboardHome } from '../../features/dashboard/pages/DashboardHome.jsx';

import { AccountPage } from '../../features/account/pages/AccountPage.jsx';
import { CustomerPage } from '../../features/customer/pages/CustomerPage.jsx';
import { EmployeePage } from '../../features/employee/pages/EmployeePage.jsx';
import { LoanPage } from '../../features/loan/pages/LoanPage.jsx';
import { TransactionsPage } from '../../features/transactions/pages/TransactionsPage.jsx';
import { Users } from '../../features/users/components/Users.jsx';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        
        <Route path="accounts"     element={<AccountPage />} />
        <Route path="customers"    element={<CustomerPage />} />
        <Route path="employees"    element={<EmployeePage />} />
        <Route path="loans"        element={<LoanPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="users"        element={<Users />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};