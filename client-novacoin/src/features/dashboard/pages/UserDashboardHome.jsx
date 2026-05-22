import { useAuthStore } from '../../../features/auth/store/authStore.js';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { FiActivity, FiCreditCard, FiTrendingUp, FiWifi } from 'react-icons/fi';

// -----------------------------------------------------------------
// DATOS DE EJEMPLO — reemplaza por llamadas reales a tu API
// -----------------------------------------------------------------
const mockTransactions = [
  { day: 'Lun', monto: 320 },
  { day: 'Mar', monto: 150 },
  { day: 'Mié', monto: 480 },
  { day: 'Jue', monto: 90  },
  { day: 'Vie', monto: 620 },
  { day: 'Sáb', monto: 210 },
  { day: 'Dom', monto: 380 },
];

const mockAccount = {
  accountNumber: 'NC-00847362',
  balance: 'Q12,450.00',
  loanPortfolio: 'Q8,300.00',
  status: 'Activa',
};
// -----------------------------------------------------------------

const StatCard = ({ icon, label, value, badge, accent }) => (
  <div style={{
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    flex: '1 1 200px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Franja de color superior */}
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: '3px',
      background: accent,
    }} />

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500 }}>{label}</span>
      {badge && (
        <span style={{
          background: accent,
          color: '#fff',
          fontSize: '10px',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '20px',
        }}>{badge}</span>
      )}
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '42px', height: '42px',
        borderRadius: '12px',
        background: accent + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px', color: accent,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: '26px',
        fontWeight: 800,
        color: '#111827',
        fontFamily: 'Poppins, sans-serif',
        letterSpacing: '-0.5px',
      }}>{value}</span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0a1a2f',
        border: '1px solid rgba(0,242,254,0.2)',
        borderRadius: '10px',
        padding: '10px 16px',
        color: '#fff',
        fontSize: '13px',
      }}>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{label}</p>
        <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#00f2fe' }}>
          Q{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const UserDashboardHome = () => {
  const user = useAuthStore((state) => state.user);
  const name = user?.fullName || user?.username || user?.email || 'Usuario';

  const today = new Date().toLocaleDateString('es-GT', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div style={{ padding: '32px', fontFamily: 'Poppins, sans-serif' }}>

      {/* ── Encabezado ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '26px',
            fontWeight: 800,
            color: '#111827',
            letterSpacing: '-0.5px',
          }}>
            Bienvenido,{' '}
            <span style={{ color: '#00b4cc' }}>{name}</span>
          </h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px' }}>
            Cuenta: <strong style={{ color: '#374151' }}>{mockAccount.accountNumber}</strong>
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          padding: '8px 14px',
          fontSize: '12px',
          color: '#6b7280',
        }}>
          <FiWifi color="#22c55e" size={14} />
          <span style={{ color: '#22c55e', fontWeight: 600 }}>En Línea</span>
          <span style={{ margin: '0 4px', color: '#d1d5db' }}>·</span>
          <span style={{ textTransform: 'capitalize' }}>{today}</span>
        </div>
      </div>

      {/* ── Tarjetas de stats ── */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <StatCard
          icon={<FiCreditCard />}
          label="Saldo en Cuenta"
          value={mockAccount.balance}
          badge="Activa"
          accent="#00b4cc"
        />
        <StatCard
          icon={<FiTrendingUp />}
          label="Cartera de Préstamos"
          value={mockAccount.loanPortfolio}
          accent="#6366f1"
        />
        <StatCard
          icon={<FiActivity />}
          label="Transacciones esta semana"
          value={mockTransactions.reduce((a, b) => a + b.monto, 0).toLocaleString()}
          accent="#f59e0b"
        />
      </div>

      {/* ── Gráfica de transacciones ── */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#111827' }}>
              Flujo Semanal de Transacciones
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>
              Movimientos de tu cuenta esta semana
            </p>
          </div>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '8px',
            background: 'rgba(0,180,204,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#00b4cc',
          }}>
            <FiActivity size={16} />
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={mockTransactions} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00f2fe" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#9ca3af', fontFamily: 'Poppins' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Poppins' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `Q${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="monto"
              stroke="#00f2fe"
              strokeWidth={2.5}
              fill="url(#colorMonto)"
              dot={{ r: 4, fill: '#00f2fe', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#00f2fe', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
