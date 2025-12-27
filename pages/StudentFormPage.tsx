
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Student, StudentStatus, School } from '../types';

interface StudentFormPageProps {
  studentId?: string;
  onCancel: () => void;
  onSave: () => void;
}

export const StudentFormPage: React.FC<StudentFormPageProps> = ({ studentId, onCancel, onSave }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    cpf: '',
    birthDate: '',
    parents: '',
    phone: '',
    emergencyPhone: '',
    bloodType: 'O+',
    specialNeeds: false,
    school: '',
    status: StudentStatus.PENDING,
    photoUrl: ''
  });

  useEffect(() => {
    const list = storageService.getSchools();
    setSchools(list);
    if (list.length > 0) setFormData(prev => ({ ...prev, school: list[0].name }));

    if (studentId) {
      const existing = storageService.getStudentById(studentId);
      if (existing) setFormData(existing);
    }
  }, [studentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveStudent(formData as any);
    onSave();
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-white dark:bg-[#101922] border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onCancel} className="text-gray-500 font-medium text-base">Voltar</button>
          <div className="flex flex-col items-center">
             <span className="material-symbols-outlined text-primary text-xl">school</span>
            <h1 className="text-sm font-bold">{studentId ? 'Editar Perfil' : 'Novo Registro'}</h1>
          </div>
          <button onClick={handleSubmit} className="text-primary font-bold text-base">Salvar</button>
        </div>
      </header>

      <main className="flex-1 w-full pb-12 overflow-y-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="flex flex-col items-center mb-4">
             <div 
              className="w-24 h-32 rounded-xl bg-slate-200 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => {
                const url = prompt('URL da foto 3x4:');
                if(url) setFormData({...formData, photoUrl: url, status: StudentStatus.ACTIVE});
              }}
            >
              {formData.photoUrl ? (
                <img src={formData.photoUrl} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-3xl text-slate-400">add_a_photo</span>
              )}
            </div>
            <p className="text-[10px] font-bold text-primary mt-3 uppercase">Tirar ou Carregar Foto</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Nome do Aluno</label>
              <input 
                className="w-full p-3 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Nome completo"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">CPF</label>
                <input 
                  className="w-full p-3 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  value={formData.cpf}
                  onChange={e => setFormData({...formData, cpf: e.target.value})}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Nascimento</label>
                <input 
                  type="date"
                  className="w-full p-3 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  value={formData.birthDate}
                  onChange={e => setFormData({...formData, birthDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Instituição</label>
              <select 
                className="w-full p-3 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                value={formData.school}
                onChange={e => setFormData({...formData, school: e.target.value})}
              >
                {schools.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                {schools.length === 0 && <option disabled>Nenhuma escola cadastrada</option>}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Telefone Responsável</label>
                <input 
                  className="w-full p-3 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Tipo Sanguíneo</label>
                <select 
                  className="w-full p-3 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  value={formData.bloodType}
                  onChange={e => setFormData({...formData, bloodType: e.target.value})}
                >
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl">
            Confirmar Cadastro
          </button>
        </form>
      </main>
    </div>
  );
};
