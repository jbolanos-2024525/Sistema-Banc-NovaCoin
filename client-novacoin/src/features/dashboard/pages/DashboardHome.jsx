import { useEffect } from 'react';
import { FiUsers, FiCreditCard, FiRepeat, FiActivity, FiBriefcase, FiAlertCircle } from 'react-icons/fi';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area,
} from 'recharts';

// Stores reales
import { useAdminAccountStore }   from '../../adminAccount/store/adminAccountStore.js';
import { useEmployeeStore }       from '../../employee/store/employeeStore.js';
import { useTransactionsStore }   from '../../transactions/store/transactionsStore.jsx';
import { useUserManagementStore } from '../../users/store/useUserManagementStore.js';

const aqua = '#00f2fe';

/* ── Formateadores ────────────────────────────────────────────── */
const fmt = (n) =>
  n >= 1_000_000
    ? `Q${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `Q${(n / 1_000).toFixed(1)}K`
      : `Q${n.toLocaleString('es-GT')}`;

/* ── Tarjeta de estadística ───────────────────────────────────── */
const StatCard = ({ icon, label, value, sub, color, loading }) => (
  <div
    className="stat-card-hover"
    style={{
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '22px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      display: 'flex', flexDirection: 'column', gap: '8px',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      backgroundImage: `linear-gradient(135deg, ${color}03 0%, #ffffff 100%)`,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ backgroundColor: `${color}12`, color, padding: '8px', borderRadius: '10px', display: 'flex', fontSize: '18px' }}>
        {icon}
      </div>
      {sub && (
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
          {sub}
        </span>
      )}
    </div>
    <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{label}</p>
    <p style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
      {loading ? <span style={{ fontSize: '14px', color: '#94a3b8' }}>Cargando...</span> : value}
    </p>
  </div>
);

/* ── Badge de estado ──────────────────────────────────────────── */
const statusStyle = (status) => {
  const s = status?.toUpperCase();
  const map = {
    PENDIENTE:   { bg: '#fff7ed', color: '#f97316', border: '#ffedd5' },
    PROCESANDO:  { bg: '#fff7ed', color: '#f97316', border: '#ffedd5' },
    APROBADO:    { bg: '#f0fdf4', color: '#22c55e', border: '#dcfce7' },
    ACTIVO:      { bg: '#f0fdf4', color: '#22c55e', border: '#dcfce7' },
    PAGADO:      { bg: '#eff6ff', color: '#3b82f6', border: '#dbeafe' },
    RECHAZADO:   { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
    EN_MORA:     { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
    CANCELADO:   { bg: '#f8fafc', color: '#94a3b8', border: '#e2e8f0' },
  };
  const cfg = map[s] || map.PENDIENTE;
  return {
    padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
    backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
  };
};

/* ── Agrupar transacciones por día (últimos 7) ────────────────── */
const buildWeeklyData = (transactions) => {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const now = new Date();
  const buckets = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return { day: days[d.getDay()], value: 0, date: d.toDateString() };
  });

  (transactions || []).forEach(tx => {
    const txDate = new Date(tx.fechaCreacion || tx.createdAt || tx.fecha || '').toDateString();
    const bucket = buckets.find(b => b.date === txDate);
    if (bucket) bucket.value += Number(tx.monto || tx.amount || 0);
  });

  return buckets;
};

/* ── Contar préstamos por estado ─────────────────────────────── */
const buildLoansByState = (cuentas) => {
  // Se usa cuentas porque el loanStore es mock; en producción conectar al store de préstamos
  const estados = {};
  (cuentas || []).forEach(c => {
    const st = c.estadoCuenta || c.estado || 'Sin estado';
    estados[st] = (estados[st] || 0) + 1;
  });
  return Object.entries(estados).map(([name, value]) => ({ name, value }));
};

/* ════════════════════════════════════════════════════════════════ */
export const DashboardHome = () => {
  // Stores
  const { cuentas,      fetchCuentas,      loading: loadCuentas   } = useAdminAccountStore();
  const { employees,    fetchEmployees,    loading: loadEmployees  } = useEmployeeStore();
  const { transactions, fetchTransactions, loading: loadTx        } = useTransactionsStore();
  const { users,        fetchUsers,        loading: loadUsers      } = useUserManagementStore();

  useEffect(() => {
    fetchCuentas();
    fetchEmployees();
    fetchTransactions();
    fetchUsers();
  }, []);

  /* ── Métricas calculadas ── */
  const totalCuentas    = cuentas.length;
  const totalEmpleados  = employees.length;
  const totalUsuarios   = users.length;

  const carteraTotal = cuentas.reduce((sum, c) => sum + Number(c.saldo || c.balance || 0), 0);
  const volumenHoy   = (() => {
    const hoy = new Date().toDateString();
    return transactions
      .filter(tx => new Date(tx.fechaCreacion || tx.createdAt || tx.fecha || '').toDateString() === hoy)
      .reduce((sum, tx) => sum + Number(tx.monto || tx.amount || 0), 0);
  })();

  const weeklyData   = buildWeeklyData(transactions);
  const loansByState = buildLoansByState(cuentas);

  /* ── Solicitudes recientes (últimas 5 transacciones) ── */
  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.fechaCreacion || b.createdAt || 0) - new Date(a.fechaCreacion || a.createdAt || 0))
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '4px' }}>

      <style>{`
        .stat-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 242, 254, 0.08) !important;
          border-color: rgba(0, 242, 254, 0.3) !important;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: aqua, letterSpacing: '-0.3px' }}>
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

      {/* ── Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
        <StatCard
          icon={<FiUsers />}
          label="Usuarios Registrados"
          value={totalUsuarios}
          sub={totalUsuarios > 0 ? `+${totalUsuarios}` : undefined}
          color={aqua}
          loading={loadUsers}
        />
        <StatCard
          icon={<FiCreditCard />}
          label="Cuentas Bancarias"
          value={totalCuentas}
          color="#4facfe"
          loading={loadCuentas}
        />
        <StatCard
          icon={<FiRepeat />}
          label="Cartera Total"
          value={fmt(carteraTotal)}
          color="#8b5cf6"
          loading={loadCuentas}
        />
        <StatCard
          icon={<FiBriefcase />}
          label="Empleados Activos"
          value={totalEmpleados}
          color="#10b981"
          loading={loadEmployees}
        />
      </div>

      {/* ── Volumen hoy ── */}
      {volumenHoy > 0 && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(0,242,254,0.06), rgba(79,172,254,0.04))',
          border: '1px solid rgba(0,242,254,0.15)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <FiActivity style={{ color: aqua, fontSize: '18px' }} />
          <p style={{ margin: 0, fontSize: '13px', color: '#334155' }}>
            <span style={{ fontWeight: 700, color: aqua }}>Volumen de hoy:</span>{' '}
            {fmt(volumenHoy)} en {transactions.filter(tx => new Date(tx.fechaCreacion || tx.createdAt || '').toDateString() === new Date().toDateString()).length} transacciones
          </p>
        </div>
      )}

      {/* ── Main Section ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Columna izquierda: Gráficos ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Flujo semanal real */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Flujo Semanal de Transacciones</h3>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                  {loadTx ? 'Cargando...' : `${transactions.length} transacciones totales`}
                </p>
              </div>
              <FiActivity style={{ color: aqua, fontSize: '18px' }} />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={aqua} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={aqua} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <Tooltip
                  formatter={v => [`Q${v.toLocaleString('es-GT')}`, 'Monto']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="value" stroke={aqua} strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Distribución de cuentas por estado */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Distribución de Cuentas por Estado</h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{totalCuentas} cuentas</span>
            </div>
            {loansByState.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={loansByState}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'rgba(0, 242, 254, 0.04)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="value" fill={aqua} radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                {loadCuentas ? 'Cargando...' : 'Sin datos de cuentas'}
              </div>
            )}
          </div>
        </div>

        {/* ── Columna derecha: Transacciones Recientes ── */}
        <div style={{
          backgroundColor: '#fff', borderRadius: '20px', padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.015)', border: '1px solid #f1f5f9',
          display: 'flex', flexDirection: 'column', maxHeight: '495px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Transacciones Recientes</h3>
            {loadTx && <span style={{ fontSize: '11px', color: '#94a3b8' }}>Actualizando...</span>}
          </div>

          <div
            className="custom-scrollbar"
            style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingRight: '4px' }}
          >
            {recentTx.length > 0 ? recentTx.map((tx, i) => (
              <div key={tx._id || tx.id || i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px', borderRadius: '12px',
                backgroundColor: '#f8fafc', border: '1px solid #f1f5f9',
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                    {tx.descripcion || tx.tipo || tx.tipoTransaccion || 'Transacción'}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                    {tx.cuentaOrigen || tx.numeroCuenta || '—'} •{' '}
                    <span style={{ color: '#475569', fontWeight: 600 }}>
                      {tx.monto ? `Q${Number(tx.monto).toLocaleString('es-GT')}` : '—'}
                    </span>
                  </p>
                </div>
                <span style={statusStyle(tx.estado || tx.estadoTransaccion || 'PENDIENTE')}>
                  {tx.estado || tx.estadoTransaccion || 'PENDIENTE'}
                </span>
              </div>
            )) : (
              <div style={{ padding: '30px', textAlign: 'center' }}>
                {loadTx ? (
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>Cargando transacciones...</p>
                ) : (
                  <div>
                    <FiAlertCircle style={{ fontSize: '28px', color: '#cbd5e1', marginBottom: '8px' }} />
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>No hay transacciones recientes</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Resumen inferior ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          {
            title: 'Usuarios Activos',
            value: totalUsuarios,
            detail: `${users.filter(u => u.emailVerified || u.isActive !== false).length} verificados`,
            color: aqua,
            loading: loadUsers,
          },
          {
            title: 'Balance Promedio',
            value: totalCuentas > 0 ? fmt(carteraTotal / totalCuentas) : 'Q0',
            detail: `sobre ${totalCuentas} cuentas`,
            color: '#4facfe',
            loading: loadCuentas,
          },
          {
            title: 'Empleados en Servicio',
            value: totalEmpleados,
            detail: 'empleados activos',
            color: '#10b981',
            loading: loadEmployees,
          },
        ].map(item => (
          <div key={item.title} style={{
            backgroundColor: '#fff', borderRadius: '16px', padding: '18px',
            border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
          }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.5px' }}>
              {item.title.toUpperCase()}
            </p>
            <p style={{ margin: '6px 0 2px', fontSize: '24px', fontWeight: 800, color: item.loading ? '#94a3b8' : '#0f172a' }}>
              {item.loading ? '—' : item.value}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: item.color, fontWeight: 600 }}>{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};