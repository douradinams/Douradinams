
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Student, StudentStatus } from '../types';
import { Header } from '../components/Header';

interface DashboardPageProps {
  onEdit: (id: string) => void;
  onNew: () => void;
  onView: (id: string) => void;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onEdit, onNew, onView, onLogout }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setStudents(storageService.getStudents());
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.registrationNumber.includes(search)
  );

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl">
      <Header 
        title="School Pass" 
        subtitle="Staff Dashboard" 
        rightAction={
          <button onClick={onLogout} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined">logout</span>
          </button>
        }
      />

      <main className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        <section className="flex flex-col gap-4">
          <button 
            onClick={onNew}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary-hover transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Novo Estudante</span>
          </button>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-lg border-0 bg-white dark:bg-surface-dark py-3.5 pl-10 pr-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-primary sm:text-sm"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estudantes Registrados</h2>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{filteredStudents.length} Total</span>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-slate-400">Nenhum estudante encontrado.</div>
          ) : (
            filteredStudents.map(student => (
              <div key={student.id} className="flex flex-col gap-4 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                    <img 
                      src={student.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} 
                      className="w-full h-full object-cover" 
                      alt={student.name}
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{student.name}</h3>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        student.status === StudentStatus.ACTIVE ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                        student.status === StudentStatus.PENDING ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' : 
                        'bg-slate-50 text-slate-600 ring-slate-500/10'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Escola: {student.school}</p>
                    <p className="text-xs text-slate-400 mt-1">ID: #{student.registrationNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => onEdit(student.id)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Editar
                  </button>
                  <button 
                    onClick={() => onView(student.id)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    Ver Passe
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        <div className="mt-4 flex justify-center">
            <button 
              onClick={() => storageService.exportToCsv()}
              className="text-xs text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Exportar Planilha (CSV)
            </button>
        </div>
      </main>

      <footer className="mt-auto py-6 flex flex-col items-center justify-center gap-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark">
        <div className="flex items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span className="text-xs font-medium">Conexão Segura</span>
        </div>
        <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Richardt Software</p>
      </footer>
    </div>
  );
};
