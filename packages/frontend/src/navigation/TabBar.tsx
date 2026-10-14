/**
 * Five-slot tab bar: feed · map · rate FAB · ranks · you.
 *
 * The centre slot is not a tab — it pushes Rate a Spot for whichever spot is
 * currently selected or was last viewed, which is why the bar is custom rather
 * than configured through the navigator.
 */
import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  FeedTabIcon,
  IconProps,
  MapTabIcon,
  PersonTabIcon,
  PlusIcon,
  TrophyTabIcon,
} from '../components/Icons';
import { Text } from '../components/ui/Text';
import { colors, PRESS_SCALE_CONTROL, shadows, spacing, type } from '../theme/tokens';
import { TabParamList } from './types';

const TAB_META: { name: keyof TabParamList; label: string; Icon: React.FC<IconProps> }[] = [
  { name: 'Feed', label: 'feed', Icon: FeedTabIcon },
  { name: 'Map', label: 'map', Icon: MapTabIcon },
  { name: 'Leaderboard', label: 'ranks', Icon: TrophyTabIcon },
  { name: 'Profile', label: 'you', Icon: PersonTabIcon },
];

export function TabBar({ state, navigation, onRatePress }: BottomTabBarProps & { onRatePress: () => void }) {
  const activeName = state.routes[state.index]?.name;

  const slot = (meta: (typeof TAB_META)[number]) => {
    const focused = activeName === meta.name;
    const tint = focused ? colors.polyGreen : colors.sealGrey;
    return (
      <Pressable
        key={meta.name}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={meta.label}
        onPress={() => navigation.navigate(meta.name)}
        style={styles.slot}
      >
        <meta.Icon color={tint} />
        <Text style={[type.tabLabel, { color: tint }]}>{meta.label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.bar}>
      {slot(TAB_META[0])}
      {slot(TAB_META[1])}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="rate a spot"
        onPress={onRatePress}
        style={({ pressed }) => [
          styles.fab,
          shadows.fab,
          pressed ? { transform: [{ scale: PRESS_SCALE_CONTROL }] } : null,
        ]}
      >
        <PlusIcon />
      </Pressable>
      {slot(TAB_META[2])}
      {slot(TAB_META[3])}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: spacing.tabBar,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingHorizontal: 6,
    backgroundColor: colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  slot: { width: 62, alignItems: 'center', gap: 4 },
  fab: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginTop: -26,
    backgroundColor: colors.polyGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
