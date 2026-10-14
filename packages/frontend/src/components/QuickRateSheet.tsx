/**
 * Quick Rate — the five-second path. Shared by the map's spot bar and the
 * location detail screen, which is why it owns its own draft state and hands
 * the stars/level over if you escalate to a full review.
 */
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BUSY_LEVEL_COLORS, BUSY_LEVELS, BusyLevel } from '../domain/busyness';
import { Spot } from '../domain/models';
import { useRatingStore } from '../stores/ratingStore';
import { colors, fonts, radius, type } from '../theme/tokens';
import { useToast } from './ToastHost';
import { PrimaryButton } from './ui/Buttons';
import { GrabHandle } from './ui/Layout';
import { Sheet } from './ui/Sheet';
import { StarPicker } from './ui/Stars';
import { Text } from './ui/Text';

interface QuickRateSheetProps {
  visible: boolean;
  spot: Spot | null;
  onDismiss: () => void;
  onWriteFullReview: (stars: number, busyLevel: BusyLevel | null) => void;
}

export function QuickRateSheet({ visible, spot, onDismiss, onWriteFullReview }: QuickRateSheetProps) {
  const toast = useToast();
  const submitQuickRate = useRatingStore((state) => state.submitQuickRate);
  const [stars, setStars] = useState(0);
  const [busyLevel, setBusyLevel] = useState<BusyLevel | null>(null);
  const [wasVisible, setWasVisible] = useState(visible);

  // Each opening starts a fresh quick rate rather than resuming the last one.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setStars(0);
      setBusyLevel(null);
    }
  }

  if (!spot) return null;

  const canPost = stars > 0 || busyLevel !== null;

  const post = async () => {
    if (!canPost) return;
    await submitQuickRate({ spotId: spot.id, stars: stars || null, busyLevel });
    onDismiss();
    toast('logged. you’re a real one.');
  };

  return (
    <Sheet visible={visible} onDismiss={onDismiss} contentStyle={styles.sheet}>
      <GrabHandle />

      <View style={styles.titleBlock}>
        <Text style={type.sectionLabel}>quick rate · 5 sec</Text>
        <Text style={type.sheetTitle}>{spot.name}</Text>
      </View>

      <View style={styles.starBox}>
        <StarPicker value={stars} onChange={setStars} size={24} spread />
      </View>

      <View style={styles.busyBlock}>
        <Text style={styles.busyHeading}>how busy rn?</Text>
        <View style={styles.busyRow}>
          {BUSY_LEVELS.map((label, index) => {
            const selected = busyLevel === index;
            return (
              <Pressable
                key={label}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setBusyLevel(index as BusyLevel)}
                style={[
                  styles.busyTile,
                  {
                    backgroundColor: selected ? colors.polyGreen : colors.card,
                    borderColor: selected ? colors.polyGreen : colors.inputBorder,
                  },
                ]}
              >
                <View style={[styles.busyDot, { backgroundColor: BUSY_LEVEL_COLORS[index] }]} />
                <Text
                  numberOfLines={1}
                  style={[styles.busyTileLabel, { color: selected ? colors.offWhite : colors.ink }]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <PrimaryButton label="post it" onPress={post} disabled={!canPost} />

      <Text style={styles.fullReviewLine}>
        got more to say?{' '}
        <Text style={styles.fullReviewLink} onPress={() => onWriteFullReview(stars, busyLevel)}>
          write a full review →
        </Text>
      </Text>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  sheet: { gap: 16 },
  titleBlock: { gap: 4 },
  starBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  busyBlock: { gap: 10 },
  busyHeading: { fontFamily: fonts.semibold, fontSize: 15 },
  busyRow: { flexDirection: 'row', gap: 6 },
  busyTile: {
    flex: 1,
    minWidth: 0,
    height: 68,
    borderRadius: radius.busyTile,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  busyDot: { width: 16, height: 16, borderRadius: 8 },
  busyTileLabel: { fontFamily: fonts.medium, fontSize: 11.5 },
  fullReviewLine: { textAlign: 'center', fontSize: 14, color: colors.sealGrey },
  fullReviewLink: { fontFamily: fonts.semibold, color: colors.polyGreen },
});
