import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, type } from '../../theme/tokens';
import { Text } from './Text';

/** Uppercase section label, optionally with a grey caption on the right. */
export function SectionLabel({ label, caption }: { label: string; caption?: string }) {
  if (!caption) return <Text style={type.sectionLabel}>{label}</Text>;
  return (
    <View style={styles.labelRow}>
      <Text style={type.sectionLabel}>{label}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Grouped container for stacked rows — settings groups, leaderboard lists. */
export function ListCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.listCard, style]}>{children}</View>;
}

/** Hairline above every row except the first in a group. */
export function rowDivider(index: number): ViewStyle {
  return index === 0 ? {} : { borderTopWidth: 1, borderTopColor: colors.hairline };
}

export function GrabHandle({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.grabHandle, style]} />;
}

export function Divider() {
  return <View style={styles.divider} />;
}

/** Three-up stats strip: ratings · avg given · followers. */
export function StatsCard({
  items,
  style,
}: {
  items: { value: ReactNode; label: string }[];
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Card style={[styles.statsCard, style]}>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 ? <View style={styles.statsSeparator} /> : null}
          <View style={styles.stat}>
            {item.value}
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        </React.Fragment>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  caption: { fontSize: 13, color: colors.sealGrey },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  listCard: {
    backgroundColor: colors.card,
    borderRadius: radius.list,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  grabHandle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.grabHandle,
    alignSelf: 'center',
  },
  divider: { height: 1, backgroundColor: colors.hairline },
  statsCard: { flexDirection: 'row', paddingVertical: spacing.card },
  statsSeparator: { width: 1, backgroundColor: colors.dividerStrong },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statLabel: { fontSize: 13, color: colors.sealGrey },
});
