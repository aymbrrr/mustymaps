import React, { useMemo, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { CloseIcon, LocateIcon, SearchIcon } from '../../components/Icons';
import { ArrowRightIcon } from '../../components/Icons';
import { MiniHourlyChart } from '../../components/BusynessChart';
import { SpotPin, UserLocationPin } from '../../components/map/SpotPin';
import { MustyAvatar } from '../../components/MustyAvatar';
import { QuickRateSheet } from '../../components/QuickRateSheet';
import { useToast } from '../../components/ToastHost';
import { CircleButton, PressableCard, PrimaryButton, SecondaryButton } from '../../components/ui/Buttons';
import { GrabHandle, rowDivider, SectionLabel } from '../../components/ui/Layout';
import { CategoryTile, Dot, MapChip, OutlineLivePill, TypeChip } from '../../components/ui/Pills';
import { StarNumber } from '../../components/ui/Stars';
import { Text } from '../../components/ui/Text';
import { busyColor, busyLiveLabel } from '../../domain/busyness';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useNow } from '../../hooks/useNow';
import { TabScreenProps } from '../../navigation/types';
import { matchesFilter, SpotFilter, useSpotStore } from '../../stores/spotStore';
import { colors, fonts, radius, shadows, spacing, type } from '../../theme/tokens';

/** Campus centre and the span that frames it at roughly zoom 16. */
const CAMPUS_REGION: Region = {
  latitude: 35.3016,
  longitude: -120.6602,
  latitudeDelta: 0.016,
  longitudeDelta: 0.0085,
};

/** Selecting a pin pans it up so the expanded bottom card does not cover it. */
const SELECTION_PAN_OFFSET = 0.0016;
const RECENTER_DURATION_MS = 600;
const NEARBY_COUNT = 3;

const MAP_FILTERS: { label: string; value: SpotFilter }[] = [
  { label: 'all', value: 'all' },
  { label: 'eat', value: 'food' },
  { label: 'study', value: 'study' },
  { label: 'quiet rn', value: 'quiet' },
  { label: '4.2+', value: 'top' },
];

export function MapScreen({ navigation }: TabScreenProps<'Map'>) {
  const toast = useToast();
  const mapRef = useRef<MapView>(null);
  const { nowIndex, nowLabel } = useNow();
  const { position } = useGeolocation();

  const spots = useSpotStore((state) => state.spots);
  const mapFilter = useSpotStore((state) => state.mapFilter);
  const setMapFilter = useSpotStore((state) => state.setMapFilter);
  const selectedSpotId = useSpotStore((state) => state.selectedSpotId);
  const select = useSpotStore((state) => state.select);
  const clearSelection = useSpotStore((state) => state.clearSelection);

  const [quickRateOpen, setQuickRateOpen] = useState(false);

  const visible = useMemo(
    () => spots.filter((spot) => matchesFilter(spot, mapFilter, nowIndex)),
    [spots, mapFilter, nowIndex]
  );

  const selected = useMemo(
    () => spots.find((spot) => spot.id === selectedSpotId) ?? null,
    [spots, selectedSpotId]
  );

  const nearby = useMemo(
    () => [...visible].sort((a, b) => b.rating - a.rating).slice(0, NEARBY_COUNT),
    [visible]
  );

  const selectAndPan = (spotId: string) => {
    select(spotId);
    const spot = spots.find((candidate) => candidate.id === spotId);
    if (!spot) return;
    mapRef.current?.animateToRegion(
      { ...CAMPUS_REGION, latitude: spot.lat - SELECTION_PAN_OFFSET, longitude: spot.lng },
      RECENTER_DURATION_MS / 2
    );
  };

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={CAMPUS_REGION}
        mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
        showsCompass={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        onPress={clearSelection}
      >
        {visible.map((spot) => (
          <SpotPin
            key={spot.id}
            spot={spot}
            selected={spot.id === selectedSpotId}
            onPress={selectAndPan}
          />
        ))}
        {position ? <UserLocationPin lat={position.lat} lng={position.lng} /> : null}
      </MapView>

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={[styles.headerCard, shadows.headerCard]}>
          <MustyAvatar size={46} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>musty&apos;s map</Text>
            <Text style={styles.headerSub}>
              {visible.length} spots · rn is {nowLabel}
            </Text>
          </View>
          <CircleButton
            size={44}
            accessibilityLabel="search"
            onPress={() => toast('search coming soon')}
          >
            <SearchIcon />
          </CircleButton>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
          style={styles.chipScroll}
        >
          {MAP_FILTERS.map((filter) => (
            <MapChip
              key={filter.value}
              label={filter.label}
              selected={mapFilter === filter.value}
              onPress={() => setMapFilter(filter.value)}
            />
          ))}
        </ScrollView>
      </View>

      <CircleButton
        size={52}
        accessibilityLabel="recenter map"
        background={colors.offWhite}
        shadow="card"
        style={styles.recenter}
        onPress={() => mapRef.current?.animateToRegion(CAMPUS_REGION, RECENTER_DURATION_MS)}
      >
        <LocateIcon />
      </CircleButton>

      {selected ? (
        <View style={[styles.bottomCard, styles.expandedCard, shadows.floatingCard]}>
          <GrabHandle style={styles.expandedHandle} />

          <View style={styles.expandedTopRow}>
            <TypeChip type={selected.type} />
            <OutlineLivePill occupancy={selected.hourlyBusy[nowIndex]} />
            <View style={styles.spacer} />
            <CircleButton
              size={34}
              accessibilityLabel="close"
              background={colors.closeButtonBg}
              onPress={clearSelection}
            >
              <CloseIcon />
            </CircleButton>
          </View>

          <PressableCard
            onPress={() => navigation.navigate('LocationDetail', { spotId: selected.id })}
            style={styles.expandedNameBlock}
            scale={1}
          >
            <Text style={styles.expandedName}>{selected.name}</Text>
            <Text style={styles.expandedMeta}>
              {selected.area} · {selected.hoursLabel} · {selected.walkTime}
            </Text>
          </PressableCard>

          <View style={styles.expandedRatingRow}>
            <View style={styles.expandedRatingBlock}>
              <Text style={type.mapBarRating}>{selected.rating}</Text>
              <Text style={styles.expandedRatingCount}>{selected.ratingCount} ratings</Text>
            </View>
            <MiniHourlyChart hourlyBusy={selected.hourlyBusy} nowIndex={nowIndex} />
          </View>

          <View style={styles.expandedActions}>
            <SecondaryButton
              label="quick rate"
              height={50}
              style={styles.flexAction}
              onPress={() => setQuickRateOpen(true)}
            />
            <PrimaryButton
              label="rate it"
              height={50}
              style={styles.flexAction}
              onPress={() => navigation.navigate('Rate', { spotId: selected.id })}
            />
            <CircleButton
              size={50}
              accessibilityLabel={`open ${selected.name}`}
              background={colors.serenity}
              onPress={() => navigation.navigate('LocationDetail', { spotId: selected.id })}
            >
              <ArrowRightIcon />
            </CircleButton>
          </View>
        </View>
      ) : (
        <View style={[styles.bottomCard, styles.nearbyCard, shadows.floatingCard]}>
          <GrabHandle style={styles.nearbyHandle} />
          <View style={styles.nearbyHeader}>
            <SectionLabel label="what's good rn" caption="top rated nearby" />
          </View>
          {nearby.map((spot, index) => {
            const occupancy = spot.hourlyBusy[nowIndex];
            return (
              <PressableCard
                key={spot.id}
                onPress={() => selectAndPan(spot.id)}
                style={[styles.nearbyRow, rowDivider(index)]}
              >
                <CategoryTile type={spot.type} size={44} />
                <View style={styles.nearbyMeta}>
                  <Text style={styles.nearbyName}>{spot.name}</Text>
                  <View style={styles.nearbySubRow}>
                    <Dot size={7} color={busyColor(occupancy)} />
                    <Text style={styles.nearbySub}>
                      {spot.walkTime} · {busyLiveLabel(occupancy)}
                    </Text>
                  </View>
                </View>
                <StarNumber value={spot.rating} size={15} />
              </PressableCard>
            );
          })}
        </View>
      )}

      <QuickRateSheet
        visible={quickRateOpen}
        spot={selected}
        onDismiss={() => setQuickRateOpen(false)}
        onWriteFullReview={(stars, busyLevel) => {
          setQuickRateOpen(false);
          if (selected) navigation.navigate('Rate', { spotId: selected.id, seedStars: stars, seedBusyLevel: busyLevel });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.mapCanvas },
  overlay: { position: 'absolute', top: spacing.safeTop, left: 14, right: 14, gap: 10 },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 14,
    borderRadius: radius.card,
    backgroundColor: colors.mapHeader,
  },
  headerText: { flex: 1, gap: 2 },
  headerTitle: { fontFamily: fonts.semibold, fontSize: 21, letterSpacing: -0.42 },
  headerSub: { fontSize: 14, color: colors.sealGrey },
  chipScroll: { flexGrow: 0 },
  chipRow: { gap: 8, paddingVertical: 2 },
  recenter: { position: 'absolute', right: 16, top: 186 },
  bottomCard: { position: 'absolute', left: 12, right: 12, bottom: 100, backgroundColor: colors.offWhite },
  nearbyCard: { borderRadius: 28, paddingTop: 10, paddingHorizontal: 16, paddingBottom: 12 },
  nearbyHandle: { marginBottom: 12 },
  nearbyHeader: { paddingHorizontal: 4, paddingBottom: 6 },
  nearbyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9, paddingHorizontal: 4 },
  nearbyMeta: { flex: 1, minWidth: 0, gap: 3 },
  nearbyName: { ...type.cardTitleSm },
  nearbySubRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nearbySub: { fontSize: 13, color: colors.sealGrey },
  expandedCard: {
    borderRadius: radius.sheetSm,
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 18,
    gap: 14,
  },
  expandedHandle: { marginBottom: -4 },
  expandedTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  spacer: { flex: 1 },
  expandedNameBlock: { gap: 4 },
  expandedName: { ...type.sheetTitle, fontSize: 27, lineHeight: 28 },
  expandedMeta: { fontSize: 14, color: colors.sealGrey },
  expandedRatingRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 14 },
  expandedRatingBlock: { gap: 2 },
  expandedRatingCount: { fontSize: 13, color: colors.sealGrey },
  expandedActions: { flexDirection: 'row', gap: 8 },
  flexAction: { flex: 1 },
});
