import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontWeight } from '@/constants/theme';

const AVATAR_COLORS = [
  '#1B4F8A', '#059669', '#D97706', '#DC2626', '#7C3AED',
  '#2563EB', '#0891B2', '#0D9488', '#65A30D', '#C2410C',
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

interface AvatarCircleProps {
  name: string;
  size?: number;
  fontSize?: number;
}

export const AvatarCircle = memo(({ name, size = 40, fontSize = 15 }: AvatarCircleProps) => {
  const bg = getColor(name);
  const initials = getInitials(name);

  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      <Text style={[styles.text, { fontSize }]}>{initials}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: FontWeight.bold,
  },
});
