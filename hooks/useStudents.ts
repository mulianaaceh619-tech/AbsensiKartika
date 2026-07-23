import { useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';

export function useStudents() {
  const { students, teachers, classes, addStudent, removeStudent } = useAppContext();

  const getStudentsByClass = useCallback((kelas: string) => {
    return students.filter(s => s.kelas === kelas);
  }, [students]);

  const searchStudents = useCallback((query: string) => {
    const q = query.toLowerCase();
    return students.filter(s =>
      s.nama.toLowerCase().includes(q) || s.nis.includes(q)
    );
  }, [students]);

  return {
    students,
    teachers,
    classes,
    getStudentsByClass,
    searchStudents,
    addStudent,
    removeStudent,
  };
}
