// Archivo: src/shared/components/ui/SearchBar.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiCreditCard, FiZap, FiX } from 'react-icons/fi';

// ─── Catálogo de resultados ───────────────────────────────────────────────────
// Cada entrada define a qué ruta navegar y qué parámetro de búsqueda pasar.
// Extiende esta lista con tus datos reales (o cárgalos desde un contexto/API).
const SYSTEM_DATA = {
  clients: [
    { id: 'c1', name: 'Niente S.A.',    type: 'Comercial', status: 'Activo'   },
    { id: 'c2', name: 'David Henika',   type: 'Personal',  status: 'Activo'   },
    { id: 'c3', name: 'Cliente Amanez', type: 'Vivienda',  status: 'Activo'   },
    { id: 'c4', name: 'Uercero Tonnas', type: 'Personal',  status: 'Activo'   },
    { id: 'c5', name: 'Narme Sabeliar', type: 'Personal',  status: 'Activo'   },
    { id: 'c6', name: 'Ana García',     type: 'Comercial', status: 'Inactivo' },
    { id: 'c7', name: 'Roberto Paz',    type: 'Vivienda',  status: 'Activo'   },
  ],
  loans: [
    { id: 'p1', client: 'Niente S.A.',    type: 'Comercial', amount: 'Q10,000', status: 'PENDIENTE', date: '27/05/2026' },
    { id: 'p2', client: 'David Henika',   type: 'Personal',  amount: 'Q10,000', status: 'PENDIENTE', date: '27/05/2026' },
    { id: 'p3', client: 'Cliente Amanez', type: 'Vivienda',  amount: 'Q10,000', status: 'APROBADO',  date: '26/05/2026' },
    { id: 'p4', client: 'Uercero Tonnas', type: 'Personal',  amount: 'Q10,000', status: 'APROBADO',  date: '26/05/2026' },
    { id: 'p5', client: 'Narme Sabeliar', type: 'Personal',  amount: 'Q10,000', status: 'APROBADO',  date: '25/05/2026' },
    { id: 'p6', client: 'Ana García',     type: 'Comercial', amount: 'Q25,000', status: 'RECHAZADO', date: '24/05/2026' },
    { id: 'p7', client: 'Roberto Paz',    type: 'Vivienda',  amount: 'Q50,000', status: 'EN MORA',   date: '20/05/2026' },
  ],
  // Acciones rápidas: llevan directamente a la ruta indicada
  actions: [
    { id: 'a1', label: 'Nuevo Préstamo',      route: '/dashboard/loans',        icon: 'loan'   },
    { id: 'a2', label: 'Registrar Cliente',   route: '/dashboard/accounts',     icon: 'client' },
    { id: 'a3', label: 'Ver Transacciones',   route: '/dashboard/transactions', icon: 'action' },
    { id: 'a4', label: 'Gestión de Mora',     route: '/dashboard/loans',        icon: 'loan'   },
    { id: 'a5', label: 'Reportes',            route: '/dashboard/reports',      icon: 'action' },
    { id: 'a6', label: 'Empleados',           route: '/dashboard/employees',    icon: 'action' },
    { id: 'a7', label: 'Usuarios',            route: '/dashboard/users',        icon: 'action' },
    { id: 'a8', label: 'Configuración',       route: '/dashboard/settings',     icon: 'action' },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isNLQ = (q) => q.includes('?') || q.includes('¿') || q.trim().split(/\s+/).length >= 4;

const hl = (text, q) => {
  if (!q) return text;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase()
      ? <mark key={i} style={{ background: 'rgba(0,242,254,0.22)', color: '#00f2fe', borderRadius: 2, padding: '0 1px' }}>{p}</mark>
      : p
  );
};

const STATUS_COLORS = {
  PENDIENTE: { bg: '#fff7ed', color: '#f97316', border: '#ffedd5' },
  APROBADO:  { bg: '#f0fdf4', color: '#22c55e', border: '#dcfce7' },
  RECHAZADO: { bg: '#fef2f2', color: '#ef4444', border: '#fee2e2' },
  'EN MORA': { bg: '#fef3c7', color: '#d97706', border: '#fde68a' },
};

const ICON_CFG = {
  client: { bg: 'rgba(0,242,254,0.12)',  color: '#00f2fe', el: <FiUser      size={13} /> },
  loan:   { bg: 'rgba(79,172,254,0.12)', color: '#4facfe', el: <FiCreditCard size={12} /> },
  action: { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6', el: <FiZap       size={13} /> },
};

// ─── Sub-componentes pequeños ─────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', padding: '11px 14px 4px' }}>
    {children}
  </div>
);

const Divider = () => <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '3px 14px' }} />;

const ResultRow = ({ item, isActive, query, onSelect, onHover }) => {
  const cfg = ICON_CFG[item.iconType] ?? ICON_CFG.action;
  const sc  = item.badge ? STATUS_COLORS[item.badge] : null;
  return (
    <div
      onMouseDown={(e) => { e.preventDefault(); onSelect(item); }}
      onMouseEnter={onHover}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', cursor: 'pointer', background: isActive ? 'rgba(0,242,254,0.07)' : 'transparent', transition: 'background 0.1s' }}
    >
      <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: cfg.bg, color: cfg.color }}>
        {cfg.el}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hl(item.title, query)}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{item.sub}</div>
      </div>
      {sc && (
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, flexShrink: 0, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
          {item.badge}
        </span>
      )}
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
export const SearchBar = () => {
  const navigate = useNavigate();  // ← navegación real con React Router

  const [query,     setQuery]     = useState('');
  const [sections,  setSections]  = useState([]);
  const [aiAnswer,  setAiAnswer]  = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [open,      setOpen]      = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const inputRef = useRef(null);
  const wrapRef  = useRef(null);
  const aiTimer  = useRef(null);
  const debounce = useRef(null);

  // ⌘K / Ctrl+K
  useEffect(() => {
    const fn = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); inputRef.current?.focus(); inputRef.current?.select(); } };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  // Cerrar al click fuera
  useEffect(() => {
    const fn = (e) => { if (!wrapRef.current?.contains(e.target)) close(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const close = () => { setOpen(false); setActiveIdx(-1); clearTimeout(aiTimer.current); setAiLoading(false); };

  // ── Búsqueda local instantánea ─────────────────────────────────────────────
  const localSearch = useCallback((q) => {
    const lq = q.toLowerCase();
    const out = [];

    const clients = SYSTEM_DATA.clients.filter(c =>
      c.name.toLowerCase().includes(lq) || c.type.toLowerCase().includes(lq) || c.status.toLowerCase().includes(lq)
    );
    if (clients.length) out.push({ label: 'Clientes', items: clients.map(c => ({
      id: c.id, iconType: 'client',
      title: c.name, sub: `${c.type} · ${c.status}`, badge: null,
      // Al seleccionar → ir a /dashboard/accounts con ?q=nombre
      goto: `/dashboard/accounts?q=${encodeURIComponent(c.name)}`,
    }))});

    const loans = SYSTEM_DATA.loans.filter(p =>
      p.client.toLowerCase().includes(lq) || p.type.toLowerCase().includes(lq) || p.status.toLowerCase().includes(lq)
    );
    if (loans.length) out.push({ label: 'Préstamos', items: loans.map(p => ({
      id: p.id, iconType: 'loan',
      title: p.client, sub: `${p.type} · ${p.amount} · ${p.date}`, badge: p.status,
      // Al seleccionar → ir a /dashboard/loans con ?q=cliente
      goto: `/dashboard/loans?q=${encodeURIComponent(p.client)}`,
    }))});

    const actions = SYSTEM_DATA.actions.filter(a => a.label.toLowerCase().includes(lq));
    if (actions.length) out.push({ label: 'Acciones rápidas', items: actions.map(a => ({
      id: a.id, iconType: a.icon ?? 'action',
      title: a.label, sub: 'Ir a sección', badge: null,
      goto: a.route,
    }))});

    return out;
  }, []);

  // ── Búsqueda con IA (lenguaje natural) ────────────────────────────────────
  const runAI = useCallback(async (q) => {
    setAiLoading(true);
    setAiAnswer('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          system: 'Eres el asistente del dashboard bancario Novacoin. Responde siempre en español, máximo 3 oraciones, sin listas. Sé directo y preciso.',
          messages: [{ role: 'user', content: `Datos del sistema:\n${JSON.stringify(SYSTEM_DATA)}\n\nConsulta: "${q}"` }],
        }),
      });
      const data = await res.json();
      setAiAnswer(data.content?.[0]?.text ?? 'Sin respuesta.');
    } catch {
      setAiAnswer('Error al conectar con IA.');
    } finally {
      setAiLoading(false);
    }
  }, []);

  // ── Input change ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    setActiveIdx(-1);
    clearTimeout(debounce.current);
    clearTimeout(aiTimer.current);
    setAiAnswer('');
    setAiLoading(false);

    if (!q.trim()) { close(); return; }

    setOpen(true);
    debounce.current = setTimeout(() => {
      setSections(localSearch(q.trim()));
      if (isNLQ(q.trim())) aiTimer.current = setTimeout(() => runAI(q.trim()), 600);
    }, 150);
  };

  // ── Seleccionar un resultado → navegar ────────────────────────────────────
  const select = (item) => {
    setQuery(item.title);
    close();
    if (item.goto) navigate(item.goto);   // ← navegación real
  };

  const allItems = sections.flatMap(s => s.items);

  // ── Teclado ───────────────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown')  { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, allItems.length - 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') {
      if (activeIdx >= 0 && allItems[activeIdx]) select(allItems[activeIdx]);
      else if (isNLQ(query.trim())) { clearTimeout(aiTimer.current); runAI(query.trim()); }
    }
    else if (e.key === 'Escape') { close(); inputRef.current?.blur(); }
  };

  const showNLQ   = isNLQ(query) && query.trim().length > 0;
  const showEmpty = !sections.length && !aiLoading && !aiAnswer && query.trim().length > 0;

  return (
    <>
      <style>{`@keyframes nb-spin { to { transform: rotate(360deg); } }`}</style>

      <div ref={wrapRef} style={{ position: 'relative', flex: 1, maxWidth: 420 }}>

        {/* ── Input ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: open ? 'rgba(0,242,254,0.05)' : 'rgba(255,255,255,0.07)',
          border: `1px solid ${open ? 'rgba(0,242,254,0.45)' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: 8, padding: '0 12px', height: 40,
          transition: 'all 0.2s',
        }}>
          <FiSearch size={15} style={{ color: open ? '#00f2fe' : 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => query.trim() && setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar clientes, préstamos..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontFamily: 'Poppins, sans-serif' }}
          />
          {showNLQ && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#00f2fe', background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.3)', borderRadius: 4, padding: '1px 6px', flexShrink: 0 }}>
              IA
            </span>
          )}
          {query
            ? <FiX size={13} style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', flexShrink: 0 }} onMouseDown={e => { e.preventDefault(); setQuery(''); close(); }} />
            : <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '1px 6px', flexShrink: 0 }}>⌘K</span>
          }
        </div>

        {/* ── Dropdown ── */}
        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
            background: '#161b22', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            zIndex: 9999, maxHeight: 460, overflowY: 'auto', scrollbarWidth: 'thin',
          }}>

            {/* Respuesta IA */}
            {(aiLoading || aiAnswer) && (
              <div style={{ margin: '10px 12px 6px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '11px 14px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 7 }}>✦ Respuesta inteligente</div>
                {aiLoading
                  ? <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid rgba(0,242,254,0.2)', borderTopColor: '#00f2fe', animation: 'nb-spin 0.7s linear infinite' }} />
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Consultando con IA...</span>
                    </div>
                  : <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.55 }}>{aiAnswer}</p>
                }
              </div>
            )}

            {/* Resultados locales */}
            {sections.map((sec, si) => {
              const offset = sections.slice(0, si).reduce((a, s) => a + s.items.length, 0);
              return (
                <div key={sec.label}>
                  <SectionLabel>{sec.label}</SectionLabel>
                  {sec.items.map((item, ii) => (
                    <ResultRow
                      key={item.id}
                      item={item}
                      query={query.trim()}
                      isActive={offset + ii === activeIdx}
                      onHover={() => setActiveIdx(offset + ii)}
                      onSelect={select}
                    />
                  ))}
                  {si < sections.length - 1 && <Divider />}
                </div>
              );
            })}

            {/* Sin resultados */}
            {showEmpty && (
              <div style={{ padding: '26px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                Sin resultados para "{query}"
              </div>
            )}

            {/* Footer atajos */}
            {(sections.length > 0 || aiAnswer) && (
              <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 16, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                {[['↑↓','navegar'],['↵','seleccionar'],['Esc','cerrar']].map(([k,v]) => (
                  <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <kbd style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '1px 5px', fontSize: 10 }}>{k}</kbd> {v}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;