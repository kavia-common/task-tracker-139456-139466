import React, { useEffect, useMemo, useState } from 'react';
import { TodosAPI } from '../api';
import { Button, Card, Input, Select, TextArea } from './UI';

function TodoForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(() => ({
    title: initial?.title || '',
    description: initial?.description || '',
    due_date: initial?.due_date ? initial.due_date.slice(0, 16) : '',
  }));
  const [saving, setSaving] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description,
        due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
        is_completed: initial?.is_completed || false,
      };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <form onSubmit={submit}>
        <Input label="Title" name="title" value={form.title} onChange={onChange} required />
        <TextArea label="Description" name="description" value={form.description} onChange={onChange} />
        <Input label="Due date" name="due_date" type="datetime-local" value={form.due_date} onChange={onChange} />
        <div className="toolbar" style={{ justifyContent: 'flex-end' }}>
          <Button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Card>
  );
}

// PUBLIC_INTERFACE
export function TodoList() {
  /** Main todo list view with filters and CRUD actions. */
  const [todos, setTodos] = useState([]);
  const [filters, setFilters] = useState({ search: '', is_completed: '' });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await TodosAPI.list({
        search: filters.search || undefined,
        is_completed: filters.is_completed === '' ? undefined : filters.is_completed,
      });
      const items = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : []);
      setTodos(items);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filters.is_completed]);

  const filteredLocal = useMemo(() => {
    const s = (filters.search || '').toLowerCase();
    if (!s) return todos;
    return todos.filter(t => (t.title || '').toLowerCase().includes(s) || (t.description || '').toLowerCase().includes(s));
  }, [todos, filters.search]);

  const toggle = async (todo) => {
    await TodosAPI.toggle(todo.id);
    await load();
  };

  const remove = async (todo) => {
    if (!window.confirm('Delete this todo?')) return;
    await TodosAPI.remove(todo.id);
    await load();
  };

  const create = async (payload) => {
    await TodosAPI.create(payload);
    setAdding(false);
    await load();
  };

  const update = async (payload) => {
    if (!editing) return;
    await TodosAPI.update(editing.id, payload);
    setEditing(null);
    await load();
  };

  return (
    <div className="grid grid-2">
      <div>
        <div className="toolbar" style={{ marginBottom: 12 }}>
          <Input placeholder="Search..." value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} />
          <Select value={filters.is_completed} onChange={(e) => setFilters((f) => ({ ...f, is_completed: e.target.value }))}>
            <option value="">All</option>
            <option value="false">Active</option>
            <option value="true">Completed</option>
          </Select>
          <Button onClick={() => load()} className="btn-secondary">Refresh</Button>
          <Button onClick={() => { setAdding(true); setEditing(null); }}>Add</Button>
        </div>

        {error && <div className="error" role="alert" style={{ marginBottom: 8 }}>{error}</div>}

        {loading ? (
          <Card>Loading todos...</Card>
        ) : (
          <div className="list">
            {filteredLocal.length === 0 && <Card>No todos yet.</Card>}
            {filteredLocal.map((t) => (
              <div key={t.id} className={`todo ${t.is_completed ? 'completed' : ''}`}>
                <div className="todo-left">
                  <input
                    type="checkbox"
                    checked={!!t.is_completed}
                    onChange={() => toggle(t)}
                    aria-label={`Mark ${t.title} ${t.is_completed ? 'active' : 'completed'}`}
                    style={{ marginTop: 4 }}
                  />
                  <div>
                    <div className="todo-title">{t.title}</div>
                    {(t.description || t.due_date) && (
                      <div className="todo-meta">
                        {t.description && <span>{t.description}</span>}
                        {t.description && t.due_date && <span> • </span>}
                        {t.due_date && <span>Due: {new Date(t.due_date).toLocaleString()}</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="nav-actions">
                  <Button className="btn-ghost btn-sm" onClick={() => { setEditing(t); setAdding(false); }}>Edit</Button>
                  <Button className="btn-danger btn-sm" onClick={() => remove(t)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        {adding && (
          <>
            <div className="section-title">Add Todo</div>
            <TodoForm onCancel={() => setAdding(false)} onSave={create} />
          </>
        )}
        {editing && (
          <>
            <div className="section-title">Edit Todo</div>
            <TodoForm initial={editing} onCancel={() => setEditing(null)} onSave={update} />
          </>
        )}
        {!adding && !editing && (
          <Card>
            <div className="section-title">Tips</div>
            <div className="badge">Classic</div> <div className="badge">Ocean Professional</div>
            <p style={{ color: 'var(--muted)' }}>Use the filters to view Active or Completed tasks. Click Add to create a new task.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
