import React from 'react';
import './components/ocean.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Button, Card } from './components/UI';
import { LoginForm, RegisterForm } from './components/AuthForms';
import { TodoList } from './components/TodoList';

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <div className="nav">
        <div className="brand">
          <span className="dot" />
          <span>Ocean Todos</span>
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="badge">Signed in as {user.username}</span>
              <Button className="btn-secondary" onClick={logout}>Sign out</Button>
            </>
          ) : (
            <span className="badge">Please sign in</span>
          )}
        </div>
      </div>
    </header>
  );
}

function AuthGate() {
  const { user, initializing } = useAuth();
  const [mode, setMode] = React.useState('login');

  if (initializing) {
    return (
      <div className="container">
        <Card>Loading session...</Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="grid">
          {mode === 'login' ? <LoginForm /> : <RegisterForm />}
          <Card>
            <div className="section-title">Welcome</div>
            <p style={{ color: 'var(--muted)' }}>
              Manage your tasks with a clean, professional interface. Keep track of what matters.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button className="btn-ghost" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'Create account' : 'Have an account? Sign in'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: 12 }}>
        <div className="section-title">Your Todos</div>
      </div>
      <TodoList />
      <div className="footer">
        Ocean Professional • Classic UI
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** App root with auth provider and main screens. */
  return (
    <AuthProvider>
      <Header />
      <AuthGate />
    </AuthProvider>
  );
}

export default App;
