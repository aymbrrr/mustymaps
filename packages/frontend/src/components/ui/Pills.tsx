import React, { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { busyColor, busyLiveLabel } from '../../domain/busyness';
import { SPOT_TYPE_LABEL, SpotType } from '../../domain/models';
import { colors, fonts, radius, shadows } from '../../theme/tokens';
import { StarNumber } from './Stars';
import { Text } from './Text';

export function Dot({ size, color }: { size: number; color: string }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
}

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Leading busyness dot, used by the rate screen's level chips. */
  dotColor?: string;
  /** Slightly tighter, for the rate screen's spot picker. */
  compact?: boolean;
}

/** Filter / option pill: white when unselected, green when selected. */
export function Chip({ label, selected, onPress, dotColor, compact }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        compact ? styles.chipCompact : null,
        {
          backgroundColor: selected ? colors.polyGreen : colors.card,
          borderColor: selected ? colors.polyGreen : colors.inputBorder,
        },
        dotColor ? styles.chipWithDot : null,
      ]}
    >
      {dotColor ? <Dot size={7} color={dotColor} /> : null}
      <Text style={[styles.chipLabel, { color: selected ? colors.offWhite : colors.ink }]}>{label}</Text>
    </Pressable>
  );
}

/** Map overlay chips sit on top of tiles, so they carry a shadow and no border. */
export function MapChip({ label, selected, onPress }: Omit<ChipProps, 'dotColor'>) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.mapChip,
        shadows.headerCard,
        { backgroundColor: selected ? colors.polyGreen : colors.mapChip },
      ]}
    >
      <Text style={[styles.mapChipLabel, { color: selected ? colors.offWhite : colors.ink }]}>{label}</Text>
    </Pressable>
  );
}

/** Serenity-filled keyword tag; toggles to green when it is selectable. */
export function Tag({
  label,
  selected,
  onPress,
  roomy,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** The rate screen's selectable tags sit a touch larger. */
  roomy?: boolean;
}) {
  const body = (
    <View
      style={[
        styles.tag,
        roomy ? styles.tagRoomy : null,
        { backgroundColor: selected ? colors.polyGreen : colors.serenity },
      ]}
    >
      <Text style={[styles.tagLabel, { color: selected ? colors.offWhite : colors.polyGreen }]}>{label}</Text>
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: !!selected }} onPress={onPress}>
      {body}
    </Pressable>
  );
}

/** Outlined chip used for the personality labels on a public profile. */
export function OutlineTag({ label }: { label: string }) {
  return (
    <View style={styles.outlineTag}>
      <Text style={styles.tagLabel}>{label}</Text>
    </View>
  );
}

/** Uppercase EAT / STUDY chip. */
export function TypeChip({ type }: { type: SpotType }) {
  const isFood = type === 'food';
  return (
    <View style={[styles.typeChip, { backgroundColor: isFood ? colors.polyGreen : colors.serenity }]}>
      <Text style={[styles.typeChipLabel, { color: isFood ? colors.offWhite : colors.polyGreen }]}>
        {SPOT_TYPE_LABEL[type]}
      </Text>
    </View>
  );
}

/** White chip with a hairline border: hours, walk time. */
export function InfoChip({ label }: { label: string }) {
  return (
    <View style={styles.infoChip}>
      <Text style={styles.infoChipLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function ScorePill({ score, size = 13 }: { score: number | string; size?: number }) {
  return (
    <View style={[styles.scorePill, size > 13 ? styles.scorePillLarge : null]}>
      <StarNumber value={score} size={size} color={colors.offWhite} />
    </View>
  );
}

/** Dark "lively rn" status pill. */
export function LivePill({ occupancy, large = false }: { occupancy: number; large?: boolean }) {
  return (
    <View style={[styles.livePill, large ? styles.livePillLarge : null]}>
      <Dot size={large ? 8 : 7} color={busyColor(occupancy)} />
      <Text style={[styles.livePillLabel, large ? styles.livePillLabelLarge : null]}>
        {busyLiveLabel(occupancy)}
      </Text>
    </View>
  );
}

/** Light variant of the status pill, for the map's expanded spot bar. */
export function OutlineLivePill({ occupancy }: { occupancy: number }) {
  return (
    <View style={styles.outlineLivePill}>
      <Dot size={7} color={busyColor(occupancy)} />
      <Text style={styles.outlineLivePillLabel}>{busyLiveLabel(occupancy)}</Text>
    </View>
  );
}

/** 44-46pt rounded square stamped "eat" or "study". */
export function CategoryTile({ type, size = 46 }: { type: SpotType; size?: number }) {
  const isFood = type === 'food';
  return (
    <View
      style={[
        styles.categoryTile,
        {
          width: size,
          height: size,
          borderRadius: size >= 46 ? radius.tile : radius.tileSm,
          backgroundColor: isFood ? colors.polyGreen : colors.serenity,
        },
      ]}
    >
      <Text style={[styles.categoryTileLabel, { color: isFood ? colors.offWhite : colors.polyGreen }]}>
        {SPOT_TYPE_LABEL[type]}
      </Text>
    </View>
  );
}

/** Circular initials avatar. */
export function Avatar({
  initials,
  size,
  background = colors.serenity,
  color = colors.polyGreen,
  fontSize,
  children,
}: {
  initials: string;
  size: number;
  background?: string;
  color?: string;
  fontSize?: number;
  children?: ReactNode;
}) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: background },
      ]}
    >
      <Text style={{ fontFamily: fonts.medium, fontSize: fontSize ?? size * 0.4, color }}>{initials}</Text>
      {children}
    </View>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chipCompact: { paddingHorizontal: 15 },
  chipWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  chipLabel: { fontFamily: fonts.medium, fontSize: 14 },
  mapChip: { paddingVertical: 10, paddingHorizontal: 17, borderRadius: radius.pill },
  mapChipLabel: { fontFamily: fonts.medium, fontSize: 15 },
  tag: { paddingVertical: 8, paddingHorizontal: 13, borderRadius: radius.pill },
  tagRoomy: { paddingVertical: 9, paddingHorizontal: 14 },
  tagLabel: { fontFamily: fonts.medium, fontSize: 14 },
  outlineTag: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  typeChip: { paddingVertical: 5, paddingHorizontal: 11, borderRadius: radius.pill },
  typeChipLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 0.72,
    textTransform: 'uppercase',
  },
  infoChip: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.dividerStrong,
  },
  infoChipLabel: { fontFamily: fonts.medium, fontSize: 13 },
  scorePill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.polyGreen,
  },
  scorePillLarge: { paddingVertical: 6, paddingHorizontal: 11 },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
  },
  livePillLarge: { gap: 7, paddingVertical: 9, paddingHorizontal: 14 },
  livePillLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.offWhite },
  livePillLabelLarge: { fontSize: 14 },
  outlineLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.dividerStrong,
  },
  outlineLivePillLabel: { fontFamily: fonts.medium, fontSize: 13 },
  categoryTile: { alignItems: 'center', justifyContent: 'center' },
  categoryTileLabel: { fontFamily: fonts.semibold, fontSize: 13 },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
});
