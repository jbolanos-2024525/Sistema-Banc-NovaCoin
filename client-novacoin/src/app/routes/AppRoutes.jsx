
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import AuthPage from '../../features/auth/pages/AuthPage.jsx';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    
    if (!isAuthenticated) {
        return <Navigate to="./Login" replace />;
    }
    return children;
};

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<AuthPage />} />

            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <div style={{ 
                            backgroundColor: '#0a0a0a', 
                            color: 'white', 
                            minHeight: '100vh', 
                            padding: '40px',
                            fontFamily: 'sans-serif' 
                        }}>
                            <h1 style={{ color: '#d4af37', letterSpacing: '2px' }}>
                                SISTEMA BANCARIO NOVACOIN
                            </h1>
                            <hr style={{ borderColor: '#d4af37', opacity: 0.3 }} />
                            <p style={{ marginTop: '20px', fontSize: '18px' }}>
                                Panel de Control Administrativo
                            </p>
                        </div>
                    </ProtectedRoute>
                } 
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};