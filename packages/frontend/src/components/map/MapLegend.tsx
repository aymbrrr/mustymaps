import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../../constants/theme';

const LEGEND_ITEMS = [
  { color: '#2E7D32', label: 'Not busy' },
  { color: '#C69214', label: 'Moderate' },
  { color: '#C0392B', label: 'Packed' },
  { color: '#9E9E9E', label: 'Unknown' },
];

export function MapLegend() {
  return (
    <View style={styles.legend}>
      {LEGEND_ITEMS.map((item) => (
        <View key={item.label} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: item.color }]} />
          <Text style={styles.legendLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    position: 'absolute',
    top: 112,
    left: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11, color: colors.textSecondary },
});
