
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { AuthUser } from '../types';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [tab, setTab] = useState<'student' | 'staff' | 'support'>('student');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [welcomeText, setWelcomeText] = useState('');

  useEffect(() => {
    const settings = storageService.getSettings();
    setWelcomeText(settings.welcomeMessage);
    
    // Esconde a mensagem após 4 segundos
    const timer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const student = storageService.getStudentByCpfAndBirth(cpf, birthDate);
    if (student) {
      onLogin({ role: 'student', id: student.id, name: student.name });
    } else {
      setError('Estudante não encontrado. Verifique os dados.');
    }
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = storageService.getStaffByCpf(cpf);
    if (staff) {
      onLogin({ role: 'staff', id: staff.id, name: staff.name });
    } else {
      setError('Membro da equipe não encontrado.');
    }
  };

  const handleSupportLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf === '03137799104') {
      onLogin({ role: 'support', name: 'Suporte Técnico' });
    } else {
      setError('Credenciais de suporte inválidas.');
    }
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col p-4 sm:p-6 justify-between min-h-screen relative overflow-hidden">
      {/* Mensagem de Boas-Vindas Transitória */}
      <div 
        className={`absolute top-0 left-0 right-0 z-[60] transition-all duration-700 ease-in-out transform ${
          showWelcomeMessage ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="mx-4 mt-4 p-4 bg-primary text-white rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 backdrop-blur-md bg-opacity-90">
          <div className="bg-white/20 p-2 rounded-full">
            <span className="material-symbols-outlined text-white">campaign</span>
          </div>
          <p className="text-sm font-bold leading-tight flex-1">{welcomeText}</p>
          <button onClick={() => setShowWelcomeMessage(false)} className="opacity-60 hover:opacity-100">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>

      <div className="flex-1">
        <header className="flex items-center justify-between py-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <span className="material-symbols-outlined text-3xl">directions_bus</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">School Pass</h1>
          </div>
          <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700">
             <span className="material-symbols-outlined text-slate-400">shield_person</span>
          </div>
        </header>

        <div className="text-center mb-8 mt-4">
          <h2 className="text-2xl font-bold mb-1">Bem-vindo</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Identifique-se para acessar o portal.</p>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex mb-8">
          {(['student', 'staff', 'support'] as const).map(t => (
            <button 
              key={t}
              onClick={() => { setTab(t); setError(''); setCpf(''); setBirthDate(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === t 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'student' ? 'Estudante' : t === 'staff' ? 'Equipe' : 'Suporte'}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100 animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        {tab === 'student' && (
          <form onSubmit={handleStudentLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">CPF do Aluno</label>
              <input 
                type="text" 
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full p-3.5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Data de Nascimento</label>
              <input 
                type="date" 
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                className="w-full p-3.5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                required
              />
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
              Acessar Carteirinha
            </button>
          </form>
        )}

        {tab === 'staff' && (
          <form onSubmit={handleStaffLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">CPF de Identificação</label>
              <input 
                type="text" 
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full p-3.5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                required
              />
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all">
              Entrar no Dashboard
            </button>
          </form>
        )}

        {tab === 'support' && (
          <form onSubmit={handleSupportLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">ID de Suporte</label>
              <input 
                type="password" 
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                placeholder="Identificador de suporte"
                className="w-full p-3.5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                required
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-bold py-4 rounded-xl active:scale-95 transition-all">
              Acessar Painel Central
            </button>
            <p className="text-[10px] text-center text-slate-400 font-medium">Acesso restrito à administração técnica.</p>
          </form>
        )}
      </div>

      <footer className="w-full py-6 text-center">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Richardt Software</p>
      </footer>
    </div>
  );
};
