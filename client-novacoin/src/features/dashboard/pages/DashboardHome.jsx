import React from 'react';
import { FiUsers, FiCreditCard, FiRepeat, FiActivity } from 'react-icons/fi';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

const weeklyData = [
  { day: 'Lun', value: 400 },
  { day: 'Mar', value: 600 },
  { day: 'Mie', value: 550 },
  { day: 'Jue', value: 750 },
  { day: 'Vie', value: 680 },
  { day: 'Sab', value: 900 },
  { day: 'Dom', value: 820 },
];

const loansByState = [
  { name: 'Proces.', value: 180 },
  { name: 'Aprob.', value: 120 },
  { name: 'Revision', value: 90 },
  { name: 'Rechaz.', value: 60 },
  { name: 'Mora', value: 40 },
];

const recentLoans = [
  { client: 'Niente S.A.',    type: 'Comercial', amount: 'Q10,000', status: 'PENDIENTE' },
  { client: 'David Henika',    type: 'Personal', amount: 'Q10,000', status: 'PENDIENTE' },
  { client: 'Cliente Amanez', type: 'Vivienda', amount: 'Q10,000', status: 'APROBADO'  },
  { client: 'Uercero Tonnas', type: 'Personal', amount: 'Q10,000', status: 'APROBADO'  },
  { client: 'Narme Sabeliar', type: 'Personal', amount: 'Q10,000', status: 'APROBADO'  },
];

const aquaColor = '#00f2fe';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div 
    className="stat-card-hover"
    style={{
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '22px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      backgroundImage: `linear-gradient(135deg, ${color}03 0%, #ffffff 100%)`,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ backgroundColor: `${color}12`, color: color, padding: '8px', borderRadius: '10px', display: 'flex', fontSize: '18px' }}>
        {icon}
      </div>
      {sub && <span style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '12px' }}>{sub}</span>}
    </div>
    <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{label}</p>
    <p style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>{value}</p>
  </div>
);

const statusStyle = (status) => ({
  padding: '4px 10px',
  borderRadius: '20px',
  fontSize: '10px',
  fontWeight: 700,
  backgroundColor: status === 'PENDIENTE' ? '#fff7ed' : '#f0fdf4',
  color: status === 'PENDIENTE' ? '#f97316' : '#22c55e',
  border: `1px solid ${status === 'PENDIENTE' ? '#ffedd5' : '#dcfce7'}`,
});

export const DashboardHome = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '4px' }}>
      
      {/* Estilos embebidos rápidos para pulir efectos interactivos del Admin */}
      <style>{`
        .stat-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 242, 254, 0.08) !important;
          border-color: rgba(0, 242, 254, 0.3) !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          {/* Título unificado en celeste sólido */}
          <h1 style={{ 
            margin: 0, 
            fontSize: '26px', 
            fontWeight: 800, 
            color: aquaColor,
            letterSpacing: '-0.3px'
          }}>
            Centro de Control Operativo
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Estado de red Novacoin: <span style={{ color: '#10b981', fontWeight: 600 }}>● En Línea</span>
          </p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
          {new Date().toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid - 3 Columnas Perfectas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
      }}>
        <StatCard icon={<FiUsers />} label="Clientes Totales" value="24,150" sub="+12%" color={aquaColor} />
        <StatCard icon={<FiCreditCard />} label="Cartera de Préstamos" value="Q15.2M" color="#4facfe" />
        <StatCard icon={<FiRepeat />} label="Volumen Hoy" value="Q1.1M" sub="Récord" color="#8b5cf6" />
      </div>

      {/* Main Core Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Columna Izquierda: Gráficos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Gráfico 1: Área Semanal */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Flujo Semanal de Transacciones</h3>
              <FiActivity style={{ color: aquaColor, fontSize: '18px' }} />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={aquaColor} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={aquaColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="value" stroke={aquaColor} strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 2: Distribución de Cartera */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Distribución de Cartera por Estado</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={loansByState}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: 'rgba(0, 242, 254, 0.04)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="value" fill={aquaColor} radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Columna Derecha: Listado de Solicitudes */}
        <div style={{ 
          backgroundColor: '#fff', 
          borderRadius: '20px', 
          padding: '24px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.015)',
          border: '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '495px'
        }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Solicitudes Recientes</h3>
          
          <div 
            className="custom-scrollbar"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px', 
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              paddingRight: '4px'
            }}
          >
            {recentLoans.map((loan, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', transition: 'transform 0.2s ease' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#334155' }}>{loan.client}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{loan.type} • <span style={{ color: '#475569', fontWeight: 600 }}>{loan.amount}</span></p>
                </div>
                <span style={statusStyle(loan.status)}>{loan.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};