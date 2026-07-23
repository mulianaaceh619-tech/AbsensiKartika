export type AttendanceStatus = 'hadir' | 'terlambat' | 'alpha' | 'izin' | 'sakit';
export type UserRole = 'admin' | 'guru' | 'siswa';

export interface Student {
  id: string;
  nama: string;
  nis: string;
  kelas: string;
  gender: 'L' | 'P';
  waliMurid: string;
  noWali: string;
}

export interface Teacher {
  id: string;
  nama: string;
  nip: string;
  mapel: string;
  jabatan: string;
  kelasWali?: string;
}

export interface ClassInfo {
  id: string;
  nama: string;
  waliKelas: string;
  jumlahSiswa: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  tanggal: string;
  kelas: string;
  status: AttendanceStatus;
  keterangan?: string;
  waktuAbsen?: string;
}

export interface AppUser {
  id: string;
  nama: string;
  role: UserRole;
  email: string;
  kelas?: string;
}

export interface AttendanceSummary {
  hadir: number;
  terlambat: number;
  alpha: number;
  izin: number;
  sakit: number;
  total: number;
}
