
import React, { useState } from 'react';
import { AuthUser } from './types';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentFormPage } from './pages/StudentFormPage';
import { StudentViewPage } from './pages/StudentViewPage';
import { SupportPage } from './pages/SupportPage';

type ViewState = 
  | { type: 'login' }
  | { type: 'dashboard' }
  | { type: 'form'; studentId?: string }
  | { type: 'view'; studentId: string }
  | { type: 'support' };

const App: React.FC = () => {
  const [user, setUser] = useState<AuthUser>(null);
  const [view, setView] = useState<ViewState>({ type: 'login' });

  const handleLogin = (u: AuthUser) => {
    setUser(u);
    if (u?.role === 'staff') {
      setView({ type: 'dashboard' });
    } else if (u?.role === 'support') {
      setView({ type: 'support' });
    } else if (u?.role === 'student' && u.id) {
      setView({ type: 'view', studentId: u.id });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView({ type: 'login' });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {view.type === 'login' && <LoginPage onLogin={handleLogin} />}
      
      {view.type === 'dashboard' && user?.role === 'staff' && (
        <DashboardPage 
          onLogout={handleLogout}
          onNew={() => setView({ type: 'form' })}
          onEdit={(id) => setView({ type: 'form', studentId: id })}
          onView={(id) => setView({ type: 'view', studentId: id })}
        />
      )}

      {view.type === 'support' && user?.role === 'support' && (
        <SupportPage onLogout={handleLogout} />
      )}

      {view.type === 'form' && user?.role === 'staff' && (
        <StudentFormPage 
          studentId={view.studentId}
          onCancel={() => setView({ type: 'dashboard' })}
          onSave={() => setView({ type: 'dashboard' })}
        />
      )}

      {view.type === 'view' && (
        <StudentViewPage 
          studentId={view.studentId}
          onBack={() => {
            if (user?.role === 'staff') setView({ type: 'dashboard' });
            else if (user?.role === 'support') setView({ type: 'support' });
            else handleLogout();
          }}
        />
      )}
    </div>
  );
};

export default App;
