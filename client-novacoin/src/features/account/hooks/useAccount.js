import { useState } from 'react';
import { useAccountStore } from '../store/accountStore'; // Revisa que la ruta apunte correctamente a tu carpeta store

export const useAccount = () => {
  const { user, setUser, logoutUser } = useAccountStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // FUNCIÓN INTERNA: Generar datos bancarios únicos usando el Nombre de Usuario o Email
  const generarDatosBancarios = (usuario) => {
    if (!usuario) {
      return {
        numeroCuenta: "0000-0000-0000-0000",
        saldoSimulado: 0,
        tipoCuenta: "Cuenta Bancaria",
        estado: "Inactiva",
        fechaApertura: "--/--/----"
      };
    }

    // Convertimos el string del username a una semilla numérica fija
    const semillaTexto = usuario.NombreUsuario || usuario.Email || "usuario";
    let codigoNumerico = 0;
    for (let i = 0; i < semillaTexto.length; i++) {
      codigoNumerico += semillaTexto.charCodeAt(i);
    }

    // Estructuramos un número de cuenta y saldo fijo pero único para él
    const parte1 = (codigoNumerico * 3).toString().padEnd(4, '7').substring(0, 4);
    const parte2 = (codigoNumerico * 7).toString().padEnd(4, '2').substring(0, 4);
    const parte3 = usuario.Telefono ? usuario.Telefono.substring(0, 4) : "8891";
    const numeroCuenta = `4509-${parte1}-${parte2}-${parte3}`;
    
    const saldoSimulado = (codigoNumerico * 15.5) + 1250.25; 
    const esPar = semillaTexto.length % 2 === 0;
    const tipoCuenta = esPar ? "Cuenta de Ahorro Monetario" : "Cuenta Corriente Premium";

    return {
      numeroCuenta,
      saldoSimulado,
      tipoCuenta,
      estado: "Activa",
      fechaApertura: "12/02/2025"
    };
  };

  const datosBancarios = generarDatosBancarios(user);

  // Formateador de moneda local (Quetzales de Guatemala 🇬🇹)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-GT', { 
      style: 'currency', 
      currency: 'GTQ' 
    }).format(amount || 0);
  };

  return {
    user,
    datosBancarios,
    isLoading,
    error,
    formatCurrency,
    setUser,
    logoutUser
  };
};