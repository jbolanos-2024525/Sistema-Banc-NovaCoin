import { create } from 'zustand';

export const useAccountStore = create((set) => ({
  // Datos del usuario logueado actualmente (Simulado para jmendez)
  user: {
    Nombre: "Gerardo",
    Apellido: "Méndez",
    NombreUsuario: "jmendez",
    Email: "jmendez-2024055@kinal.edu.gt",
    Telefono: "59887744"
  },
  
  // Función para actualizar los datos cuando conectes el Login real
  setUser: (userData) => set({ user: userData }),
  
  // Función para cerrar sesión
  logoutUser: () => set({ user: null })
}));