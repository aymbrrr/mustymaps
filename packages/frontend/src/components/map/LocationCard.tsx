import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import {
  CATEGORY_LABELS,
  OPEN_SEATS_LABELS,
  statusToPinStyle,
  timeAgo,
  waitLabel,
} from '../../lib/crowdUtils';
import { LocationStatus } from '../../stores/locationStore';

type Props = {
  location: LocationStatus;
  onReport: () => void;
  onDetails: () => void;
};

export function LocationCard({ location, onReport, onDetails }: Props) {
  const pin = statusToPinStyle(location.busyness, location.report_count);
  const hasData = location.report_count > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.statusDot, { backgroundColor: pin.color }]} />
        <View style={styles.titleBlock}>
          <Text style={styles.name} numberOfLines={1}>{location.name}</Text>
          <Text style={styles.meta} numberOfLines={1}>
            {CATEGORY_LABELS[location.category] ?? location.category}
            {location.building ? ` · ${location.building}` : ''}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: pin.color + '22' }]}>
          <Text style={[styles.statusLabel, { color: pin.color }]}>{pin.label}</Text>
        </View>
      </View>

      {hasData ? (
        <>
          <View style={styles.stats}>
            <Chip label={waitLabel(location.wait_minutes)} />
            {location.open_seats && <Chip label={OPEN_SEATS_LABELS[location.open_seats]} />}
            {location.free_food && <Chip label="Free food" highlight />}
          </View>
          <Text style={styles.freshness}>
            {location.report_count} report{location.report_count !== 1 ? 's' : ''} · updated{' '}
            {timeAgo(location.last_report_at)}
          </Text>
        </>
      ) : (
        <Text style={styles.empty}>No one has reported here recently. Be the first.</Text>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onDetails} accessibilityRole="button"
          accessibilityLabel={`See recent reports for ${location.name}`}>
          <Text style={styles.secondaryButtonText}>Recent reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={onReport} accessibilityRole="button"
          accessibilityLabel={`Report conditions at ${location.name}`}>
          <Text style={styles.primaryButtonText}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Chip({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <View style={[styles.chip, highlight && styles.chipHighlight]}>
      <Text style={[styles.chipText, highlight && styles.chipTextHighlight]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  titleBlock: { flex: 1 },
  name: { ...typography.heading3, color: colors.textPrimary },
  meta: { ...typography.bodySm, color: colors.textMuted, marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  statusLabel: { ...typography.bodySm, fontWeight: '600' },
  stats: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  chip: { backgroundColor: colors.surfaceMuted, borderRadius: 8, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  chipHighlight: { backgroundColor: '#FDF4DE', borderColor: '#C69214' },
  chipText: { ...typography.bodySm, color: colors.textSecondary },
  chipTextHighlight: { color: '#8A6410', fontWeight: '600' },
  freshness: { ...typography.caption, color: colors.textMuted },
  empty: { ...typography.bodySm, color: colors.textMuted },
  buttonRow: { flexDirection: 'row', gap: spacing.sm },
  secondaryButton: { flex: 1, backgroundColor: colors.surfaceMuted, borderRadius: 10, paddingVertical: spacing.sm + 2, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  secondaryButtonText: { ...typography.label, color: colors.textPrimary, fontSize: 14 },
  primaryButton: { flex: 1, backgroundColor: colors.primary, borderRadius: 30, paddingVertical: spacing.sm + 2, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  primaryButtonText: { ...typography.label, color: colors.textInverse, fontSize: 14 },
});
