import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/constants/theme';
import { UserRole } from '@/types';

const ROLES: Array<{ role: UserRole; label: string; desc: string; icon: keyof typeof MaterialIcons.glyphMap; color: string }> = [
  { role: 'admin', label: 'Admin / TU', desc: 'Kelola data sekolah & laporan absensi lengkap', icon: 'admin-panel-settings', color: Colors.primary },
  { role: 'guru', label: 'Guru / Wali Kelas', desc: 'Input absensi dan lihat rekap kelas', icon: 'school', color: Colors.hadir },
  { role: 'siswa', label: 'Siswa', desc: 'Lihat rekap absensi pribadi', icon: 'person', color: Colors.sakit },
];

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.logoWrap}>
          <Image
            source={require('@/assets/kartika-logo.png')}
            style={styles.logo}
            contentFit="contain"
            transition={300}
          />
        </View>
        <Text style={styles.schoolName}>SMP KARTIKA</Text>
        <Text style={styles.subtitle}>Sistem Informasi Absensi Digital</Text>
        <View style={styles.goldBar} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.chooseLabel}>Masuk sebagai:</Text>

        {ROLES.map((item) => (
          <Pressable
            key={item.role}
            style={({ pressed }) => [styles.roleCard, pressed && styles.roleCardPressed]}
            onPress={() => handleLogin(item.role)}
          >
            <View style={[styles.roleIcon, { backgroundColor: item.color + '18' }]}>
              <MaterialIcons name={item.icon} size={28} color={item.color} />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleLabel}>{item.label}</Text>
              <Text style={styles.roleDesc}>{item.desc}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
          </Pressable>
        ))}

        <View style={styles.demoBadge}>
          <MaterialIcons name="info-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.demoText}>DEMO - Tidak memerlukan password</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  logoWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logo: { width: 80, height: 80 },
  schoolName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
    letterSpacing: 3,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  goldBar: {
    width: 40,
    height: 3,
    backgroundColor: Colors.gold,
    borderRadius: Radius.full,
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  scrollContent: { padding: Spacing.lg },
  chooseLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  roleCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  roleCardPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  roleIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleInfo: { flex: 1 },
  roleLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  roleDesc: { fontSize: FontSize.sm, color: Colors.textSecondary },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.lg,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignSelf: 'center',
  },
  demoText: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.medium },
});
