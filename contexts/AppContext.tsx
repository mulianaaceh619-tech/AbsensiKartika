import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppUser, Student, Teacher, AttendanceRecord, AttendanceStatus, UserRole } from '@/types';
import { STUDENTS, TEACHERS, CLASSES, generateInitialAttendance } from '@/services/mockData';
import type { ClassInfo } from '@/types';

interface AppContextType {
  currentUser: AppUser | null;
  login: (role: UserRole) => void;
  logout: () => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  removeStudent: (id: string) => void;
  teachers: Teacher[];
  classes: ClassInfo[];
  attendanceRecords: AttendanceRecord[];
  getAttendanceForDate: (date: string, kelas?: string) => AttendanceRecord[];
  saveAttendanceForDate: (date: string, kelas: string, statusMap: Record<string, AttendanceStatus>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MOCK_USERS: Record<UserRole, AppUser> = {
  admin: { id: 'u001', nama: 'Administrator', role: 'admin', email: 'admin@smpkartika.sch.id' },
  guru: { id: 'u002', nama: 'Siti Aminah, S.Pd', role: 'guru', email: 'siti@smpkartika.sch.id', kelas: '7A' },
  siswa: { id: 'u003', nama: 'Ahmad Rizki Pratama', role: 'siswa', email: 'rizki@smpkartika.sch.id', kelas: '7A' },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => generateInitialAttendance());

  const login = useCallback((role: UserRole) => {
    setCurrentUser(MOCK_USERS[role]);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addStudent = useCallback((studentData: Omit<Student, 'id'>) => {
    const id = `s${Date.now()}`;
    setStudents(prev => [...prev, { ...studentData, id }]);
  }, []);

  const removeStudent = useCallback((id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setAttendanceRecords(prev => prev.filter(r => r.studentId !== id));
  }, []);

  const getAttendanceForDate = useCallback((date: string, kelas?: string): AttendanceRecord[] => {
    return attendanceRecords.filter(r =>
      r.tanggal === date && (!kelas || r.kelas === kelas)
    );
  }, [attendanceRecords]);

  const saveAttendanceForDate = useCallback((date: string, kelas: string, statusMap: Record<string, AttendanceStatus>) => {
    setAttendanceRecords(prev => {
      const filtered = prev.filter(r => !(r.tanggal === date && r.kelas === kelas));
      const newRecords: AttendanceRecord[] = Object.entries(statusMap).map(([studentId, status]) => ({
        id: `rec-${date}-${studentId}`,
        studentId,
        tanggal: date,
        kelas,
        status,
        waktuAbsen: status === 'hadir' ? '07:00' : status === 'terlambat' ? '07:30' : undefined,
      }));
      return [...filtered, ...newRecords];
    });
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      students, addStudent, removeStudent,
      teachers: TEACHERS,
      classes: CLASSES,
      attendanceRecords, getAttendanceForDate, saveAttendanceForDate,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
