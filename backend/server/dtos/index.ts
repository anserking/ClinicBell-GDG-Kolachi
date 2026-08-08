export type UserRole = 'admin' | 'doctor' | 'patient';

export interface LoginRequestDto {
  cnic: string;
  password: string;
  hospitalName: string;
  role: UserRole;
}

export interface LoginResponseDto {
  token: string;
  user: {
    id: string;
    cnic: string;
    name: string;
    phone: string;
    role: UserRole;
    hospitalName: string;
    specialty?: string;
    age?: number;
    gender?: 'Male' | 'Female' | 'Other';
  };
}

export interface RegisterDoctorDto {
  cnic: string;
  password: string;
  name: string;
  phone: string;
  specialty: string;
  hospitalName: string;
}

export interface DoctorResponseDto {
  id: string;
  cnic: string;
  name: string;
  phone: string;
  specialty: string;
  hospitalName: string;
  registeredAt: string;
  whatsappStatus: 'sent' | 'pending';
}

export interface RegisterCustomerDto {
  cnic: string;
  password: string;
  name: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  hospitalName: string;
}

export interface CustomerResponseDto {
  id: string;
  cnic: string;
  name: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  hospitalName: string;
  registeredAt: string;
  whatsappStatus: 'sent' | 'pending';
}

export interface CreateVisitDto {
  patientId: string;
  doctorId: string;
  rawNote: string;
  diagnosis?: string;
  prescription?: string;
  followupDelay?: string;
  followupMessage?: string;
}
