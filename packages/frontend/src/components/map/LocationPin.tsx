/**
 * Map pin for a campus location.
 *
 * Colour and shape both encode busyness so the map is readable without colour
 * vision: circle = not busy, square = moderate, triangle = packed,
 * hollow ring = no recent reports. A dot badge marks free food.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { statusToPinStyle } from '../../lib/crowdUtils';
import { LocationStatus } from '../../stores/locationStore';

interface LocationPinProps {
  location: LocationStatus;
  onPress: (location: LocationStatus) => void;
}

export function LocationPin({ location, onPress }: LocationPinProps) {
  const pin = statusToPinStyle(location.busyness, location.report_count);

  return (
    <Marker
      coordinate={{ latitude: Number(location.lat), longitude: Number(location.lng) }}
      onPress={() => onPress(location)}
      tracksViewChanges={false}
      accessibilityLabel={`${location.name} — ${pin.label}`}
    >
      <View
        style={[
          styles.pin,
          pin.shape === 'hollow'
            ? { backgroundColor: 'transparent', borderColor: pin.color, borderWidth: 3 }
            : { backgroundColor: pin.color },
        ]}
      >
        <PinShape shape={pin.shape} />
        {location.free_food && (
          <View style={styles.foodBadge}>
            <Text style={styles.foodBadgeText}>F</Text>
          </View>
        )}
      </View>
    </Marker>
  );
}

function PinShape({ shape }: { shape: 'circle' | 'square' | 'triangle' | 'hollow' }) {
  if (shape === 'hollow') return null;
  if (shape === 'circle') return <View style={styles.circle} />;
  if (shape === 'square') return <View style={styles.square} />;
  return <View style={styles.triangle} />;
}

const PIN_SIZE = 32;

const styles = StyleSheet.create({
  pin: {
    width: PIN_SIZE,
    height: PIN_SIZE,
    borderRadius: PIN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  square: {
    width: 12,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255,255,255,0.95)',
  },
  foodBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#C69214',
    borderWidth: 1.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
});
