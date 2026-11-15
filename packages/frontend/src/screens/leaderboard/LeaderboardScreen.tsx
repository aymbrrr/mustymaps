import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useToast } from '../../components/ToastHost';
import { PressableCard } from '../../components/ui/Buttons';
import { rowDivider } from '../../components/ui/Layout';
import { Avatar, Chip } from '../../components/ui/Pills';
import { Text } from '../../components/ui/Text';
import { backend } from '../../data/backend';
import { LeaderboardEntry, LeaderboardMetric, LeaderboardScope } from '../../domain/models';
import { initialsOf } from '../../domain/rating';
import { useAsync } from '../../hooks/useAsync';
import { TabScreenProps } from '../../navigation/types';
import { avatarTints, colors, fonts, radius, spacing, type } from '../../theme/tokens';

const METRICS: { label: string; value: LeaderboardMetric }[] = [
  { label: 'ratings', value: 'ratings' },
  { label: 'reviews', value: 'reviews' },
  { label: 'spots', value: 'spots' },
  { label: 'streak', value: 'streak' },
];

const SCOPES: { label: string; value: LeaderboardScope }[] = [
  { label: 'all cal poly', value: 'all' },
  { label: 'this week', value: 'week' },
];

/** Podium blocks are ordered 2nd, 1st, 3rd and sized by rank. */
const PODIUM_ORDER = [1, 0, 2];
const PODIUM_HEIGHTS: Record<number, number> = { 1: 118, 2: 92, 3: 76 };

export function LeaderboardScreen({ navigation }: TabScreenProps<'Leaderboard'>) {
  const toast = useToast();
  const [metric, setMetric] = useState<LeaderboardMetric>('ratings');
  const [scope, setScope] = useState<LeaderboardScope>('all');

  const board = useAsync(() => backend().leaderboard.load(metric, scope), [metric, scope]);

  const openEntry = (entry: LeaderboardEntry) => {
    if (entry.isMe) {
      navigation.navigate('MainTabs', { screen: 'Profile' });
      return;
    }
    if (!entry.userId) {
      toast('profile preview only for jordan, priya & sam');
      return;
    }
    navigation.navigate('PublicProfile', { userId: entry.userId });
  };

  const avatarStyleFor = (entry: LeaderboardEntry) => {
    if (entry.rank === 1) return { background: colors.polyGreen, color: colors.offWhite };
    if (entry.isMe) return { background: colors.serenity, color: colors.polyGreen };
    return { background: avatarTints[entry.rank % 3], color: colors.ink };
  };

  const handleOf = (entry: LeaderboardEntry) => (entry.isMe ? `${entry.handle} (you)` : entry.handle);

  const podium = board ? PODIUM_ORDER.map((index) => board.entries[index]).filter(Boolean) : [];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        leaderboard<Text style={styles.period}>.</Text>
      </Text>

      <View style={styles.segmented}>
        {METRICS.map((option) => {
          const active = metric === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setMetric(option.value)}
              style={[styles.segment, active ? styles.segmentActive : null]}
            >
              <Text style={[styles.segmentLabel, active ? styles.segmentLabelActive : null]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.description}>{backend().leaderboard.describe(metric, scope)}</Text>

      <View style={styles.scopeRow}>
        {SCOPES.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={scope === option.value}
            onPress={() => setScope(option.value)}
          />
        ))}
      </View>

      <View style={styles.podium}>
        {podium.map((entry) => {
          const avatarStyle = avatarStyleFor(entry);
          const isWinner = entry.rank === 1;
          return (
            <PressableCard
              key={entry.rank}
              onPress={() => openEntry(entry)}
              style={styles.podiumColumn}
              scale={1}
            >
              <Avatar
                initials={initialsOf(entry.name)}
                size={isWinner ? 68 : 56}
                fontSize={20}
                background={avatarStyle.background}
                color={avatarStyle.color}
              >
                <View style={[styles.rankBadge, { borderColor: avatarStyle.background }]}>
                  <Text style={styles.rankBadgeLabel}>{entry.rank}</Text>
                </View>
              </Avatar>
              <Text style={styles.podiumHandle} numberOfLines={1}>
                @{handleOf(entry)}
              </Text>
              <View
                style={[
                  styles.podiumBlock,
                  {
                    height: PODIUM_HEIGHTS[entry.rank],
                    backgroundColor: isWinner ? colors.polyGreen : colors.card,
                  },
                ]}
              >
                <Text style={[styles.podiumValue, isWinner ? styles.onGreen : null]}>{entry.value}</Text>
                <Text style={[styles.podiumUnit, isWinner ? styles.onGreen : null]}>
                  {board?.unit}
                </Text>
              </View>
            </PressableCard>
          );
        })}
      </View>

      {board ? (
        <View style={styles.myRankCard}>
          <Text style={styles.myRank}>#{board.me.rank}</Text>
          <Avatar initials={initialsOf(board.entries.find((entry) => entry.isMe)?.name ?? '')} size={38} fontSize={14} />
          <View style={styles.myRankMeta}>
            <Text style={styles.myRankTitle}>you</Text>
            <Text style={styles.myRankGap}>{board.me.gapToNext}</Text>
          </View>
          <Text style={styles.myRankValue}>{board.me.value}</Text>
        </View>
      ) : null}

      <View style={styles.listCard}>
        {(board?.entries ?? []).slice(3).map((entry, index) => {
          const avatarStyle = avatarStyleFor(entry);
          return (
            <PressableCard
              key={entry.rank}
              onPress={() => openEntry(entry)}
              style={[styles.listRow, rowDivider(index)]}
              scale={1}
            >
              <Text style={styles.listRank}>{entry.rank}</Text>
              <Avatar
                initials={initialsOf(entry.name)}
                size={40}
                fontSize={14}
                background={avatarStyle.background}
                color={avatarStyle.color}
              />
              <View style={styles.listMeta}>
                <Text style={styles.listHandle}>@{handleOf(entry)}</Text>
                <Text
                  style={[styles.listSub, entry.sub.startsWith('+') || entry.isMe ? styles.listSubAccent : null]}
                >
                  {entry.sub}
                </Text>
              </View>
              <Text style={styles.listValue}>{entry.value}</Text>
            </PressableCard>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  content: { paddingTop: spacing.safeTop, paddingBottom: 110 },
  title: { ...type.screenTitle, paddingTop: 8, paddingHorizontal: 22 },
  period: { color: colors.serenityDeep },
  segmented: {
    marginTop: 16,
    marginHorizontal: spacing.screen,
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.segmentTrack,
    flexDirection: 'row',
    gap: 2,
  },
  segment: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.pill },
  segmentActive: {
    backgroundColor: colors.card,
    shadowColor: '#17231D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentLabel: { fontFamily: fonts.medium, fontSize: 14 },
  segmentLabelActive: { fontFamily: fonts.semibold, color: colors.polyGreen },
  description: { paddingTop: 12, paddingHorizontal: 24, fontSize: 14, color: colors.sealGrey },
  scopeRow: { flexDirection: 'row', gap: 8, paddingTop: 14, paddingHorizontal: spacing.screen },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingTop: 22,
    paddingHorizontal: spacing.screen,
  },
  podiumColumn: { flex: 1, alignItems: 'center', gap: 8 },
  rankBadge: {
    position: 'absolute',
    bottom: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.offWhite,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeLabel: { fontFamily: fonts.bold, fontSize: 12, color: colors.polyGreen },
  podiumHandle: { fontFamily: fonts.semibold, fontSize: 13, maxWidth: '100%' },
  podiumBlock: {
    width: '100%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    paddingTop: 12,
  },
  podiumValue: { fontFamily: fonts.semibold, fontSize: 24, letterSpacing: -0.72 },
  podiumUnit: { fontSize: 11, opacity: 0.8 },
  onGreen: { color: colors.offWhite },
  myRankCard: {
    marginTop: 16,
    marginHorizontal: spacing.screen,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.polyGreen,
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  myRank: { width: 30, fontFamily: fonts.semibold, fontSize: 18, color: colors.polyGreen },
  myRankMeta: { flex: 1, gap: 1 },
  myRankTitle: { fontFamily: fonts.semibold, fontSize: 15 },
  myRankGap: { fontSize: 12, color: colors.sealGrey },
  myRankValue: { fontFamily: fonts.semibold, fontSize: 18 },
  listCard: {
    marginTop: 12,
    marginHorizontal: spacing.screen,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  listRank: { width: 24, fontFamily: fonts.semibold, fontSize: 15, color: colors.sealGrey },
  listMeta: { flex: 1, minWidth: 0, gap: 1 },
  listHandle: { fontFamily: fonts.semibold, fontSize: 15 },
  listSub: { fontSize: 12, color: colors.sealGrey },
  listSubAccent: { color: colors.polyGreen },
  listValue: { fontFamily: fonts.semibold, fontSize: 17 },
});
