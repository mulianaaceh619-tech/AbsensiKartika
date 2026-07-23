import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAttendance } from '@/hooks/useAttendance';
import { useStudents } from '@/hooks/useStudents';
import { useAlert } from '@/template';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { AttendanceStatus } from '@/types';
import { AvatarCircle } from '@/components';

const STATUSES: Array<{ value: AttendanceStatus; label: string; color: string }> = [
  { value: 'hadir', label: 'H', color: Colors.hadir },
  { value: 'terlambat', label: 'T', color: Colors.terlambat },
  { value: 'izin', label: 'I', color: Colors.izin },
  { value: 'sakit', label: 'S', color: Colors.sakit },
  { value: 'alpha', label: 'A', color: Colors.alpha },
];

export default function AbsensiScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { getAttendanceForDate, saveAttendanceForDate } = useAttendance();
  const { classes, getStudentsByClass, students } = useStudents();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate] = useState(todayStr);
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '7A');
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});

  const classStudents = useMemo(() => getStudentsByClass(selectedClass), [selectedClass, students]);

  useEffect(() => {
    const records = getAttendanceForDate(selectedDate, selectedClass);
    const map: Record<string, AttendanceStatus> = {};
    records.forEach(r => { map[r.studentId] = r.status; });
    classStudents.forEach(s => { if (!map[s.id]) map[s.id] = 'hadir'; });
    setStatusMap(map);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedClass, classStudents.length]);

  const setStatus = useCallback((studentId: string, status: AttendanceStatus) => {
    setStatusMap(prev => ({ ...prev, [studentId]: status }));
  }, []);

  const handleSave = () => {
    saveAttendanceForDate(selectedDate, selectedClass, statusMap);
    showAlert('Berhasil', 'Data absensi berhasil disimpan');
  };

  const summary = useMemo(() => {
    const counts = { hadir: 0, terlambat: 0, izin: 0, sakit: 0, alpha: 0 };
    Object.values(statusMap).forEach((s: AttendanceStatus) => { counts[s]++; });
    return counts;
  }, [statusMap]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Input Absensi</Text>
        <Text style={styles.headerDate}>{formatDate(selectedDate)}</Text>
        <View style={styles.summaryRow}>
          {STATUSES.map(s => (
            <View key={s.value} style={[styles.summaryItem, { borderColor: s.color }]}>
              <Text style={[styles.summaryVal, { color: s.color }]}>{summary[s.value]}</Text>
              <Text style={styles.summaryLbl}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.classSelectorWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.classSelectorContent}>
          {classes.map(cls => (
            <Pressable
              key={cls.id}
              style={[styles.classTab, selectedClass === cls.id && styles.classTabActive]}
              onPress={() => setSelectedClass(cls.id)}
            >
              <Text style={[styles.classTabTxt, selectedClass === cls.id && styles.classTabTxtActive]}>
                {cls.id}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={classStudents}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        renderItem={({ item }) => {
          const cur = statusMap[item.id] || 'hadir';
          return (
            <View style={styles.studentRow}>
              <AvatarCircle name={item.nama} size={40} fontSize={13} />
              <View style={styles.studentInfo}>
                <Text style={styles.studentName} numberOfLines={1}>{item.nama}</Text>
                <Text style={styles.studentNis}>NIS: {item.nis}</Text>
              </View>
              <View style={styles.statusBtns}>
                {STATUSES.map(s => (
                  <Pressable
                    key={s.value}
                    style={[styles.statusBtn, { borderColor: s.color }, cur === s.value && { backgroundColor: s.color }]}
                    onPress={() => setStatus(item.id, s.value)}
                    hitSlop={{ top: 6, bottom: 6, left: 3, right: 3 }}
                  >
                    <Text style={[styles.statusBtnTxt, { color: cur === s.value ? '#FFF' : s.color }]}>
                      {s.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
      />

      <View style={[styles.saveWrap, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.9 }]}
          onPress={handleSave}
        >
          <MaterialIcons name="save" size={20} color="#FFF" />
          <Text style={styles.saveBtnTxt}>Simpan Absensi ({classStudents.length} Siswa)</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textOnPrimary },
  headerDate: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2, marginBottom: Spacing.sm },
  summaryRow: { flexDirection: 'row', gap: Spacing.sm },
  summaryItem: {
    flex: 1, alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.sm, paddingVertical: Spacing.xs, borderWidth: 1,
  },
  summaryVal: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  summaryLbl: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)' },
  classSelectorWrap: { backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  classSelectorContent: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm },
  classTab: {
    paddingHorizontal: Spacing.md, paddingVertical: 7, borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceAlt, minWidth: 44, alignItems: 'center',
  },
  classTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  classTabTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  classTabTxtActive: { color: Colors.textOnPrimary },
  listContent: { padding: Spacing.md },
  studentRow: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, ...Shadow.sm,
  },
  studentInfo: { flex: 1 },
  studentName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  studentNis: { fontSize: FontSize.xs, color: Colors.textMuted },
  statusBtns: { flexDirection: 'row', gap: 4 },
  statusBtn: {
    width: 30, height: 30, borderRadius: 7, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  statusBtnTxt: { fontSize: 10, fontWeight: FontWeight.bold },
  saveWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.md, backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border, ...Shadow.md,
  },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: Spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  saveBtnTxt: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textOnPrimary },
});
