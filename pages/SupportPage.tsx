
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { School, StaffMember } from '../types';
import { Header } from '../components/Header';

interface SupportPageProps {
  onLogout: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'schools' | 'staff' | 'settings'>('schools');
  const [schools, setSchools] = useState<School[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newStaff, setNewStaff] = useState({ name: '', cpf: '', role: 'driver' as const });

  useEffect(() => {
    setSchools(storageService.getSchools());
    setStaff(storageService.getStaff());
    setWelcomeMessage(storageService.getSettings().welcomeMessage);
  }, []);

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName) return;
    storageService.addSchool(newSchoolName);
    setSchools(storageService.getSchools());
    setNewSchoolName('');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.cpf) return;
    storageService.addStaff(newStaff);
    setStaff(storageService.getStaff());
    setNewStaff({ name: '', cpf: '', role: 'driver' });
  };

  const handleDeleteSchool = (id: string) => {
    storageService.deleteSchool(id);
    setSchools(storageService.getSchools());
  };

  const handleDeleteStaff = (id: string) => {
    storageService.deleteStaff(id);
    setStaff(storageService.getStaff());
  };

  const handleSaveSettings = () => {
    storageService.saveSettings({ welcomeMessage });
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-background-light dark:bg-background-dark shadow-2xl">
      <Header 
        title="Painel de Suporte" 
        subtitle="Administração Central"
        rightAction={
          <button onClick={onLogout} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined">power_settings_new</span>
          </button>
        }
      />

      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark">
        {(['schools', 'staff', 'settings'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === t 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {t === 'schools' ? 'Escolas' : t === 'staff' ? 'Equipe' : 'Sistema'}
          </button>
        ))}
      </div>

      <main className="flex-1 p-5 overflow-y-auto no-scrollbar">
        {activeTab === 'schools' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <form onSubmit={handleAddSchool} className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold mb-3">Cadastrar Nova Instituição</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newSchoolName}
                  onChange={e => setNewSchoolName(e.target.value)}
                  placeholder="Nome da Escola"
                  className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary"
                />
                <button type="submit" className="bg-primary text-white p-2 rounded-lg hover:bg-primary-hover transition-colors">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </form>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase">Escolas Ativas</h3>
              {schools.map(school => (
                <div key={school.id} className="flex items-center justify-between p-3 bg-white dark:bg-surface-dark rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-sm font-medium">{school.name}</span>
                  <button onClick={() => handleDeleteSchool(school.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <form onSubmit={handleAddStaff} className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold">Adicionar Funcionário</h3>
              <input 
                type="text" 
                placeholder="Nome Completo"
                value={newStaff.name}
                onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                className="w-full rounded-lg border-slate-200 dark:border-slate-700 text-sm focus:ring-primary focus:border-primary"
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="CPF"
                  value={newStaff.cpf}
                  onChange={e => setNewStaff({ ...newStaff, cpf: e.target.value })}
                  className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 text-sm focus:ring-primary focus:border-primary"
                />
                <select 
                  value={newStaff.role}
                  onChange={e => setNewStaff({ ...newStaff, role: e.target.value as any })}
                  className="rounded-lg border-slate-200 dark:border-slate-700 text-sm focus:ring-primary focus:border-primary"
                >
                  <option value="driver">Motorista</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-bold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">Cadastrar</button>
            </form>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase">Lista de Acesso</h3>
              {staff.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className={`p-2 rounded-full ${member.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                    <span className="material-symbols-outlined text-sm">{member.role === 'admin' ? 'admin_panel_settings' : 'directions_bus'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{member.name}</p>
                    <p className="text-[10px] text-slate-400">{member.cpf} • {member.role.toUpperCase()}</p>
                  </div>
                  <button onClick={() => handleDeleteStaff(member.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
              <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-2">
                <span className="material-symbols-outlined">info</span>
                <p className="text-sm font-bold">Informação do Sistema</p>
              </div>
              <p className="text-xs text-indigo-500/80 leading-relaxed">
                Esta área permite o controle total das informações que os motoristas e alunos acessam. 
                Alterações aqui impactam todos os usuários em tempo real.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold">Mensagem de Boas-Vindas</h3>
                <p className="text-[11px] text-slate-500">Essa mensagem aparece brevemente para todos os usuários na tela de login.</p>
                <textarea 
                  value={welcomeMessage}
                  onChange={e => setWelcomeMessage(e.target.value)}
                  placeholder="Ex: 🚀 Bem-vindo ao School Pass! O sistema de transporte escolar inteligente."
                  rows={3}
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary p-3"
                />
              </div>
              <button 
                onClick={handleSaveSettings}
                className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-3 rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-md"
              >
                Salvar Configurações Globais
              </button>
            </div>

            <div className="p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold mb-4">Exportação de Dados</h3>
              <button 
                onClick={() => storageService.exportToCsv()}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-600 hover:bg-slate-200 transition-all"
              >
                <span className="material-symbols-outlined">database</span>
                Exportar Backup Completo (CSV)
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Support Access Level: HIGH</p>
      </footer>
    </div>
  );
};
