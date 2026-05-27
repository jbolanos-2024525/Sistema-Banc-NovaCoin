import { useEffect } from 'react';
import { useAuthStore }        from '../../auth/store/authStore.js';
import { useAccountStore }     from '../../account/store/accountStore.js';
import { useTransactionsStore } from '../../transactions/store/transactionsStore.jsx';
import { useLoanStore }         from '../../loan/store/loanStore.jsx';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import {
  FiActivity, FiCreditCard, FiTrendingUp,
  FiWifi, FiAlertCircle, FiRepeat,
} from 'react-icons/fi';

const aqua = '#00b4cc';

/* ── Formateadores ─────────────────────────────────────────────── */
const fmt = (n) =>
  n >= 1_000_000
    ? `Q${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `Q${(n / 1_000).toFixed(1)}K`
      : `Q${Number(n).toLocaleString('es-GT')}`;

/* ── Tarjeta de estadística ────────────────────────────────────── */
const StatCard = ({ icon, label, value, badge, accent, loading }) => (
  <div style={{
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '22px',
    flex: '1 1 180px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
    border: '1px solid #f1f5f9',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: '3px', background: accent,
    }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{
        backgroundColor: `${accent}18`, color: accent,
        padding: '8px', borderRadius: '10px',
        display: 'flex', fontSize: '18px',
      }}>
        {icon}
      </div>
      {badge && (
        <span style={{
          background: accent, color: '#fff',
          fontSize: '10px', fontWeight: 700,
          padding: '2px 8px', borderRadius: '20px',
        }}>{badge}</span>
      )}
    </div>
    <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{label}</p>
    <p style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
      {loading
        ? <span style={{ fontSize: '14px', color: '#94a3b8' }}>Cargando...</span>
        : value}
    </p>
  </div>
);

/* ── Badge de estado ───────────────────────────────────────────── */
const statusStyle = (status) => {
  const s = status?.toUpperCase();
  const map = {
    PENDIENTE:  { bg: '#fff7ed', color: '#f97316', border: '#ffedd5' },
    APROBADO:   { bg: '#f0fdf4', color: '#22c55e', border: '#dcfce7' },
    ACTIVO:     { bg: '#f0fdf4', color: '#22c55e', border: '#dcfce7' },
    PAGADO:     { bg: '#eff6ff', color: '#3b82f6', border: '#dbeafe' },
    RECHAZADO:  { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
    EN_MORA:    { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
    CANCELADO:  { bg: '#f8fafc', color: '#94a3b8', border: '#e2e8f0' },
  };
  const cfg = map[s] || map.PENDIENTE;
  return {
    padding: '4px 10px', borderRadius: '20px',
    fontSize: '10px', fontWeight: 700,
    backgroundColor: cfg.bg, color: cfg.color,
    border: `1px solid ${cfg.border}`,
  };
};

/* ── Tooltip personalizado ─────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0a1a2f',
        border: '1px solid rgba(0,180,204,0.2)',
        borderRadius: '10px', padding: '10px 16px',
        color: '#fff', fontSize: '13px',
      }}>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{label}</p>
        <p style={{ margin: '4px 0 0', fontWeight: 700, color: aqua }}>
          Q{payload[0].value.toLocaleString('es-GT')}
        </p>
      </div>
    );
  }
  return null;
};

/* ── Agrupar transacciones por día (últimos 7) ─────────────────── */
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

/* ── Agrupar préstamos por estado ──────────────────────────────── */
const buildLoansByState = (loans) => {
  const estados = {};
  (loans || []).forEach(l => {
    const st = l.estadoPrestamo || l.estado || 'Sin estado';
    estados[st] = (estados[st] || 0) + 1;
  });
  return Object.entries(estados).map(([name, value]) => ({ name, value }));
};

/* ════════════════════════════════════════════════════════════════ */
export const UserDashboardHome = () => {
  const user = useAuthStore((state) => state.user);
  const name = user?.fullName || user?.username || user?.email || 'Usuario';

  const { cuentas,      fetchMisCuentas,   loading: loadCuentas } = useAccountStore();
  const { transactions, fetchTransactions, loading: loadTx      } = useTransactionsStore();
  const { loans,        fetchLoans,        loading: loadLoans   } = useLoanStore();

  useEffect(() => {
    fetchMisCuentas();
    fetchTransactions();
    fetchLoans();
  }, []);

  /* ── Métricas ── */
  const saldoTotal    = cuentas.reduce((s, c) => s + Number(c.saldo || c.balance || 0), 0);
  const totalPrestamos = loans.reduce((s, l) => s + Number(l.montoPrestamo || l.monto || 0), 0);
  const weeklyData    = buildWeeklyData(transactions);
  const loansByState  = buildLoansByState(loans);

  const volumenSemana = weeklyData.reduce((s, d) => s + d.value, 0);

  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.fechaCreacion || b.createdAt || 0) - new Date(a.fechaCreacion || a.createdAt || 0))
    .slice(0, 5);

  const today = new Date().toLocaleDateString('es-GT', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '4px', fontFamily: 'Poppins, sans-serif' }}>

      <style>{`
        .stat-card-user:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0,180,204,0.08) !important;
          border-color: rgba(0,180,204,0.3) !important;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
            Bienvenido,{' '}
            <span style={{ color: aqua }}>{name}</span>
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            {cuentas.length > 0
              ? <>Cuenta: <strong style={{ color: '#374151' }}>{cuentas[0]?.numeroCuenta || cuentas[0]?.accountNumber || '—'}</strong></>
              : 'Cargando información de cuenta...'}
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: '10px', padding: '8px 14px',
          fontSize: '12px', color: '#6b7280',
        }}>
          <FiWifi color="#22c55e" size={14} />
          <span style={{ color: '#22c55e', fontWeight: 600 }}>En Línea</span>
          <span style={{ margin: '0 4px', color: '#d1d5db' }}>·</span>
          <span style={{ textTransform: 'capitalize' }}>{today}</span>
        </div>
      </div>

      {/* ── Tarjetas ── */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <StatCard
          icon={<FiCreditCard />}
          label="Saldo Total en Cuentas"
          value={fmt(saldoTotal)}
          badge={cuentas.length > 0 ? 'Activa' : undefined}
          accent={aqua}
          loading={loadCuentas}
        />
        <StatCard
          icon={<FiTrendingUp />}
          label="Cartera de Préstamos"
          value={fmt(totalPrestamos)}
          badge={loans.length > 0 ? `${loans.length} préstamo${loans.length > 1 ? 's' : ''}` : undefined}
          accent="#6366f1"
          loading={loadLoans}
        />
        <StatCard
          icon={<FiRepeat />}
          label="Volumen Semanal"
          value={fmt(volumenSemana)}
          accent="#f59e0b"
          loading={loadTx}
        />
      </div>

      {/* ── Sección principal ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Columna izquierda ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Flujo semanal */}
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
                  <linearGradient id="colorUserMonto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={aqua} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={aqua} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke={aqua} strokeWidth={2.5} fillOpacity={1} fill="url(#colorUserMonto)"
                  dot={{ r: 4, fill: aqua, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: aqua, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Préstamos por estado */}
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Mis Préstamos por Estado</h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{loans.length} préstamo{loans.length !== 1 ? 's' : ''}</span>
            </div>
            {loansByState.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={loansByState}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'rgba(0,180,204,0.04)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                {loadLoans ? 'Cargando...' : 'No tienes préstamos registrados'}
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
          <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingRight: '4px' }}>
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
                    {tx.cuentaOrigen || tx.numeroCuenta || '—'} ·{' '}
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
            title: 'Mis Cuentas',
            value: cuentas.length,
            detail: cuentas.length > 0 ? `${cuentas.filter(c => (c.estadoCuenta || c.estado || '').toUpperCase() === 'ACTIVA').length} activas` : 'Sin cuentas',
            color: aqua,
            loading: loadCuentas,
          },
          {
            title: 'Saldo Promedio',
            value: cuentas.length > 0 ? fmt(saldoTotal / cuentas.length) : 'Q0',
            detail: `sobre ${cuentas.length} cuenta${cuentas.length !== 1 ? 's' : ''}`,
            color: '#4facfe',
            loading: loadCuentas,
          },
          {
            title: 'Mis Préstamos',
            value: loans.length,
            detail: loans.length > 0
              ? `${loans.filter(l => (l.estadoPrestamo || l.estado || '').toUpperCase() === 'ACTIVO').length} activos`
              : 'Sin préstamos',
            color: '#6366f1',
            loading: loadLoans,
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