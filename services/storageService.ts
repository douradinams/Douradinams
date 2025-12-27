
import { Student, StudentStatus, School, StaffMember } from '../types';

const STUDENTS_KEY = 'school_pass_students_db';
const SCHOOLS_KEY = 'school_pass_schools_db';
const STAFF_KEY = 'school_pass_staff_db';
const SETTINGS_KEY = 'school_pass_settings_db';

interface AppSettings {
  welcomeMessage: string;
}

const defaultSettings: AppSettings = {
  welcomeMessage: "🚀 Bem-vindo ao School Pass! O sistema de transporte escolar inteligente."
};

const initialSchools: School[] = [
  { id: '1', name: 'Colégio Integração' },
  { id: '2', name: 'Escola Estadual Modelo' }
];

const initialStaff: StaffMember[] = [
  { id: '1', name: 'Motorista Ricardo', cpf: '111.111.111-11', role: 'driver' },
  { id: 'admin-1', name: 'Admin Principal', cpf: '000.000.000-00', role: 'admin' }
];

export const storageService = {
  // --- Settings ---
  getSettings: (): AppSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : defaultSettings;
  },
  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  // --- Students ---
  getStudents: (): Student[] => {
    const data = localStorage.getItem(STUDENTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveStudent: (student: any): Student => {
    const students = storageService.getStudents();
    let newStudent: Student;
    if (student.id) {
      const index = students.findIndex(s => s.id === student.id);
      newStudent = { ...students[index], ...student };
      students[index] = newStudent;
    } else {
      const id = Math.random().toString(36).substr(2, 9);
      newStudent = { ...student, id, registrationNumber: `2024-${Math.floor(100+Math.random()*899)}`, createdAt: Date.now() };
      students.push(newStudent);
    }
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    return newStudent;
  },

  // --- Schools ---
  getSchools: (): School[] => {
    const data = localStorage.getItem(SCHOOLS_KEY);
    if (!data) {
      localStorage.setItem(SCHOOLS_KEY, JSON.stringify(initialSchools));
      return initialSchools;
    }
    return JSON.parse(data);
  },
  addSchool: (name: string): School => {
    const schools = storageService.getSchools();
    const newSchool = { id: Math.random().toString(36).substr(2, 9), name };
    schools.push(newSchool);
    localStorage.setItem(SCHOOLS_KEY, JSON.stringify(schools));
    return newSchool;
  },
  deleteSchool: (id: string) => {
    const schools = storageService.getSchools().filter(s => s.id !== id);
    localStorage.setItem(SCHOOLS_KEY, JSON.stringify(schools));
  },

  // --- Staff ---
  getStaff: (): StaffMember[] => {
    const data = localStorage.getItem(STAFF_KEY);
    if (!data) {
      localStorage.setItem(STAFF_KEY, JSON.stringify(initialStaff));
      return initialStaff;
    }
    return JSON.parse(data);
  },
  addStaff: (member: Omit<StaffMember, 'id'>): StaffMember => {
    const staff = storageService.getStaff();
    const newMember = { ...member, id: Math.random().toString(36).substr(2, 9) };
    staff.push(newMember);
    localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
    return newMember;
  },
  deleteStaff: (id: string) => {
    const staff = storageService.getStaff().filter(s => s.id !== id);
    localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
  },
  getStaffByCpf: (cpf: string) => storageService.getStaff().find(s => s.cpf === cpf),

  // --- Utils ---
  getStudentById: (id: string) => storageService.getStudents().find(s => s.id === id),
  getStudentByCpfAndBirth: (cpf: string, birth: string) => 
    storageService.getStudents().find(s => s.cpf === cpf && s.birthDate === birth),
  exportToCsv: () => {
    const students = storageService.getStudents();
    const csv = "Nome,CPF,Escola\n" + students.map(s => `${s.name},${s.cpf},${s.school}`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'estudantes.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
