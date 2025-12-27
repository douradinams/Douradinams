
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { Student } from '../types';
import { Header } from '../components/Header';

interface StudentViewPageProps {
  studentId: string;
  onBack: () => void;
}

export const StudentViewPage: React.FC<StudentViewPageProps> = ({ studentId, onBack }) => {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const s = storageService.getStudentById(studentId);
    if (s) setStudent(s);
  }, [studentId]);

  const handleShare = async () => {
    if (!student) return;
    
    // Em alguns ambientes de preview ou desenvolvimento, window.location.href pode não ser uma URL HTTP/HTTPS válida
    const rawUrl = window.location.href;
    const isValidUrl = rawUrl.startsWith('http');

    try {
      if (navigator.share) {
        const shareData: any = {
          title: `Carteirinha Escolar - ${student.name}`,
          text: `Confira a carteirinha de transporte escolar de ${student.name}.`,
        };

        // Só inclui a URL se ela for válida (absoluta e HTTP/HTTPS)
        if (isValidUrl) {
          shareData.url = rawUrl;
        }

        await navigator.share(shareData);
      } else {
        // Fallback: Tenta copiar para o clipboard se o navegador suportar
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(rawUrl);
          alert('Link da carteirinha copiado para a área de transferência!');
        } else {
          alert('O compartilhamento nativo não é suportado neste navegador. Tente baixar o PDF.');
        }
      }
    } catch (err: any) {
      // Se o erro for especificamente sobre a URL, tenta compartilhar apenas o texto
      if (err.name === 'TypeError' || (err.message && err.message.includes('URL'))) {
        try {
          await navigator.share({
            title: `Carteirinha Escolar - ${student.name}`,
            text: `Confira a carteirinha de transporte escolar de ${student.name}.`,
          });
          return;
        } catch (retryErr) {
          console.error('Erro na segunda tentativa de compartilhamento:', retryErr);
        }
      }
      console.error('Erro ao compartilhar:', err);
    }
  };

  if (!student) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-slate-500 font-medium">Carregando dados da carteirinha...</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark">
      <Header 
        title="Carteirinha Escolar" 
        leftAction={
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        }
        rightAction={
          <button onClick={handleShare} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
        }
      />

      <div id="printable-card-area" className="flex-1 flex flex-col items-center px-4 py-6 w-full">
        <div className="text-center mb-6 no-print">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Passe Digital Disponível</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Esta versão digital é válida para embarque. Para a versão física, use o botão abaixo.
          </p>
        </div>

        {/* Card Container com ID para Seleção de Impressão */}
        <div id="student-card" className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative transition-all">
          
          {/* TOP HALF - Identificação Principal */}
          <div className="p-6 flex flex-col gap-5">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-[24px]">school</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none mb-1">Passe Estudantil</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">ANO LETIVO {new Date().getFullYear()}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="h-10 w-10 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400">
                   <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
                </div>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-28 h-36 shrink-0 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden relative shadow-md border border-slate-200 dark:border-slate-700">
                <img 
                  src={student.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} 
                  className="w-full h-full object-cover" 
                  alt={student.name}
                />
                {!student.photoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                     <span className="material-symbols-outlined text-4xl">account_circle</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1 justify-center gap-3">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Nome do Titular</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">{student.name}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Instituição</p>
                  <p className="text-xs font-bold text-primary dark:text-blue-400 leading-tight">{student.school}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Documento</p>
                    <p className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">{student.cpf}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Matrícula</p>
                    <p className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">#{student.registrationNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOLD LINE - Divisor com Picote Visual */}
          <div className="relative w-full h-10 flex items-center justify-center no-print">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] dashed-line opacity-50"></div>
            <div className="bg-white dark:bg-slate-800 px-4 z-10 text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">content_cut</span> Linha de Dobra
            </div>
            {/* Entalhes laterais (furos de picote) */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-background-light dark:bg-background-dark rounded-full border border-slate-200 dark:border-slate-700 shadow-inner"></div>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-background-light dark:bg-background-dark rounded-full border border-slate-200 dark:border-slate-700 shadow-inner"></div>
          </div>

          {/* BOTTOM HALF - Detalhes e Emergência */}
          <div className="p-6 pt-3 flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Filiação/Responsável</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{student.parents}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Data de Nasc.</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{new Date(student.birthDate).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-700/50 w-full"></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Emergência</p>
                  <p className="text-sm font-black text-red-600 dark:text-red-400">{student.emergencyPhone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-6 bg-red-100 dark:bg-red-900/30 rounded flex items-center justify-center text-red-600 dark:text-red-400">
                    <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>bloodtype</span>
                  </div>
                  <span className="text-xs font-bold">{student.bloodType}</span>
                </div>
              </div>
              <div className="flex flex-col justify-end items-end">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center min-w-[100px]">
                  <p className="text-[8px] uppercase font-bold text-slate-400 mb-1">PCD/Necessidade</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${student.specialNeeds ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {student.specialNeeds ? 'POSSUI' : 'NÃO POSSUI'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-2 w-full bg-gradient-to-r from-primary via-blue-400 to-primary"></div>
        </div>

        {/* Action Buttons - Ocultos na Impressão */}
        <div className="mt-8 w-full flex flex-col gap-3 no-print">
          <button 
            onClick={() => window.print()}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 px-4 text-center text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined group-hover:animate-bounce">picture_as_pdf</span>
            Baixar PDF / Imprimir
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 py-3.5 px-4 text-center text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all"
            >
              <span className="material-symbols-outlined text-base">share</span>
              Compartilhar
            </button>
            <button 
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 py-3.5 px-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-200 transition-all"
            >
              <span className="material-symbols-outlined text-base">close</span>
              Fechar
            </button>
          </div>

          <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-center">
              <strong>Dica:</strong> Ao clicar em "Baixar PDF", selecione a impressora <b>"Salvar como PDF"</b> no seu dispositivo para gerar o arquivo.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-auto py-4 w-full text-center no-print">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal de Transporte v2.5</p>
      </footer>
    </div>
  );
};
