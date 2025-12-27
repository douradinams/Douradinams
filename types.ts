
export enum StudentStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  INACTIVE = 'Inactive'
}

export interface School {
  id: string;
  name: string;
  address?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  cpf: string;
  role: 'driver' | 'admin';
}

export interface Student {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  parents: string;
  phone: string;
  emergencyPhone: string;
  bloodType: string;
  specialNeeds: boolean;
  school: string;
  photoUrl?: string;
  status: StudentStatus;
  registrationNumber: string;
  createdAt: number;
}

export type AuthUser = {
  role: 'staff' | 'student' | 'support';
  id?: string;
  name?: string;
} | null;
