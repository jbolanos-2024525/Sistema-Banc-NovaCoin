import { FiUsers, FiBriefcase, FiCreditCard, FiRepeat, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

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

const recentTransactions = [
  { client: 'David R.', amount: 'Q10,000', type: 'Transferencia' },
  { client: 'Elena M.', amount: 'Q2,500',  type: 'Pago Servicio' },
  { client: 'Roberto C.', amount: 'Q15,000', type: 'Depósito' },
  { client: 'David R.', amount: 'Q1,200',  type: 'Personal' },
];

const aquaColor = '#00f2fe';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div style={{
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    border: '1px solid rgba(0,0,0,0.02)',
    backgroundImage: `linear-gradient(135deg, ${color}05 0%, #ffffff 100%)`,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ backgroundColor: `${color}15`, color: color, padding: '10px', borderRadius: '12px', display: 'flex', fontSize: '20px' }}>
        {icon}
      </div>
      {sub && <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '12px' }}>{sub}</span>}
    </div>
    <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{label}</p>
    <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>{value}</p>
  </div>
);

const statusStyle = (status) => ({
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 700,
  backgroundColor: status === 'PENDIENTE' ? '#fff7ed' : '#f0fdf4',
  color: status === 'PENDIENTE' ? '#f97316' : '#22c55e',
  border: `1px solid ${status === 'PENDIENTE' ? '#ffedd5' : '#dcfce7'}`,
});

export const DashboardHome = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '28px', 
            fontWeight: 800, 
            background: `linear-gradient(90deg, #0f172a 0%, ${aquaColor} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Centro de Control Operativo
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>
            Estado de red Novacoin: <span style={{ color: '#10b981', fontWeight: 600 }}>● En Línea</span>
          </p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '13px', color: '#94a3b8' }}>
          {new Date().toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
      }}>
        <div style={{ background: 'linear-gradient(165deg, #0a1a2f 0%, #050c18 100%)', borderRadius: '16px', padding: '24px', color: '#fff' }}>
          <p style={{ margin: '0 0 12px', fontSize: '12px', color: aquaColor, fontWeight: 700, letterSpacing: '1px' }}>SISTEMA AUTH</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FiCheckCircle style={{ color: aquaColor, fontSize: '32px' }} />
            <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '18px' }}>Operativo</p>
                <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Uptime: 99.9%</p>
            </div>
          </div>
        </div>
        <StatCard icon={<FiUsers />} label="Clientes Totales" value="24,150" sub="+12%" color={aquaColor} />
        <StatCard icon={<FiCreditCard />} label="Cartera de Préstamos" value="Q15.2M" color="#4facfe" />
        <StatCard icon={<FiRepeat />} label="Volumen Hoy" value="Q1.1M" sub="Récord" color="#8b5cf6" />
      </div>

      {/* Main Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Flujo Semanal de Transacciones</h3>
            <FiActivity style={{ color: aquaColor }} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={aquaColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={aquaColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
              <Area type="monotone" dataKey="value" stroke={aquaColor} strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700 }}>Solicitudes Recientes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentLoans.slice(0, 5).map((loan, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{loan.client}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{loan.type} • {loan.amount}</p>
                </div>
                <span style={statusStyle(loan.status)}>{loan.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section (Sin alertas críticas) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: '15px' }}>Densidad de Usuarios (App)</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: '4px' }}>
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} style={{
                height: '14px',
                borderRadius: '3px',
                backgroundColor: aquaColor,
                opacity: Math.random() * 0.8 + 0.1
              }} />
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: '15px' }}>Distribución de Cartera por Estado</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={loansByState}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" fill={aquaColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};