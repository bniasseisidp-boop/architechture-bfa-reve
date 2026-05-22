import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import logo from '../assets/logo.jpeg';
import './AdminDashboard.css';

/* ── Icons (minimal inline SVGs) ───────────────── */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONS = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  team:      'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  services:  'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  real:      'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
  devis:     'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  contact:   'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  logout:    'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
  plus:      'M12 5v14 M5 12h14',
  edit:      'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  trash:     'M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6',
  reply:     'M9 17l-5-5 5-5 M20 18v-2a4 4 0 00-4-4H4',
  eye:       'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
  check:     'M20 6L9 17l-5-5',
};

/* ── Sidebar link component ─────────────────────── */
function SidebarLink({ id, label, icon, active, badge, onClick }) {
  return (
    <button className={`admin-sidebar__link ${active ? 'active' : ''}`} onClick={() => onClick(id)}>
      <Icon d={icon} />
      <span>{label}</span>
      {badge > 0 && <span className="admin-sidebar__badge">{badge}</span>}
    </button>
  );
}

/* ── Modal wrapper ──────────────────────────────── */
function Modal({ open, title, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="admin-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="admin-modal"
            initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }} onClick={e => e.stopPropagation()}
          >
            <div className="admin-modal__header">
              <h3>{title}</h3>
              <button onClick={onClose} className="admin-modal__close">✕</button>
            </div>
            <div className="admin-modal__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════
   SECTIONS
══════════════════════════════════════════════════ */

/* ── Overview ───────────────────────────────────── */
function Overview({ stats }) {
  return (
    <div className="admin-section">
      <h2 className="admin-section__title">Tableau de Bord</h2>
      <div className="admin-stats-grid">
        {stats.map((s, i) => (
          <motion.div key={i} className="admin-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="admin-stat-card__icon">{s.icon}</div>
            <div>
              <div className="admin-stat-card__num">{s.value}</div>
              <div className="admin-stat-card__label">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Generic CRUD section ───────────────────────── */
function CrudSection({ title, endpoint, fields, renderRow }) {
  const [items, setItems]   = useState([]);
  const [modal, setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]     = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api.get(endpoint).then(r => setItems(r.data)).catch(() => {});
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm({}); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ ...item }); setModal(true); };
  const onClose  = () => { setModal(false); setEditing(null); setForm({}); };

  const onSave = async () => {
    setSaving(true);
    const fd = new FormData();
    for (const [k, v] of Object.entries(form)) {
      if (v !== null && v !== undefined) fd.append(k, v);
    }
    try {
      if (editing) {
        fd.append('_method', 'PUT');
        await api.post(`/admin${endpoint}/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Modifié !');
      } else {
        await api.post(`/admin${endpoint}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Ajouté !');
      }
      load(); onClose();
    } catch (e) {
      const errors = e.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach(m => toast.error(m));
      } else {
        toast.error('Erreur. Vérifiez les champs.');
      }
    } finally { setSaving(false); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Supprimer cet élément ?')) return;
    try {
      await api.delete(`/admin${endpoint}/${id}`);
      toast.success('Supprimé !');
      load();
    } catch { toast.error('Erreur suppression.'); }
  };

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <h2 className="admin-section__title">{title}</h2>
        <button className="btn-primary admin-add-btn" onClick={openAdd}>
          <Icon d={ICONS.plus} size={16} /> Ajouter
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="admin-table__row">
                {renderRow(item)}
                <td className="admin-table__actions">
                  <button className="admin-btn-icon" onClick={() => openEdit(item)} title="Modifier"><Icon d={ICONS.edit} size={15} /></button>
                  <button className="admin-btn-icon admin-btn-icon--red" onClick={() => onDelete(item.id)} title="Supprimer"><Icon d={ICONS.trash} size={15} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={10} className="admin-table__empty">Aucun élément. Cliquez sur Ajouter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modal} title={editing ? `Modifier` : `Ajouter`} onClose={onClose}>
        {fields.map(f => (
          <div key={f.key} className="field" style={{ marginBottom: '1rem' }}>
            <label>{f.label}{f.required && ' *'}</label>
            {f.type === 'textarea' ? (
              <textarea rows={4} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder || ''} />
            ) : f.type === 'file' ? (
              <input type="file" accept="image/*" onChange={e => setForm(p => ({ ...p, [f.key]: e.target.files[0] || null }))} />
            ) : f.type === 'checkbox' ? (
              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={!!form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.checked }))} />
                {f.checkLabel}
              </label>
            ) : (
              <input type={f.type || 'text'} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder || ''} />
            )}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button className="btn-primary" onClick={onSave} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
            {saving ? <span className="devis__spinner" /> : 'Enregistrer'}
          </button>
          <button className="btn-dark" onClick={onClose}>Annuler</button>
        </div>
      </Modal>
    </div>
  );
}

/* ── Devis section ──────────────────────────────── */
function DevisSection() {
  const [devis, setDevis]     = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply]     = useState('');
  const [sending, setSending] = useState(false);

  const load = () => api.get('/admin/devis').then(r => setDevis(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = async (d) => {
    setSelected(d); setReply(d.admin_reply || '');
    if (d.status === 'pending') {
      try { await api.get(`/admin/devis/${d.id}`); load(); } catch { /* */ }
    }
  };

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await api.put(`/admin/devis/${selected.id}`, { admin_reply: reply });
      toast.success('Réponse envoyée !');
      setSelected(p => ({ ...p, admin_reply: reply, status: 'replied' }));
      load();
    } catch { toast.error('Erreur.'); }
    finally { setSending(false); }
  };

  const archive = async (id) => {
    await api.put(`/admin/devis/${id}`, { status: 'archived' });
    load();
    if (selected?.id === id) setSelected(null);
    toast.success('Archivé.');
  };

  const STATUS_COLOR = { pending: '#f59e0b', read: '#3b82f6', replied: '#22c55e', archived: '#6b7280' };

  return (
    <div className="admin-section">
      <h2 className="admin-section__title">Demandes de Devis <span className="admin-badge-count">{devis.filter(d => d.status === 'pending').length}</span></h2>
      <div className="devis-split">
        <div className="devis-list">
          {devis.map(d => (
            <div key={d.id} className={`devis-item ${selected?.id === d.id ? 'active' : ''} ${d.status}`} onClick={() => open(d)}>
              <div className="devis-item__top">
                <strong>{d.full_name}</strong>
                <span className="devis-item__status" style={{ color: STATUS_COLOR[d.status] }}>{d.status}</span>
              </div>
              <div className="devis-item__meta">{d.email} · {d.project_type || 'N/A'}</div>
              <div className="devis-item__date">{new Date(d.created_at).toLocaleDateString('fr-FR')}</div>
            </div>
          ))}
          {devis.length === 0 && <div className="admin-table__empty">Aucune demande reçue.</div>}
        </div>

        {selected && (
          <div className="devis-detail">
            <div className="devis-detail__header">
              <div>
                <h3>{selected.full_name}</h3>
                <span style={{ color: STATUS_COLOR[selected.status], fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>{selected.status}</span>
              </div>
              <button className="admin-btn-icon" onClick={() => archive(selected.id)} title="Archiver">
                <Icon d={ICONS.check} size={15} />
              </button>
            </div>
            <div className="devis-detail__info">
              <span>📧 {selected.email}</span>
              <span>📞 {selected.phone}</span>
              {selected.project_type && <span>🏗️ {selected.project_type}</span>}
              {selected.budget && <span>💰 {selected.budget}</span>}
            </div>
            <div className="devis-detail__msg">
              <label>Message du client</label>
              <p>{selected.message}</p>
            </div>
            {selected.admin_reply && (
              <div className="devis-detail__reply-prev">
                <label>Votre réponse précédente</label>
                <p>{selected.admin_reply}</p>
              </div>
            )}
            <div className="devis-detail__reply">
              <label>Répondre</label>
              <textarea rows={4} value={reply} onChange={e => setReply(e.target.value)} placeholder="Votre réponse au client…" />
              <button className="btn-primary" onClick={sendReply} disabled={sending} style={{ marginTop: '0.75rem' }}>
                {sending ? <span className="devis__spinner" /> : <><Icon d={ICONS.reply} size={15} /> Envoyer la réponse</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Messages section ───────────────────────────── */
function MessagesSection() {
  const [msgs, setMsgs] = useState([]);
  const [sel, setSel]   = useState(null);

  const load = () => api.get('/admin/contacts').then(r => setMsgs(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = async (m) => {
    setSel(m);
    if (!m.is_read) {
      try { await api.put(`/admin/contacts/${m.id}`); load(); } catch { /* */ }
    }
  };

  const del = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    await api.delete(`/admin/contacts/${id}`);
    if (sel?.id === id) setSel(null);
    load(); toast.success('Supprimé.');
  };

  return (
    <div className="admin-section">
      <h2 className="admin-section__title">Messages <span className="admin-badge-count">{msgs.filter(m => !m.is_read).length}</span></h2>
      <div className="devis-split">
        <div className="devis-list">
          {msgs.map(m => (
            <div key={m.id} className={`devis-item ${sel?.id === m.id ? 'active' : ''} ${m.is_read ? '' : 'pending'}`} onClick={() => open(m)}>
              <div className="devis-item__top">
                <strong>{m.name}</strong>
                {!m.is_read && <span style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700 }}>NON LU</span>}
              </div>
              <div className="devis-item__meta">{m.email}</div>
              <div className="devis-item__date">{new Date(m.created_at).toLocaleDateString('fr-FR')}</div>
            </div>
          ))}
          {msgs.length === 0 && <div className="admin-table__empty">Aucun message.</div>}
        </div>

        {sel && (
          <div className="devis-detail">
            <div className="devis-detail__header">
              <div>
                <h3>{sel.name}</h3>
                <a href={`mailto:${sel.email}`} style={{ color: 'var(--red)', fontSize: '0.85rem' }}>{sel.email}</a>
              </div>
              <button className="admin-btn-icon admin-btn-icon--red" onClick={() => del(sel.id)}><Icon d={ICONS.trash} size={15} /></button>
            </div>
            <div className="devis-detail__info">
              {sel.phone && <span>📞 {sel.phone}</span>}
              <span>📅 {new Date(sel.created_at).toLocaleString('fr-FR')}</span>
            </div>
            <div className="devis-detail__msg">
              <label>Message</label>
              <p>{sel.message}</p>
            </div>
            <a href={`mailto:${sel.email}?subject=Réponse Pilar Construction`} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
              <Icon d={ICONS.reply} size={15} /> Répondre par email
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState('overview');
  const [pendingDevis, setPendingDevis] = useState(0);
  const [pendingMsgs,  setPendingMsgs]  = useState(0);
  const [overviewStats, setOverviewStats] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, s, r, d, c] = await Promise.all([
          api.get('/team'), api.get('/services'), api.get('/realizations'),
          api.get('/admin/devis'), api.get('/admin/contacts'),
        ]);
        setPendingDevis(d.data.filter(x => x.status === 'pending').length);
        setPendingMsgs(c.data.filter(x => !x.is_read).length);
        setOverviewStats([
          { icon: '👥', value: t.data.length, label: 'Membres équipe' },
          { icon: '🏗️', value: s.data.length, label: 'Services' },
          { icon: '🏛️', value: r.data.length, label: 'Réalisations' },
          { icon: '📋', value: d.data.filter(x => x.status === 'pending').length, label: 'Devis en attente' },
          { icon: '📩', value: c.data.filter(x => !x.is_read).length, label: 'Messages non lus' },
        ]);
      } catch { /* */ }
    };
    load();
  }, [section]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const MENU = [
    { id: 'overview',  label: 'Tableau de Bord', icon: ICONS.dashboard, badge: 0 },
    { id: 'team',      label: 'Équipe',          icon: ICONS.team,    badge: 0 },
    { id: 'services',  label: 'Services',         icon: ICONS.services,badge: 0 },
    { id: 'real',      label: 'Réalisations',     icon: ICONS.real,    badge: 0 },
    { id: 'devis',     label: 'Devis',            icon: ICONS.devis,   badge: pendingDevis },
    { id: 'messages',  label: 'Messages',         icon: ICONS.contact, badge: pendingMsgs },
  ];

  const TEAM_FIELDS = [
    { key: 'name',        label: 'Nom complet',  required: true,  placeholder: 'Ex: Aminata Diallo' },
    { key: 'role',        label: 'Poste/Rôle',   required: true,  placeholder: 'Ex: Architecte Principal' },
    { key: 'description', label: 'Description',  type: 'textarea',placeholder: 'Décrivez le membre…' },
    { key: 'photo',       label: 'Photo',        type: 'file' },
    { key: 'is_founder',  label: 'Fondateur',    type: 'checkbox', checkLabel: 'Cet membre est le fondateur' },
    { key: 'sort_order',  label: 'Ordre',        type: 'number',  placeholder: '0' },
  ];
  const SERVICE_FIELDS = [
    { key: 'icon',        label: 'Emoji/Icône',   required: true,  placeholder: '🏗️' },
    { key: 'title',       label: 'Titre',         required: true,  placeholder: 'Construction Résidentielle' },
    { key: 'description', label: 'Description',   type: 'textarea', placeholder: 'Décrivez le service…' },
    { key: 'sort_order',  label: 'Ordre',         type: 'number' },
  ];
  const REAL_FIELDS = [
    { key: 'title',       label: 'Titre',         required: true,  placeholder: 'Villa Panorama' },
    { key: 'category',    label: 'Catégorie',     placeholder: 'Résidentiel / Commercial / Institutionnel' },
    { key: 'year',        label: 'Année',         placeholder: '2024' },
    { key: 'description', label: 'Description',   type: 'textarea', placeholder: 'Décrivez la réalisation…' },
    { key: 'image',       label: 'Image',         type: 'file' },
  ];

  return (
    <div className="admin-layout">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <img src={logo} alt="Pilar" />
        </div>

        <nav className="admin-sidebar__nav">
          {MENU.map(m => (
            <SidebarLink key={m.id} {...m} active={section === m.id} onClick={setSection} />
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">
              {admin?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="admin-sidebar__name">{admin?.name}</div>
              <div className="admin-sidebar__email">{admin?.email}</div>
            </div>
          </div>
          <button className="admin-sidebar__logout" onClick={handleLogout} title="Déconnexion">
            <Icon d={ICONS.logout} size={17} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {section === 'overview'  && <Overview stats={overviewStats} />}
            {section === 'team'      && (
              <CrudSection
                title="Gestion de l'Équipe"
                endpoint="/team"
                fields={TEAM_FIELDS}
                renderRow={m => (
                  <>
                    <td><div className="admin-table__avatar">{m.photo_url ? <img src={m.photo_url} alt="" /> : m.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div></td>
                    <td><strong>{m.name}</strong>{m.is_founder && <span className="admin-table__badge">Fondateur</span>}</td>
                    <td className="td-gray">{m.role}</td>
                    <td className="td-gray td-desc">{m.description?.slice(0, 80)}…</td>
                  </>
                )}
              />
            )}
            {section === 'services'  && (
              <CrudSection
                title="Gestion des Services"
                endpoint="/services"
                fields={SERVICE_FIELDS}
                renderRow={s => (
                  <>
                    <td><span style={{ fontSize: '1.8rem' }}>{s.icon}</span></td>
                    <td><strong>{s.title}</strong></td>
                    <td className="td-gray td-desc">{s.description?.slice(0, 100)}…</td>
                  </>
                )}
              />
            )}
            {section === 'real' && (
              <CrudSection
                title="Gestion des Réalisations"
                endpoint="/realizations"
                fields={REAL_FIELDS}
                renderRow={r => (
                  <>
                    {r.image_url ? <td><img src={r.image_url} alt="" className="admin-table__thumb" /></td> : <td><div className="admin-table__thumb admin-table__thumb--placeholder">🏛️</div></td>}
                    <td><strong>{r.title}</strong></td>
                    <td><span className="admin-table__badge">{r.category}</span></td>
                    <td className="td-gray">{r.year}</td>
                  </>
                )}
              />
            )}
            {section === 'devis'    && <DevisSection />}
            {section === 'messages' && <MessagesSection />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
