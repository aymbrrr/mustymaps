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
import { MapLegend } from '../../components/map/MapLegend';
import { LocationCard } from '../../components/map/LocationCard';
import { OfflineBanner } from '../../components/shared/OfflineBanner';
import { colors, spacing, typography, frostedCard } from '../../constants/theme';
import { AppRootParamList } from '../../navigation/types';

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

  useFocusEffect(useCallback(() => { fetchLocations(); }, [fetchLocations]));

  const selected = selectedId ? locations.find((l) => l.location_id === selectedId) ?? null : null;

  const handlePinPress = useCallback((location: LocationStatus) => {
    setSelectedId(location.location_id);
    sheetRef.current?.expand();
  }, []);

  const handleCenterOnMe = () => {
    if (!position) { requestPermission(); return; }
    mapRef.current?.animateToRegion({
      latitude: position.lat,
      longitude: position.lng,
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    }, 600);
  };

  return (
    <View style={styles.container}>
      <OfflineBanner />
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <Text style={styles.title}>Musty&apos;s Map</Text>
        <Text style={styles.subtitle}>Tap a spot to see how busy it is</Text>
      </SafeAreaView>

      <MapView ref={mapRef} style={styles.map} provider={PROVIDER_DEFAULT} initialRegion={CAMPUS_REGION}
        showsUserLocation={permissionGranted === true} showsMyLocationButton={false}>
        {locations.map((location) => (
          <LocationPin key={location.location_id} location={location} onPress={handlePinPress} />
        ))}
      </MapView>

      <MapLegend />

      {isLoading && <View style={styles.loadingOverlay} pointerEvents="none"><ActivityIndicator color={colors.primary} /></View>}

      {permissionGranted === false && geoError && (
        <View style={styles.permissionBanner}>
          <Text style={styles.permissionText}>Enable location to see where you are on campus</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.permissionButtonText}>Enable</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.fab} onPress={handleCenterOnMe} accessibilityRole="button"
        accessibilityLabel="Center map on my location">
        <Text style={styles.fabIcon}>◎</Text>
      </TouchableOpacity>

      <BottomSheet ref={sheetRef} index={-1} snapPoints={['42%', '70%']} enablePanDownToClose
        backgroundStyle={styles.sheetBackground} handleIndicatorStyle={styles.sheetHandle}
        onClose={() => setSelectedId(null)}>
        <BottomSheetView style={styles.sheetContent}>
          {selected && (
            <LocationCard
              location={selected}
              onReport={() => {
                sheetRef.current?.close();
                navigation.navigate('Report', { locationId: selected.location_id, locationName: selected.name });
              }}
              onDetails={() => {
                sheetRef.current?.close();
                navigation.navigate('LocationDetail', { locationId: selected.location_id, locationName: selected.name });
              }}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerSafe: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, backgroundColor: colors.background },
  title: { ...typography.heading2, color: colors.textPrimary },
  subtitle: { ...typography.bodySm, color: colors.textMuted, marginTop: 2 },
  map: { flex: 1, margin: spacing.sm, borderRadius: 24, overflow: 'hidden' },
  loadingOverlay: { position: 'absolute', top: spacing.xl, alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: spacing.sm },
  permissionBanner: { position: 'absolute', bottom: 100, left: spacing.lg, right: spacing.lg, backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  permissionText: { ...typography.bodySm, color: colors.textPrimary, flex: 1 },
  permissionButton: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginLeft: spacing.sm },
  permissionButtonText: { ...typography.label, color: '#fff', fontSize: 13 },
  fab: { position: 'absolute', bottom: 100, right: spacing.lg, ...frostedCard, width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  fabIcon: { fontSize: 22, color: colors.textPrimary },
  sheetBackground: { backgroundColor: '#FBFDFB', borderRadius: 24 },
  sheetHandle: { backgroundColor: colors.border, width: 40 },
  sheetContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
});
