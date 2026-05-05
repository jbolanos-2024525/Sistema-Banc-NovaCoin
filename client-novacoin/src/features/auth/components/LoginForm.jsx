import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export const LoginForm = ({ onForgot }) => {
    const [formData, setFormData] = useState({ emailOrUsername: '', password: '' });
    const login = useAuthStore((state) => state.login);
    const { loading, error } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData);
        
        if (result.success) {
            window.location.href = '/dashboard';
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
                type="text" 
                placeholder="Usuario o Email" 
                className="input-auth" 
                onChange={(e) => setFormData({...formData, emailOrUsername: e.target.value})} 
                required
            />
            <input 
                type="password" 
                placeholder="Contraseña" 
                className="input-auth"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required
            />
            
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                <span 
                    onClick={onForgot} 
                    style={{ 
                        color: 'var(--dorado-principal)', 
                        cursor: 'pointer', 
                        fontSize: '14px',
                        textDecoration: 'underline' 
                    }}
                >
                    ¿Olvidaste tu contraseña?
                </span>
            </div>

            <button 
                type="submit" 
                className="btn-login" 
                disabled={loading}
            >
                {loading ? 'Validando...' : 'Iniciar Sesión'}
            </button>

            {error && (
                <p style={{ 
                    color: '#ff4d4d', 
                    fontSize: '14px', 
                    textAlign: 'center', 
                    marginTop: '10px',
                    backgroundColor: 'rgba(255,0,0,0.1)',
                    padding: '5px',
                    borderRadius: '4px'
                }}>
                    {error}
                </p>
            )}
        </form>
    );
};