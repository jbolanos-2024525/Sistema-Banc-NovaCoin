import { create } from 'zustand';

// URL exacta acoplada con el prefijo de tu app.js de Node
const API_URL = 'http://localhost:3020/NovaCoin/Admin/v1/empleados';

export const useEmployeeStore = create((set, get) => ({
  employees: [],
  loading: false,
  error: null,

  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'x-token': token || ''
        }
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudo obtener la lista de empleados`);
      }

      const json = await res.json();
      if (json.success) {
        const dataArray = json.data || [];
        // Filtra para mostrar solo los empleados que sigan activos
        const activos = dataArray.filter(emp => emp.isActive !== false);
        set({ employees: activos, loading: false });
      } else {
        set({ error: json.message || 'Error desconocido', loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createEmployee: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      
      // 🔥 LIMPIEZA PREVENTIVA: Elimina la propiedad Password si viaja vacía desde el formulario
      const cleanData = { ...data };
      if (cleanData.hasOwnProperty('Password')) {
        delete cleanData.Password;
      }

      const res = await fetch(API_URL, { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'x-token': token || ''
        },
        body: JSON.stringify(cleanData),
      });

      // 🔥 MANEJO DE ERROR OPTIMIZADO (Línea 46): Lee el cuerpo del error 400 de forma segura
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.message || `Error ${res.status} al crear empleado`);
      }

      const json = await res.json();
      if (json.success) {
        await get().fetchEmployees(); 
        return { success: true };
      }
      return { success: false, error: json.message };
    } catch (err) {
      // Retorna el error real del backend para que lo pinte la UI o la consola
      return { success: false, error: err.message };
    } finally {
      set({ loading: false });
    }
  },

  updateEmployee: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      
      const cleanData = { ...data };
      if (cleanData.hasOwnProperty('Password')) {
        delete cleanData.Password;
      }

      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'x-token': token || ''
        },
        body: JSON.stringify(cleanData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Error ${res.status} al actualizar`);
      }

      const json = await res.json();
      if (json.success) {
        await get().fetchEmployees();
        return { success: true };
      }
      return { success: false, error: json.message };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      set({ loading: false });
    }
  },

  deleteEmployeeSoft: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'x-token': token || ''
        },
        body: JSON.stringify({ isActive: false }), 
      });

      if (!res.ok) throw new Error(`Error ${res.status} al eliminar`);

      const json = await res.json();
      if (json.success) {
        // Al ponerse en isActive: false, fetchEmployees lo filtrará automáticamente de la tabla
        await get().fetchEmployees();
        return { success: true };
      }
      return { success: false, error: json.message };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      set({ loading: false });
    }
  },
}));