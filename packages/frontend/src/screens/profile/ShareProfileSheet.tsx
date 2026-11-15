import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MustyAvatar } from '../../components/MustyAvatar';
import { PrimaryButton } from '../../components/ui/Buttons';
import { GrabHandle } from '../../components/ui/Layout';
import { Avatar } from '../../components/ui/Pills';
import { Sheet } from '../../components/ui/Sheet';
import { StarNumber } from '../../components/ui/Stars';
import { Text } from '../../components/ui/Text';
import { Me } from '../../domain/models';
import { initialsOf } from '../../domain/rating';
import { colors, fonts, radius, type } from '../../theme/tokens';

interface ShareProfileSheetProps {
  visible: boolean;
  me: Me;
  ratingCount: number;
  avgGiven: string;
  topSpotName: string;
  onDismiss: () => void;
  onShareVia: () => void;
}

export function ShareProfileSheet({
  visible,
  me,
  ratingCount,
  avgGiven,
  topSpotName,
  onDismiss,
  onShareVia,
}: ShareProfileSheetProps) {
  const [copied, setCopied] = useState(false);
  const [wasVisible, setWasVisible] = useState(visible);

  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setCopied(false);
  }

  return (
    <Sheet visible={visible} onDismiss={onDismiss} contentStyle={styles.sheet}>
      <GrabHandle />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.brand}>
            <MustyAvatar size={32} />
            <Text style={styles.wordmark}>
              musty&apos;s map<Text style={styles.wordmarkPeriod}>.</Text>
            </Text>
          </View>
          <Text style={[type.sectionLabel, styles.campus]}>cal poly</Text>
        </View>

        <View style={styles.identity}>
          <Avatar initials={initialsOf(me.name)} size={60} fontSize={24} />
          <View style={styles.identityText}>
            <Text style={styles.name}>{me.name}</Text>
            <Text style={styles.handle}>@{me.handle}</Text>
          </View>
        </View>

        <View style={styles.statChips}>
          <View style={styles.statChip}>
            <Text style={styles.statChipLabel}>{ratingCount} ratings</Text>
          </View>
          <View style={styles.statChip}>
            <StarNumber
              value={avgGiven}
              size={13}
              family={fonts.regular}
              color={colors.offWhite}
              prefix="avg "
            />
          </View>
          <View style={styles.topSpotChip}>
            <Text style={styles.topSpotLabel}>top spot: {topSpotName}</Text>
          </View>
        </View>
      </View>

      <View style={styles.linkRow}>
        <Text style={styles.link}>mustysmap.app/@{me.handle}</Text>
        <Pressable accessibilityRole="button" onPress={() => setCopied(true)} style={styles.copyButton}>
          <Text style={styles.copyLabel}>{copied ? 'copied ✓' : 'copy'}</Text>
        </Pressable>
      </View>

      <PrimaryButton label="share via…" height={54} onPress={onShareVia} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  sheet: { gap: 14, paddingHorizontal: 18, paddingBottom: 20 },
  card: { backgroundColor: colors.polyGreen, borderRadius: 26, padding: 22, gap: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wordmark: { fontFamily: fonts.semibold, fontSize: 21, letterSpacing: -0.84, color: colors.offWhite },
  wordmarkPeriod: { color: colors.serenity },
  campus: { color: colors.serenity },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  identityText: { gap: 2 },
  name: { fontFamily: fonts.semibold, fontSize: 21, color: colors.offWhite },
  handle: { fontSize: 14, color: colors.serenity },
  statChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.onGreenFill,
  },
  statChipLabel: { fontSize: 13, color: colors.offWhite },
  topSpotChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.serenity,
  },
  topSpotLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.polyGreen },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: 'rgba(23,35,29,0.06)',
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 8,
  },
  link: { flex: 1, fontSize: 15 },
  copyButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.serenity,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyLabel: { fontFamily: fonts.semibold, fontSize: 14, color: colors.polyGreen },
});
