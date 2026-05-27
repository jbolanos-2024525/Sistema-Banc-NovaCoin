import React, { useEffect, useState } from "react";
import { Account } from "../components/Account";
import { useAccountStore } from "../store/accountStore"; 
import { useAuthStore } from "../../auth/store/authStore.js";
import { axiosAuth } from "../../../shared/apis/api.js"; 

export const AccountPage = () => {
    const { cuentas, fetchMisCuentas, formatCurrency } = useAccountStore();
    const tokenUser = useAuthStore((state) => state.user); 
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatosNovaCoin = async () => {
            try {
                // Ejecutamos ambas peticiones en paralelo para no bloquear la carga
                await Promise.all([
                    // 1. Carga las cuentas bancarias en tu store de Zustand
                    fetchMisCuentas(),
                    
                    // 2. Trae el perfil detallado desde el AuthController de .NET
                    axiosAuth.get("/auth/profile").then((response) => {
                        // 🌟 ¡LOG DE CONTROL AQUÍ! 
                        // Abre la consola del navegador para inspeccionar este objeto.
                        console.log("ESTRUCTURA DE RESPUESTA DE .NET:", response.data);

                        if (response.data && response.data.data) {
                            setDbUser(response.data.data);
                        } else if (response.data) {
                            setDbUser(response.data);
                        }
                    })
                ]);
            } catch (error) {
                console.error("Error al sincronizar los datos de NovaCoin:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarDatosNovaCoin();
    }, [fetchMisCuentas]);

    // Combinamos la información: Prioridad datos de la base de datos, respaldo token
    const usuarioFinal = dbUser || tokenUser;

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", color: "#00f2fe", fontFamily: "sans-serif" }}>
                <p style={{ letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "12px" }}>
                    Sincronizando cuentas con NovaCoin...
                </p>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", backgroundColor: "#0b111e", minHeight: "100vh" }}>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: "0 0 4px 0" }}>Mi Cuenta Bancaria</h1>
                <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
                    Visualiza el estado financiero de tu perfil en <span style={{ color: "#00f2fe", fontWeight: "600" }}>NovaCoin</span>.
                </p>
            </div>

            <Account 
                user={usuarioFinal} 
                cuentas={cuentas} 
                formatCurrency={formatCurrency} 
            />
        </div>
    );
};