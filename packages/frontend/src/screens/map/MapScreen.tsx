/**
 * Map screen — campus locations with live crowd status.
 * Tapping a pin opens a bottom sheet with current status and a report button.
 */
import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import MapView, { Region, PROVIDER_DEFAULT } from 'react-native-maps';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useGeolocation } from '../../hooks/useGeolocation';
import { useLocationStore, LocationStatus } from '../../stores/locationStore';
import { LocationPin } from '../../components/map/LocationPin';
import { OfflineBanner } from '../../components/shared/OfflineBanner';
import { colors, spacing, typography, frostedCard } from '../../constants/theme';
import {
  statusToPinStyle,
  timeAgo,
  waitLabel,
  OPEN_SEATS_LABELS,
  CATEGORY_LABELS,
} from '../../lib/crowdUtils';
import { AppRootParamList } from '../../navigation/types';

// Centered on Cal Poly campus.
const CAMPUS_REGION: Region = {
  latitude: 35.3025,
  longitude: -120.6595,
  latitudeDelta: 0.016,
  longitudeDelta: 0.016,
};

export function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<AppRootParamList>>();

  const { position, permissionGranted, error: geoError, requestPermission } = useGeolocation();
  const { locations, fetchLocations, isLoading } = useLocationStore();

  // Status decays over time, so refresh whenever the map comes into focus.
  useFocusEffect(
    useCallback(() => {
      fetchLocations();
    }, [fetchLocations])
  );

  // Derived rather than stored, so a refresh shows fresh data in the open sheet.
  const selected = selectedId
    ? locations.find((l) => l.location_id === selectedId) ?? null
    : null;

  const handlePinPress = useCallback((location: LocationStatus) => {
    setSelectedId(location.location_id);
    sheetRef.current?.expand();
  }, []);

  const handleCenterOnMe = () => {
    if (!position) {
      requestPermission();
      return;
    }
    mapRef.current?.animateToRegion(
      {
        latitude: position.lat,
        longitude: position.lng,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
      600
    );
  };

  return (
    <View style={styles.container}>
      <OfflineBanner />

      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <Text style={styles.title}>Musty&apos;s Map</Text>
        <Text style={styles.subtitle}>Tap a spot to see how busy it is</Text>
      </SafeAreaView>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={CAMPUS_REGION}
        showsUserLocation={permissionGranted === true}
        showsMyLocationButton={false}
      >
        {locations.map((location) => (
          <LocationPin key={location.location_id} location={location} onPress={handlePinPress} />
        ))}
      </MapView>

      <Legend />

      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator color={colors.primary} />
        </View>
      )}

      {permissionGranted === false && geoError && (
        <View style={styles.permissionBanner}>
          <Text style={styles.permissionText}>Enable location to see where you are on campus</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.permissionButtonText}>Enable</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={handleCenterOnMe}
        accessibilityRole="button"
        accessibilityLabel="Center map on my location"
      >
        <Text style={styles.fabIcon}>◎</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={['42%', '70%']}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
        onClose={() => setSelectedId(null)}
      >
        <BottomSheetView style={styles.sheetContent}>
          {selected && (
            <LocationCard
              location={selected}
              onReport={() => {
                sheetRef.current?.close();
                navigation.navigate('Report', {
                  locationId: selected.location_id,
                  locationName: selected.name,
                });
              }}
              onDetails={() => {
                sheetRef.current?.close();
                navigation.navigate('LocationDetail', {
                  locationId: selected.location_id,
                  locationName: selected.name,
                });
              }}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const LEGEND_ITEMS = [
  { color: '#2E7D32', label: 'Not busy' },
  { color: '#C69214', label: 'Moderate' },
  { color: '#C0392B', label: 'Packed' },
  { color: '#9E9E9E', label: 'Unknown' },
];

function Legend() {
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

function LocationCard({
  location,
  onReport,
  onDetails,
}: {
  location: LocationStatus;
  onReport: () => void;
  onDetails: () => void;
}) {
  const pin = statusToPinStyle(location.busyness, location.report_count);
  const hasData = location.report_count > 0;

  return (
    <View style={cardStyles.container}>
      <View style={cardStyles.header}>
        <View style={[cardStyles.statusDot, { backgroundColor: pin.color }]} />
        <View style={cardStyles.titleBlock}>
          <Text style={cardStyles.name} numberOfLines={1}>{location.name}</Text>
          <Text style={cardStyles.meta} numberOfLines={1}>
            {CATEGORY_LABELS[location.category] ?? location.category}
            {location.building ? ` · ${location.building}` : ''}
          </Text>
        </View>
        <View style={[cardStyles.statusBadge, { backgroundColor: pin.color + '22' }]}>
          <Text style={[cardStyles.statusLabel, { color: pin.color }]}>{pin.label}</Text>
        </View>
      </View>

      {hasData ? (
        <>
          <View style={cardStyles.stats}>
            <Chip label={waitLabel(location.wait_minutes)} />
            {location.open_seats && <Chip label={OPEN_SEATS_LABELS[location.open_seats]} />}
            {location.free_food && <Chip label="Free food" highlight />}
          </View>
          <Text style={cardStyles.freshness}>
            {location.report_count} report{location.report_count !== 1 ? 's' : ''} · updated{' '}
            {timeAgo(location.last_report_at)}
          </Text>
        </>
      ) : (
        <Text style={cardStyles.empty}>No one has reported here recently. Be the first.</Text>
      )}

      <View style={cardStyles.buttonRow}>
        <TouchableOpacity
          style={cardStyles.secondaryButton}
          onPress={onDetails}
          accessibilityRole="button"
          accessibilityLabel={`See recent reports for ${location.name}`}
        >
          <Text style={cardStyles.secondaryButtonText}>Recent reports</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={cardStyles.primaryButton}
          onPress={onReport}
          accessibilityRole="button"
          accessibilityLabel={`Report conditions at ${location.name}`}
        >
          <Text style={cardStyles.primaryButtonText}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Chip({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <View style={[cardStyles.chip, highlight && cardStyles.chipHighlight]}>
      <Text style={[cardStyles.chipText, highlight && cardStyles.chipTextHighlight]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerSafe: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  title: { ...typography.heading2, color: colors.textPrimary },
  subtitle: { ...typography.bodySm, color: colors.textMuted, marginTop: 2 },
  map: { flex: 1, margin: spacing.sm, borderRadius: 24, overflow: 'hidden' },
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
  loadingOverlay: {
    position: 'absolute',
    top: spacing.xl,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: spacing.sm,
  },
  permissionBanner: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionText: { ...typography.bodySm, color: colors.textPrimary, flex: 1 },
  permissionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginLeft: spacing.sm,
  },
  permissionButtonText: { ...typography.label, color: '#fff', fontSize: 13 },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: spacing.lg,
    ...frostedCard,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: { fontSize: 22, color: colors.textPrimary },
  sheetBackground: { backgroundColor: '#FBFDFB', borderRadius: 24 },
  sheetHandle: { backgroundColor: colors.border, width: 40 },
  sheetContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
});

const cardStyles = StyleSheet.create({
  container: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  titleBlock: { flex: 1 },
  name: { ...typography.heading3, color: colors.textPrimary },
  meta: { ...typography.bodySm, color: colors.textMuted, marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  statusLabel: { ...typography.bodySm, fontWeight: '600' },
  stats: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  chip: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  chipHighlight: { backgroundColor: '#FDF4DE', borderColor: '#C69214' },
  chipText: { ...typography.bodySm, color: colors.textSecondary },
  chipTextHighlight: { color: '#8A6410', fontWeight: '600' },
  freshness: { ...typography.caption, color: colors.textMuted },
  empty: { ...typography.bodySm, color: colors.textMuted },
  buttonRow: { flexDirection: 'row', gap: spacing.sm },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  secondaryButtonText: { ...typography.label, color: colors.textPrimary, fontSize: 14 },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primaryButtonText: { ...typography.label, color: colors.textInverse, fontSize: 14 },
});
