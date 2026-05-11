import { useState } from 'react'
import heroImg from '../assets/img/hero.png'

import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import Recover from "../features/auth/pages/Recover.jsx";
import { DashboardPage } from "./layouts/DashboardPage.jsx";
import { DashboardHome } from '../features/dashboard/pages/DashboardHome.jsx';
import { AccountPage } from "../features/account/pages/AccountPage.jsx";
import { CustomerPage } from "../features/customer/pages/CustomerPage.jsx";
import { EmployeePage } from "../features/employee/pages/EmployeePage.jsx";
import { LoanPage } from "../features/loan/pages/LoanPage.jsx";
import { TransactionsPage } from "../features/transactions/pages/TransactionsPage.jsx";
import { Users } from "../features/users/components/Users.jsx";
import { useAuthStore } from "../features/auth/store/authStore.js";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [count, setCount] = useState(0)

  const Home = () => (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} width="170" height="179" alt="" />
        </div>
        <h1>Home</h1>
      </section>
    </>
  );

  return (
    <Routes>

      {/* Rutas públicas */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="/home" element={<Home />} />

      {/* Dashboard protegido */}
      <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          {/* Esta es la clave: el atributo 'index' */}
          <Route index element={<DashboardHome />} /> 
          
          <Route path="accounts"     element={<AccountPage />} />
          <Route path="customers"    element={<CustomerPage />} />
          <Route path="employees"    element={<EmployeePage />} />
          <Route path="loans"        element={<LoanPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="users"        element={<Users />} />
        </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

export default App