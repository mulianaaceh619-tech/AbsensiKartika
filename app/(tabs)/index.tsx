import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useAttendance } from '@/hooks/useAttendance';
import { useStudents } from '@/hooks/useStudents';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { StatCard } from '@/components';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const { getTodaySummary, getClassSummaryForDate } = useAttendance();
  const { classes, students } = useStudents();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const summary = getTodaySummary();

  const greeting = () => {
    const h = today.getHours();
    if (h < 12) return 'Selamat Pagi';
    if (h < 15) return 'Selamat Siang';
    if (h < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const dateStr = today.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const hadirPct = summary.total > 0
    ? Math.round((summary.hadir + summary.terlambat) / summary.total * 100)
    : 0;

  const classSummaries = useMemo(() => {
    return classes.map(cls => {
      const s = getClassSummaryForDate(todayStr, cls.id);
      const count = students.filter(st => st.kelas === cls.id).length;
      const pct = count > 0 ? Math.round((s.hadir + s.terlambat) / Math.max(s.total, 1) * 100) : 0;
      return { ...cls, s, count, pct };
    });
  }, [classes, todayStr, students]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.userName} numberOfLines={1}>{currentUser?.nama}</Text>
            <Text style={styles.dateText}>{dateStr}</Text>
          </View>
          <Pressable style={styles.logoutBtn} onPress={handleLogout} hitSlop={8}>
            <MaterialIcons name="logout" size={22} color="rgba(255,255,255,0.8)" />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{students.length}</Text>
            <Text style={styles.statLbl}>Total Siswa</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{classes.length}</Text>
            <Text style={styles.statLbl}>Kelas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: Colors.gold }]}>{hadirPct}%</Text>
            <Text style={styles.statLbl}>Kehadiran</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Rekap Hari Ini</Text>
        <View style={styles.cards4}>
          <StatCard label="Hadir" value={summary.hadir} color={Colors.hadir} bgColor={Colors.hadirBg} />
          <StatCard label="Terlambat" value={summary.terlambat} color={Colors.terlambat} bgColor={Colors.terlambatBg} />
          <StatCard label="Alpha" value={summary.alpha} color={Colors.alpha} bgColor={Colors.alphaBg} />
          <StatCard label="Izin" value={summary.izin} color={Colors.izin} bgColor={Colors.izinBg} />
        </View>

        <Text style={styles.sectionTitle}>Rekap Per Kelas</Text>
        {classSummaries.map(cls => {
          const barColor = cls.pct >= 90 ? Colors.hadir : cls.pct >= 75 ? Colors.terlambat : Colors.alpha;
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
                <Text style={[styles.classPct, { color: barColor }]}>{cls.pct}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${cls.pct}%` as any, backgroundColor: barColor }]} />
              </View>
              <View style={styles.classMini}>
                <Text style={[styles.miniStat, { color: Colors.hadir }]}>H:{cls.s.hadir}</Text>
                <Text style={[styles.miniStat, { color: Colors.terlambat }]}>T:{cls.s.terlambat}</Text>
                <Text style={[styles.miniStat, { color: Colors.alpha }]}>A:{cls.s.alpha}</Text>
                <Text style={[styles.miniStat, { color: Colors.izin }]}>I:{cls.s.izin}</Text>
                <Text style={styles.miniStat}>/{cls.count} siswa</Text>
              </View>
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.quickRow}>
          {[
            { label: 'Input Absensi', icon: 'fact-check' as const, color: Colors.primary, route: '/(tabs)/absensi' as const },
            { label: 'Lihat Laporan', icon: 'bar-chart' as const, color: Colors.hadir, route: '/(tabs)/laporan' as const },
            { label: 'Data Siswa', icon: 'people' as const, color: Colors.terlambat, route: '/(tabs)/siswa' as const },
          ].map(a => (
            <Pressable
              key={a.label}
              style={({ pressed }) => [styles.quickBtn, pressed && { opacity: 0.8 }]}
              onPress={() => router.push(a.route)}
            >
              <MaterialIcons name={a.icon} size={26} color={a.color} />
              <Text style={styles.quickLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', paddingTop: Spacing.sm, paddingBottom: Spacing.md },
  greeting: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  userName: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textOnPrimary, marginTop: 1 },
  dateText: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  logoutBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textOnPrimary },
  statLbl: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  cards4: { flexDirection: 'row', gap: Spacing.sm },
  classCard: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm },
  classRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  classBadge: { width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
  classBadgeTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
  className: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  classWali: { fontSize: FontSize.xs, color: Colors.textSecondary },
  classPct: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  progressTrack: { height: 6, backgroundColor: Colors.border, borderRadius: Radius.full, overflow: 'hidden', marginBottom: Spacing.sm },
  progressFill: { height: 6, borderRadius: Radius.full },
  classMini: { flexDirection: 'row', gap: Spacing.sm },
  miniStat: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  quickRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  quickBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', gap: Spacing.sm, ...Shadow.sm },
  quickLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.textSecondary, textAlign: 'center' },
});
