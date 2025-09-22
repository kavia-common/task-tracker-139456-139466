import React, { useState } from 'react';
import { Button, Card, Input } from './UI';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export function LoginForm() {
  /** Login form for existing users. */
  const { login, setError, error } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="section-title">Sign in</h3>
      <form onSubmit={onSubmit}>
        <Input label="Username" name="username" value={form.username} onChange={onChange} required />
        <Input label="Password" name="password" type="password" value={form.password} onChange={onChange} required />
        {error && <div className="error" role="alert">{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <Button disabled={loading} type="submit">{loading ? 'Signing in...' : 'Sign in'}</Button>
        </div>
      </form>
    </Card>
  );
}

// PUBLIC_INTERFACE
export function RegisterForm() {
  /** Registration form for new users. */
  const { register, setError, error } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.username.trim(), form.email.trim(), form.password);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="section-title">Create account</h3>
      <form onSubmit={onSubmit}>
        <Input label="Username" name="username" value={form.username} onChange={onChange} required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={onChange} required />
        {error && <div className="error" role="alert">{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <Button disabled={loading} type="submit">Register</Button>
        </div>
      </form>
    </Card>
  );
}
