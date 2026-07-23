import { Student, Teacher, ClassInfo, AttendanceRecord, AttendanceStatus } from '@/types';

export const CLASSES: ClassInfo[] = [
  { id: '7A', nama: 'Kelas 7A', waliKelas: 'Siti Aminah, S.Pd', jumlahSiswa: 32 },
  { id: '7B', nama: 'Kelas 7B', waliKelas: 'Budi Santoso, S.Pd', jumlahSiswa: 30 },
  { id: '8A', nama: 'Kelas 8A', waliKelas: 'Dewi Rahayu, S.Pd', jumlahSiswa: 31 },
  { id: '8B', nama: 'Kelas 8B', waliKelas: 'Ahmad Fauzi, S.Pd', jumlahSiswa: 29 },
  { id: '9A', nama: 'Kelas 9A', waliKelas: 'Rina Kurnia, M.Pd', jumlahSiswa: 33 },
];

export const STUDENTS: Student[] = [
  { id: 's001', nama: 'Ahmad Rizki Pratama', nis: '2023001', kelas: '7A', gender: 'L', waliMurid: 'Hendra Pratama', noWali: '081234567890' },
  { id: 's002', nama: 'Siti Aisyah Putri', nis: '2023002', kelas: '7A', gender: 'P', waliMurid: 'Agus Setiawan', noWali: '082345678901' },
  { id: 's003', nama: 'Budi Prayoga', nis: '2023003', kelas: '7A', gender: 'L', waliMurid: 'Suparman', noWali: '083456789012' },
  { id: 's004', nama: 'Dewi Fitriani', nis: '2023004', kelas: '7A', gender: 'P', waliMurid: 'Slamet Riyanto', noWali: '084567890123' },
  { id: 's005', nama: 'Muhammad Farhan', nis: '2023005', kelas: '7A', gender: 'L', waliMurid: 'Kusno Wibowo', noWali: '085678901234' },
  { id: 's006', nama: 'Fatimah Zahra', nis: '2023006', kelas: '7A', gender: 'P', waliMurid: 'Zainuddin', noWali: '086789012345' },
  { id: 's007', nama: 'Rizky Maulana', nis: '2023007', kelas: '7A', gender: 'L', waliMurid: 'Tono Susanto', noWali: '087890123456' },
  { id: 's008', nama: 'Nur Aini Rahmah', nis: '2023008', kelas: '7A', gender: 'P', waliMurid: 'Rahmat Hidayat', noWali: '088901234567' },
  { id: 's009', nama: 'Dafa Ardiansyah', nis: '2023009', kelas: '7B', gender: 'L', waliMurid: 'Suryo Wibowo', noWali: '089012345678' },
  { id: 's010', nama: 'Ayu Fitriani', nis: '2023010', kelas: '7B', gender: 'P', waliMurid: 'Bambang Sudiro', noWali: '081023456789' },
  { id: 's011', nama: 'Ilham Saputra', nis: '2023011', kelas: '7B', gender: 'L', waliMurid: 'Joko Santoso', noWali: '082134567890' },
  { id: 's012', nama: 'Rahayu Wulandari', nis: '2023012', kelas: '7B', gender: 'P', waliMurid: 'Eko Prasojo', noWali: '083245678901' },
  { id: 's013', nama: 'Fauzan Akbar', nis: '2023013', kelas: '7B', gender: 'L', waliMurid: 'Hartono Subagyo', noWali: '084356789012' },
  { id: 's014', nama: 'Nabila Putri', nis: '2023014', kelas: '7B', gender: 'P', waliMurid: 'Supardi Nugroho', noWali: '085467890123' },
  { id: 's015', nama: 'Bagas Kurniawan', nis: '2022001', kelas: '8A', gender: 'L', waliMurid: 'Suwanto Kurniawan', noWali: '086578901234' },
  { id: 's016', nama: 'Citra Dewi', nis: '2022002', kelas: '8A', gender: 'P', waliMurid: 'Santoso Prijanto', noWali: '087689012345' },
  { id: 's017', nama: 'Hendra Wijaya', nis: '2022003', kelas: '8A', gender: 'L', waliMurid: 'Benny Hartadi', noWali: '088790123456' },
  { id: 's018', nama: 'Maya Sari', nis: '2022004', kelas: '8A', gender: 'P', waliMurid: 'Gunawan Susilo', noWali: '089801234567' },
  { id: 's019', nama: 'Reza Pratama', nis: '2022005', kelas: '8A', gender: 'L', waliMurid: 'Doni Supratno', noWali: '081912345678' },
  { id: 's020', nama: 'Anisa Rahma', nis: '2022006', kelas: '8A', gender: 'P', waliMurid: 'Wahid Suroso', noWali: '082023456789' },
  { id: 's021', nama: 'Gilang Ramadhan', nis: '2022007', kelas: '8B', gender: 'L', waliMurid: 'Arif Budiman', noWali: '083134567890' },
  { id: 's022', nama: 'Putri Amalia', nis: '2022008', kelas: '8B', gender: 'P', waliMurid: 'Fadli Haryanto', noWali: '084245678901' },
  { id: 's023', nama: 'Arif Rahman', nis: '2022009', kelas: '8B', gender: 'L', waliMurid: 'Harun Alrasyid', noWali: '085356789012' },
  { id: 's024', nama: 'Sari Kusuma', nis: '2022010', kelas: '8B', gender: 'P', waliMurid: 'Pandi Susanto', noWali: '086467890123' },
  { id: 's025', nama: 'Dimas Setyawan', nis: '2022011', kelas: '8B', gender: 'L', waliMurid: 'Agung Triwibowo', noWali: '087578901234' },
  { id: 's026', nama: 'Rina Fitriana', nis: '2022012', kelas: '8B', gender: 'P', waliMurid: 'Basuki Pramono', noWali: '088689012345' },
  { id: 's027', nama: 'Evan Prasetyo', nis: '2021001', kelas: '9A', gender: 'L', waliMurid: 'Tito Wahyono', noWali: '089790123456' },
  { id: 's028', nama: 'Fina Agustina', nis: '2021002', kelas: '9A', gender: 'P', waliMurid: 'Asep Rohman', noWali: '081801234567' },
  { id: 's029', nama: 'Galih Permana', nis: '2021003', kelas: '9A', gender: 'L', waliMurid: 'Dedy Setiabudi', noWali: '082912345678' },
  { id: 's030', nama: 'Hana Safitri', nis: '2021004', kelas: '9A', gender: 'P', waliMurid: 'Rudy Sudarsono', noWali: '083023456789' },
  { id: 's031', nama: 'Ivan Setiawan', nis: '2021005', kelas: '9A', gender: 'L', waliMurid: 'Warto Hariyanto', noWali: '084134567890' },
  { id: 's032', nama: 'Jihan Ramadhani', nis: '2021006', kelas: '9A', gender: 'P', waliMurid: 'Yusuf Efendi', noWali: '085245678901' },
];

export const TEACHERS: Teacher[] = [
  { id: 't001', nama: 'Siti Aminah, S.Pd', nip: '198001012005012001', mapel: 'Matematika', jabatan: 'Wali Kelas 7A', kelasWali: '7A' },
  { id: 't002', nama: 'Budi Santoso, S.Pd', nip: '197905152003011002', mapel: 'Bahasa Indonesia', jabatan: 'Wali Kelas 7B', kelasWali: '7B' },
  { id: 't003', nama: 'Dewi Rahayu, S.Pd', nip: '198203202006012003', mapel: 'IPA', jabatan: 'Wali Kelas 8A', kelasWali: '8A' },
  { id: 't004', nama: 'Ahmad Fauzi, S.Pd', nip: '197712102002011004', mapel: 'IPS', jabatan: 'Wali Kelas 8B', kelasWali: '8B' },
  { id: 't005', nama: 'Rina Kurnia, M.Pd', nip: '198609082010012005', mapel: 'Bahasa Inggris', jabatan: 'Wali Kelas 9A', kelasWali: '9A' },
  { id: 't006', nama: 'Hendra Purnama, S.Pd', nip: '198104162007011006', mapel: 'PJOK', jabatan: 'Guru Mapel' },
  { id: 't007', nama: 'Lestari Wahyu, S.Pd', nip: '198507272009012007', mapel: 'PKn', jabatan: 'Guru Mapel' },
  { id: 't008', nama: 'Dr. Muhammad Arief', nip: '197303012001011008', mapel: '-', jabatan: 'Kepala Sekolah' },
];

function getStatusByIndex(studentIdx: number, dayOffset: number): AttendanceStatus {
  const hash = ((studentIdx + 1) * 17 + dayOffset * 31) % 100;
  if (hash < 80) return 'hadir';
  if (hash < 88) return 'terlambat';
  if (hash < 94) return 'izin';
  if (hash < 97) return 'sakit';
  return 'alpha';
}

export function generateInitialAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOffset);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateStr = date.toISOString().split('T')[0];

    STUDENTS.forEach((student, idx) => {
      const status = getStatusByIndex(idx, dayOffset);
      records.push({
        id: `rec-${dateStr}-${student.id}`,
        studentId: student.id,
        tanggal: dateStr,
        kelas: student.kelas,
        status,
        waktuAbsen: status === 'hadir' ? '06:45' : status === 'terlambat' ? '07:28' : undefined,
      });
    });
  }

  return records;
}
