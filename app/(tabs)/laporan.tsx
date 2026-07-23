import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAttendance } from '@/hooks/useAttendance';
import { useStudents } from '@/hooks/useStudents';
import { useAlert } from '@/template';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { AttendanceSummary } from '@/types';

type PeriodType = 'hari' | 'minggu' | 'bulan';

const PERIOD_LABELS: Record<PeriodType, string> = { hari: 'Hari Ini', minggu: 'Minggu Ini', bulan: 'Bulan Ini' };

export default function LaporanScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { getTodaySummary, getWeeklySummary, getMonthlySummary, attendanceRecords } = useAttendance();
  const { classes, students } = useStudents();

  const [period, setPeriod] = useState<PeriodType>('hari');
  const [filterClass, setFilterClass] = useState('Semua');

  const summary: AttendanceSummary = useMemo(() => {
    if (period === 'hari') return getTodaySummary();
    if (period === 'minggu') return getWeeklySummary();
    return getMonthlySummary();
  }, [period, attendanceRecords]);

  const pct = (v: number) => summary.total > 0 ? Math.round(v / summary.total * 100) : 0;

  const classSummaries = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    return classes
      .filter(c => filterClass === 'Semua' || c.id === filterClass)
      .map(cls => {
        let recs = attendanceRecords.filter(r => r.kelas === cls.id);
        if (period === 'hari') recs = recs.filter(r => r.tanggal === today);
        else if (period === 'minggu') recs = recs.filter(r => new Date(r.tanggal) >= weekAgo);
        else recs = recs.filter(r => new Date(r.tanggal) >= monthStart);

        const c = { hadir: 0, terlambat: 0, alpha: 0, izin: 0, sakit: 0 };
        recs.forEach(r => { c[r.status]++; });
        const hadirPct = recs.length > 0 ? Math.round((c.hadir + c.terlambat) / recs.length * 100) : 0;
        return { ...cls, c, hadirPct, total: recs.length, studentCount: students.filter(s => s.kelas === cls.id).length };
      });
  }, [classes, filterClass, period, attendanceRecords, students]);

  const classFilters = ['Semua', ...classes.map(c => c.id)];

  const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <View style={styles.statBarRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.statBarLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct(value)}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[styles.barPct, { color }]}>{pct(value)}%</Text>
      <Text style={styles.barCount}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Laporan Absensi</Text>
          <Pressable
            style={({ pressed }) => [styles.exportBtn, pressed && { opacity: 0.8 }]}
            onPress={() => showAlert('Export Excel', 'Fitur export .xlsx akan segera hadir. Data absensi lengkap siap untuk didownload.')}
          >
            <MaterialIcons name="download" size={17} color={Colors.primary} />
            <Text style={styles.exportTxt}>Export</Text>
          </Pressable>
        </View>
        <View style={styles.periodRow}>
          {(['hari', 'minggu', 'bulan'] as PeriodType[]).map(p => (
            <Pressable key={p} style={[styles.periodBtn, period === p && styles.periodBtnOn]} onPress={() => setPeriod(p)}>
              <Text style={[styles.periodTxt, period === p && styles.periodTxtOn]}>{PERIOD_LABELS[p]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan {PERIOD_LABELS[period]}</Text>
          <Text style={styles.summaryTotal}>Total {summary.total} catatan absensi</Text>
          <StatBar label="Hadir" value={summary.hadir} color={Colors.hadir} />
          <StatBar label="Terlambat" value={summary.terlambat} color={Colors.terlambat} />
          <StatBar label="Izin" value={summary.izin} color={Colors.izin} />
          <StatBar label="Sakit" value={summary.sakit} color={Colors.sakit} />
          <StatBar label="Alpha" value={summary.alpha} color={Colors.alpha} />
        </View>

        <View style={styles.filterRowWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
            {classFilters.map(c => (
              <Pressable key={c} style={[styles.chip, filterClass === c && styles.chipOn]} onPress={() => setFilterClass(c)}>
                <Text style={[styles.chipTxt, filterClass === c && styles.chipTxtOn]}>{c}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Detail Per Kelas</Text>
        {classSummaries.map(cls => {
          const color = cls.hadirPct >= 85 ? Colors.hadir : cls.hadirPct >= 70 ? Colors.terlambat : Colors.alpha;
          return (
            <View key={cls.id} style={styles.classCard}>
              <View style={styles.classRow}>
                <View style={styles.classBadge}>
                  <Text style={styles.classBadgeTxt}>{cls.id}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.className}>{cls.nama}</Text>
                  <Text style={styles.classWali}>{cls.waliKelas}</Text>
                </View>
                <View style={styles.pctCol}>
                  <Text style={[styles.pctVal, { color }]}>{cls.hadirPct}%</Text>
                  <Text style={styles.pctLbl}>kehadiran</Text>
                </View>
              </View>
              <View style={styles.miniRow}>
                {[
                  { label: 'Hadir', v: cls.c.hadir, color: Colors.hadir, bg: Colors.hadirBg },
                  { label: 'Telat', v: cls.c.terlambat, color: Colors.terlambat, bg: Colors.terlambatBg },
                  { label: 'Alpha', v: cls.c.alpha, color: Colors.alpha, bg: Colors.alphaBg },
                  { label: 'Izin', v: cls.c.izin, color: Colors.izin, bg: Colors.izinBg },
                  { label: 'Sakit', v: cls.c.sakit, color: Colors.sakit, bg: Colors.sakitBg },
                ].map(item => (
                  <View key={item.label} style={[styles.miniItem, { backgroundColor: item.bg }]}>
                    <Text style={[styles.miniVal, { color: item.color }]}>{item.v}</Text>
                    <Text style={styles.miniLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textOnPrimary },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.surface, borderRadius: Radius.md, paddingHorizontal: Spacing.sm, paddingVertical: 7 },
  exportTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary },
  periodRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.md, padding: 3 },
  periodBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Radius.sm },
  periodBtnOn: { backgroundColor: Colors.surface },
  periodTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: 'rgba(255,255,255,0.7)' },
  periodTxtOn: { color: Colors.primary, fontWeight: FontWeight.semibold },
  content: { padding: Spacing.md, gap: Spacing.md },
  summaryCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, ...Shadow.sm },
  summaryTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 4 },
  summaryTotal: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  statBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  statBarLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, width: 68 },
  barTrack: { flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: Radius.full, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: Radius.full, minWidth: 4 },
  barPct: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, width: 38, textAlign: 'right' },
  barCount: { fontSize: FontSize.sm, color: Colors.textMuted, width: 30, textAlign: 'right' },
  filterRowWrap: { marginTop: Spacing.xs },
  filterContent: { gap: Spacing.sm, paddingVertical: Spacing.xs },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginRight: Spacing.xs, ...Shadow.sm },
  chipOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  chipTxtOn: { color: Colors.textOnPrimary },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  classCard: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.sm, ...Shadow.sm },
  classRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  classBadge: { width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
  classBadgeTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
  className: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  classWali: { fontSize: FontSize.xs, color: Colors.textSecondary },
  pctCol: { alignItems: 'center' },
  pctVal: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  pctLbl: { fontSize: FontSize.xs, color: Colors.textMuted },
  miniRow: { flexDirection: 'row', gap: Spacing.xs },
  miniItem: { flex: 1, borderRadius: Radius.sm, padding: Spacing.xs, alignItems: 'center' },
  miniVal: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  miniLabel: { fontSize: 9, color: Colors.textSecondary },
});
