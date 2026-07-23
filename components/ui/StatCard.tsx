import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Shadow, Spacing, FontSize, FontWeight } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

export const StatCard = memo(({ label, value, color, bgColor }: StatCardProps) => {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      <View style={[styles.iconBg, { backgroundColor: bgColor }]}>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderTopWidth: 3,
    ...Shadow.sm,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
  },
});
