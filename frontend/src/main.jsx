import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Plus, Users, GraduationCap, RefreshCw, Pencil, Trash2, X, ArrowUpRight, LayoutDashboard, Eye, ShieldCheck, LogIn, LogOut } from 'lucide-react';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/students';
const API_BASE = API.replace('/api/students', '/api');
const emptyForm = { id: '', name: '', email: '', branch: '', age: '' };

function App() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [adminAuth, setAdminAuth] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [authLoading, setAuthLoading] = useState(false);

  async function request(url = API, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(adminAuth ? { Authorization: 'Basic ' + adminAuth } : {}), ...options.headers }
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

  async function loginAdmin(event) {
    event.preventDefault();
    setAuthLoading(true); setError('');
    try {
      const token = btoa(loginForm.username + ':' + loginForm.password);
      const response = await fetch(API_BASE + '/admin/verify', { headers: { Authorization: 'Basic ' + token } });
      if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? 'Invalid admin username or password.' : 'Admin login failed. Please try again.');
      setAdminAuth(token); setLoginOpen(false); setLoginForm({ username: 'admin', password: '' });
      setNotice('Admin mode enabled. You can now add, edit and delete student records.');
    } catch (e) { setError(e.message); }
    finally { setAuthLoading(false); }
  }

  function logoutAdmin() {
    setAdminAuth(''); setNotice('Logged out. Student records are now read-only.');
    setModal(false);
  }

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
      <button className={"nav-item " + (page === "dashboard" ? "active" : "")} onClick={() => setPage("dashboard")}><LayoutDashboard size={18}/> Dashboard {page === "dashboard" && <span className="nav-dot"/>}</button>
      <button className={"nav-item " + (page === "students" ? "active" : "")} onClick={() => setPage("students")}><Eye size={18}/> View students {page === "students" && <span className="nav-dot"/>}</button>
      {adminAuth && <button className="nav-item" onClick={openAdd}><Plus size={18}/> Add student</button>}
      <button className="nav-item" onClick={() => adminAuth ? logoutAdmin() : setLoginOpen(true)}>{adminAuth ? <LogOut size={18}/> : <LogIn size={18}/>} {adminAuth ? 'Admin logout' : 'Admin login'}</button>
      <div className="sidebar-bottom"><div className="avatar"><ShieldCheck size={17}/></div><div><strong>{adminAuth ? "Admin mode" : "Read-only access"}</strong><span>{adminAuth ? "You can manage records" : "Login to manage records"}</span></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb">Workspace <span>/</span> <strong>{page === "dashboard" ? "Dashboard" : "View students"}</strong></div><div className="status"><i/> {adminAuth ? "Admin mode enabled" : "Read-only mode"}</div></header>
      <section className="content">
        <div className="page-heading"><div><div className="eyebrow">{page === "dashboard" ? "YOUR WORKSPACE" : "STUDENT DIRECTORY"}</div><h1>{page === "dashboard" ? "Dashboard" : "View students"} <span className="count">{students.length}</span></h1><p>{page === "dashboard" ? "A clear overview of your student records." : <>Search and view student information. {adminAuth ? "Admin access lets you manage records." : "Login as admin to add, edit or delete records."}</>}</p></div>{adminAuth && <button className="primary" onClick={openAdd}><Plus size={18}/> Add student</button>}</div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-top"><span>Total students</span><div className="stat-icon purple"><Users size={18}/></div></div><div className="stat-number">{students.length}</div><div className="stat-foot">Records in your directory</div></div>
          <div className="stat-card"><div className="stat-top"><span>Branches represented</span><div className="stat-icon blue"><GraduationCap size={18}/></div></div><div className="stat-number">{new Set(students.map(s => s.branch).filter(Boolean)).size}</div><div className="stat-foot">Unique academic branches</div></div>
          <div className="stat-card"><div className="stat-top"><span>Average age</span><div className="stat-icon green"><ArrowUpRight size={18}/></div></div><div className="stat-number">{students.length ? (students.reduce((sum, s) => sum + Number(s.age || 0), 0) / students.length).toFixed(1) : '—'}</div><div className="stat-foot">Across all student records</div></div>
        </div>
        {page === "dashboard" && <section className="welcome-card"><div className="welcome-copy"><span className="welcome-pill"><GraduationCap size={14}/> STUDENT MANAGEMENT</span><h2>Everything about your students, <em>in one place.</em></h2><p>View records, find student details quickly, and keep your directory up to date.</p><button className="welcome-button" onClick={() => setPage("students")}>View students <ArrowUpRight size={16}/></button></div><div className="welcome-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-cap"><GraduationCap size={68}/></div><div className="art-chip chip-one"><Users size={16}/> Records</div><div className="art-chip chip-two"><span/> Connected</div></div></section>}
        {notice && <div className="notice">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15}/></button></div>}
        {error && <div className="error-banner">{error}<button onClick={() => setError('')} aria-label="Dismiss"><X size={15}/></button></div>}
        {page === "students" && <section className="table-card">
          <div className="table-heading"><div><h2>All students</h2><p>Browse and manage student information</p></div><button className="icon-button" onClick={loadStudents} title="Refresh"><RefreshCw size={17}/></button></div>
          <div className="table-tools"><div className="searchbox"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, branch or ID..." /></div><span className="result-count">{filtered.length} records</span></div>
          <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>BRANCH</th><th>AGE</th>{adminAuth && <th>ACTIONS</th>}</tr></thead>
            <tbody>{loading ? <tr><td colSpan={adminAuth ? 5 : 4} className="empty"><div className="spinner"/>Loading student records…</td></tr> :
              filtered.length === 0 ? <tr><td colSpan={adminAuth ? 5 : 4} className="empty"><div className="empty-icon"><Users size={22}/></div><strong>{search ? 'No matching students' : 'No students yet'}</strong><span>{search ? 'Try a different search.' : 'Add your first student to get started.'}</span></td></tr> :
              filtered.map(s => <tr key={s.id}><td><div className="student-cell"><div className="student-avatar">{(s.name || '?').split(/\s+/).map(x => x[0]).join('').slice(0,2).toUpperCase()}</div><div><strong>{s.name}</strong><span>{s.email}</span></div></div></td><td><span className="id-tag">#{s.id}</span></td><td><span className="branch-tag">{s.branch}</span></td><td>{s.age}</td>{adminAuth && <td><div className="actions"><button className="action edit" onClick={() => openEdit(s)} title="Edit student"><Pencil size={16}/></button><button className="action delete" onClick={() => deleteStudent(s)} title="Delete student"><Trash2 size={16}/></button></div></td>}</tr>)}
            </tbody></table></div>
          <div className="table-footer"><span>Showing {filtered.length} of {students.length} students</span><span className="live-indicator"><i/> Live API data</span></div>
        </section>}
        <footer>CampusDesk <span>·</span> Student Management System <span>·</span> {adminAuth ? "Admin controls active" : "Read-only mode"}</footer>
      </section>
    </main>
    {loginOpen && <div className="modal-backdrop"><section className="modal">
      <div className="modal-head"><div><div className="eyebrow">RESTRICTED ACCESS</div><h2>Admin login</h2><p>Only authorized administrators can change student records.</p></div><button className="icon-button" onClick={() => setLoginOpen(false)}><X size={18}/></button></div>
      <form onSubmit={loginAdmin}><div className="form-grid">
        <label className="full">Username<input autoComplete="username" required value={loginForm.username} onChange={e => setLoginForm({...loginForm, username:e.target.value})} placeholder="Admin username"/></label>
        <label className="full">Password<input type="password" autoComplete="current-password" required value={loginForm.password} onChange={e => setLoginForm({...loginForm, password:e.target.value})} placeholder="Admin password"/></label>
      </div>{error && <div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="secondary" onClick={() => setLoginOpen(false)}>Cancel</button><button className="primary" disabled={authLoading}>{authLoading ? 'Checking…' : 'Login securely'}</button></div></form>
    </section></div>}
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
