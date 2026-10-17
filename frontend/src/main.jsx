import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Plus, Users, GraduationCap, RefreshCw, Pencil, Trash2, X, ArrowUpRight } from 'lucide-react';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/students';
const emptyForm = { id: '', name: '', email: '', branch: '', age: '' };

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function request(url = API, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
    if (!response.ok) {
      let message = 'Request failed. Please try again.';
      try {
        const body = await response.json();
        message = body.message || body.error || message;
      } catch {}
      throw new Error(message);
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async function loadStudents() {
    setLoading(true);
    setError('');
    try { setStudents(await request()); }
    catch (e) { setError(e.message + ' Ensure MySQL and the Java API are running.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadStudents(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter(s => [s.name, s.email, s.branch, String(s.id)].some(v => String(v ?? '').toLowerCase().includes(q)));
  }, [students, search]);

  function openAdd() {
    setEditingId(null); setForm(emptyForm); setError(''); setModal(true);
  }
  function openEdit(student) {
    setEditingId(student.id);
    setForm({ id: String(student.id), name: student.name, email: student.email, branch: student.branch, age: String(student.age) });
    setError(''); setModal(true);
  }

  async function saveStudent(event) {
    event.preventDefault(); setSaving(true); setError(''); setNotice('');
    const payload = { id: Number(form.id), name: form.name.trim(), email: form.email.trim(), branch: form.branch.trim(), age: Number(form.age) };
    try {
      await request(editingId === null ? API : API + '/' + editingId, {
        method: editingId === null ? 'POST' : 'PUT',
        body: JSON.stringify(payload)
      });
      setModal(false);
      setNotice(editingId === null ? 'Student added successfully.' : 'Student updated successfully.');
      await loadStudents();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function deleteStudent(student) {
    if (!window.confirm('Delete ' + student.name + '? This action cannot be undone.')) return;
    setError(''); setNotice('');
    try {
      await request(API + '/' + student.id, { method: 'DELETE' });
      setNotice('Student deleted successfully.');
      await loadStudents();
    } catch (e) { setError(e.message); }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><GraduationCap size={23}/></div><div><strong>CampusDesk</strong><span>STUDENT PORTAL</span></div></div>
      <div className="nav-label">WORKSPACE</div>
      <div className="nav-item active"><Users size={18}/> Students <span className="nav-dot"/></div>
      <div className="sidebar-bottom"><div className="avatar">SM</div><div><strong>Administration</strong><span>Student records</span></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb">Workspace <span>/</span> <strong>Students</strong></div><div className="status"><i/> Student database</div></header>
      <section className="content">
        <div className="page-heading"><div><div className="eyebrow">STUDENT DIRECTORY</div><h1>Students <span className="count">{students.length}</span></h1><p>Manage student records in one place.</p></div><button className="primary" onClick={openAdd}><Plus size={18}/> Add student</button></div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-top"><span>Total students</span><div className="stat-icon purple"><Users size={18}/></div></div><div className="stat-number">{students.length}</div><div className="stat-foot">Records in your directory</div></div>
          <div className="stat-card"><div className="stat-top"><span>Branches represented</span><div className="stat-icon blue"><GraduationCap size={18}/></div></div><div className="stat-number">{new Set(students.map(s => s.branch).filter(Boolean)).size}</div><div className="stat-foot">Unique academic branches</div></div>
          <div className="stat-card"><div className="stat-top"><span>Average age</span><div className="stat-icon green"><ArrowUpRight size={18}/></div></div><div className="stat-number">{students.length ? (students.reduce((sum, s) => sum + Number(s.age || 0), 0) / students.length).toFixed(1) : '—'}</div><div className="stat-foot">Across all student records</div></div>
        </div>
        {notice && <div className="notice">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15}/></button></div>}
        {error && <div className="error-banner">{error}<button onClick={() => setError('')} aria-label="Dismiss"><X size={15}/></button></div>}
        <section className="table-card">
          <div className="table-heading"><div><h2>All students</h2><p>Browse and manage student information</p></div><button className="icon-button" onClick={loadStudents} title="Refresh"><RefreshCw size={17}/></button></div>
          <div className="table-tools"><div className="searchbox"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, branch or ID..." /></div><span className="result-count">{filtered.length} records</span></div>
          <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>BRANCH</th><th>AGE</th><th>ACTIONS</th></tr></thead>
            <tbody>{loading ? <tr><td colSpan="5" className="empty"><div className="spinner"/>Loading student records…</td></tr> :
              filtered.length === 0 ? <tr><td colSpan="5" className="empty"><div className="empty-icon"><Users size={22}/></div><strong>{search ? 'No matching students' : 'No students yet'}</strong><span>{search ? 'Try a different search.' : 'Add your first student to get started.'}</span></td></tr> :
              filtered.map(s => <tr key={s.id}><td><div className="student-cell"><div className="student-avatar">{(s.name || '?').split(/\s+/).map(x => x[0]).join('').slice(0,2).toUpperCase()}</div><div><strong>{s.name}</strong><span>{s.email}</span></div></div></td><td><span className="id-tag">#{s.id}</span></td><td><span className="branch-tag">{s.branch}</span></td><td>{s.age}</td><td><div className="actions"><button className="action edit" onClick={() => openEdit(s)} title="Edit student"><Pencil size={16}/></button><button className="action delete" onClick={() => deleteStudent(s)} title="Delete student"><Trash2 size={16}/></button></div></td></tr>)}
            </tbody></table></div>
          <div className="table-footer"><span>Showing {filtered.length} of {students.length} students</span><span className="live-indicator"><i/> Live API data</span></div>
        </section>
        <footer>CampusDesk <span>·</span> Student Management System</footer>
      </section>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(false); }}><section className="modal">
      <div className="modal-head"><div><div className="eyebrow">{editingId === null ? 'NEW RECORD' : 'EDIT RECORD'}</div><h2>{editingId === null ? 'Add student' : 'Update student'}</h2><p>Enter the student details below.</p></div><button className="icon-button" onClick={() => setModal(false)}><X size={18}/></button></div>
      <form onSubmit={saveStudent}><div className="form-grid">
        <label>Student ID<input type="number" min="1" required disabled={editingId !== null} value={form.id} onChange={e => setForm({...form, id:e.target.value})} placeholder="e.g. 1001"/></label>
        <label>Full name<input required maxLength="100" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Student name"/></label>
        <label className="full">Email address<input type="email" required maxLength="254" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="student@example.com"/></label>
        <label>Branch<input required maxLength="100" value={form.branch} onChange={e => setForm({...form, branch:e.target.value})} placeholder="e.g. Computer Science"/></label>
        <label>Age<input type="number" min="0" max="150" required value={form.age} onChange={e => setForm({...form, age:e.target.value})} placeholder="Age"/></label>
      </div>{error && <div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="secondary" onClick={() => setModal(false)}>Cancel</button><button className="primary" disabled={saving}>{saving ? 'Saving…' : editingId === null ? 'Add student' : 'Save changes'}</button></div></form>
    </section></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
