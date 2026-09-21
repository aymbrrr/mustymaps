/**
 * Location detail — recent reports for one location.
 * Shows raw reports rather than the aggregate so users can judge freshness
 * and spot outliers themselves.
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useLocationStore, Report } from '../../stores/locationStore';
import { colors, spacing, typography } from '../../constants/theme';
import {
  busynessLevel,
  timeAgo,
  waitLabel,
  OPEN_SEATS_LABELS,
  STATUS_WINDOW_MINUTES,
} from '../../lib/crowdUtils';
import { AppRootParamList } from '../../navigation/types';

export function LocationDetailScreen() {
  const route = useRoute<RouteProp<AppRootParamList, 'LocationDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<AppRootParamList>>();
  const { locationId, locationName } = route.params;

  const getRecentReports = useLocationStore((s) => s.getRecentReports);
  const [reports, setReports] = useState<Report[] | null>(null);
  // Captured when the list loads so rendering stays pure.
  const [staleBefore, setStaleBefore] = useState(0);

  useEffect(() => {
    getRecentReports(locationId).then((rows) => {
      setStaleBefore(Date.now() - STATUS_WINDOW_MINUTES * 60_000);
      setReports(rows);
    });
  }, [locationId, getRecentReports]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button">
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{locationName}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {reports == null ? (
        <ActivityIndicator style={styles.loading} color={colors.primary} />
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={styles.listHeader}>
              Reports older than {STATUS_WINDOW_MINUTES} minutes no longer affect the map pin.
            </Text>
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No reports yet. Be the first to add one.</Text>
          }
          renderItem={({ item }) => <ReportRow report={item} staleBefore={staleBefore} />}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => navigation.navigate('Report', { locationId, locationName })}
          accessibilityRole="button"
          accessibilityLabel={`Report conditions at ${locationName}`}
        >
          <Text style={styles.reportButtonText}>Add a report</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ReportRow({ report, staleBefore }: { report: Report; staleBefore: number }) {
  const level = busynessLevel(report.busyness)!;
  const isStale = new Date(report.created_at).getTime() < staleBefore;

  return (
    <View style={[styles.row, isStale && styles.rowStale]}>
      <View style={styles.rowHeader}>
        <View style={[styles.dot, { backgroundColor: level.color }]} />
        <Text style={styles.rowLabel}>{level.label}</Text>
        <Text style={styles.rowTime}>{timeAgo(report.created_at)}</Text>
      </View>

      <View style={styles.rowChips}>
        <Text style={styles.rowDetail}>{waitLabel(report.wait_minutes)}</Text>
        {report.open_seats && (
          <Text style={styles.rowDetail}>· {OPEN_SEATS_LABELS[report.open_seats]}</Text>
        )}
        {report.free_food && <Text style={styles.rowFood}>· Free food</Text>}
      </View>

      {report.note && <Text style={styles.rowNote}>{report.note}</Text>}
      {isStale && <Text style={styles.staleTag}>Too old to count</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  back: { ...typography.body, color: colors.primary, width: 56 },
  headerTitle: { ...typography.heading3, color: colors.textPrimary, flex: 1, textAlign: 'center' },
  headerSpacer: { width: 56 },
  loading: { marginTop: spacing.xl },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },
  listHeader: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm },
  empty: { ...typography.bodySm, color: colors.textMuted, marginTop: spacing.lg },
  row: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  rowStale: { opacity: 0.55 },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowLabel: { ...typography.label, color: colors.textPrimary, flex: 1 },
  rowTime: { ...typography.caption, color: colors.textMuted },
  rowChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  rowDetail: { ...typography.bodySm, color: colors.textSecondary },
  rowFood: { ...typography.bodySm, color: '#8A6410', fontWeight: '600' },
  rowNote: { ...typography.bodySm, color: colors.textPrimary, fontStyle: 'italic' },
  staleTag: { ...typography.caption, color: colors.textMuted },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reportButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButtonText: { ...typography.label, color: colors.textInverse, fontSize: 16 },
});
