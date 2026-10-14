import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Spot } from '../../domain/models';
import { colors, fonts, radius, shadows } from '../../theme/tokens';
import { StarNumber } from '../ui/Stars';
import { Text } from '../ui/Text';

/** Pin label style: short name + rating, or score only. */
export type PinStyle = 'name' | 'score';

/**
 * iOS caches a marker's rasterised view unless tracksViewChanges is on, but
 * leaving it on redraws every frame. Track briefly after each content change.
 */
const TRACK_WINDOW_MS = 600;

interface SpotPinProps {
  spot: Spot;
  selected: boolean;
  pinStyle?: PinStyle;
  onPress: (spotId: string) => void;
}

export function SpotPin({ spot, selected, pinStyle = 'name', onPress }: SpotPinProps) {
  const [tracking, setTracking] = useState(true);
  const [renderedAs, setRenderedAs] = useState(`${selected}|${pinStyle}`);

  if (renderedAs !== `${selected}|${pinStyle}`) {
    setRenderedAs(`${selected}|${pinStyle}`);
    setTracking(true);
  }

  useEffect(() => {
    if (!tracking) return;
    const timer = setTimeout(() => setTracking(false), TRACK_WINDOW_MS);
    return () => clearTimeout(timer);
  }, [tracking]);

  const background = selected ? colors.polyGreen : colors.offWhite;
  const ink = selected ? colors.offWhite : colors.ink;
  const isFood = spot.type === 'food';
  const dotFill = isFood ? (selected ? colors.serenity : colors.polyGreen) : colors.serenity;

  return (
    <Marker
      coordinate={{ latitude: spot.lat, longitude: spot.lng }}
      anchor={{ x: 0.5, y: 1 }}
      zIndex={selected ? 1000 : 0}
      tracksViewChanges={tracking}
      onPress={() => onPress(spot.id)}
    >
      <View style={[styles.wrap, selected ? styles.selected : null]}>
        <View style={[styles.pill, shadows.mapPill, { backgroundColor: background }]}>
          <View
            style={[
              styles.dot,
              { backgroundColor: dotFill, borderColor: isFood ? 'transparent' : colors.polyGreen },
            ]}
          />
          {pinStyle === 'score' ? (
            <StarNumber value={spot.rating} size={14} color={ink} />
          ) : (
            <Text style={[styles.label, { color: ink }]} numberOfLines={1}>
              {spot.shortName}
              <Text style={[styles.rating, { color: ink }]}> {spot.rating}</Text>
            </Text>
          )}
        </View>
        <View style={[styles.tail, { backgroundColor: background }]} />
      </View>
    </Marker>
  );
}

/** Green dot with a white ring and a translucent halo, marking the user. */
export function UserLocationPin({ lat, lng }: { lat: number; lng: number }) {
  return (
    <Marker coordinate={{ latitude: lat, longitude: lng }} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
      <View style={styles.halo}>
        <View style={styles.userDot} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingBottom: 6 },
  selected: { transform: [{ scale: 1.08 }] },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
    paddingLeft: 9,
    paddingRight: 13,
    borderRadius: radius.pill,
  },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  label: { fontFamily: fonts.semibold, fontSize: 14 },
  rating: { fontFamily: fonts.medium, opacity: 0.6 },
  tail: { width: 10, height: 10, transform: [{ rotate: '45deg' }], marginTop: -6 },
  halo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(21,71,52,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: colors.polyGreen,
    borderWidth: 3,
    borderColor: colors.card,
  },
});
