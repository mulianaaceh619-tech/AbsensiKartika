import { useAppContext } from '@/contexts/AppContext';
import { AttendanceSummary } from '@/types';

export function useAttendance() {
  const { attendanceRecords, getAttendanceForDate, saveAttendanceForDate } = useAppContext();

  function getSummaryFromRecords(records: ReturnType<typeof getAttendanceForDate>): AttendanceSummary {
    const s: AttendanceSummary = { hadir: 0, terlambat: 0, alpha: 0, izin: 0, sakit: 0, total: records.length };
    records.forEach(r => { s[r.status]++; });
    return s;
  }

  function getTodaySummary(): AttendanceSummary {
    const today = new Date().toISOString().split('T')[0];
    return getSummaryFromRecords(getAttendanceForDate(today));
  }

  function getClassSummaryForDate(date: string, kelas: string): AttendanceSummary {
    return getSummaryFromRecords(getAttendanceForDate(date, kelas));
  }

  function getWeeklySummary(): AttendanceSummary {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const records = attendanceRecords.filter(r => new Date(r.tanggal) >= weekAgo);
    return getSummaryFromRecords(records);
  }

  function getMonthlySummary(): AttendanceSummary {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const records = attendanceRecords.filter(r => new Date(r.tanggal) >= monthStart);
    return getSummaryFromRecords(records);
  }

  return {
    attendanceRecords,
    getAttendanceForDate,
    saveAttendanceForDate,
    getTodaySummary,
    getClassSummaryForDate,
    getWeeklySummary,
    getMonthlySummary,
  };
}
