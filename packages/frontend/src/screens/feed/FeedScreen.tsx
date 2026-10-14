import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SearchIcon } from '../../components/Icons';
import { MustyAvatar } from '../../components/MustyAvatar';
import { useToast } from '../../components/ToastHost';
import { PressableCard } from '../../components/ui/Buttons';
import { SectionLabel } from '../../components/ui/Layout';
import { CategoryTile, Chip, Dot, LivePill } from '../../components/ui/Pills';
import { StarNumber } from '../../components/ui/Stars';
import { StripedPhoto } from '../../components/ui/StripedPhoto';
import { Text } from '../../components/ui/Text';
import { busyColor, busyLiveLabel } from '../../domain/busyness';
import { Spot } from '../../domain/models';
import { useNow } from '../../hooks/useNow';
import { TabScreenProps } from '../../navigation/types';
import { TypeFilter, useSpotStore } from '../../stores/spotStore';
import { colors, fonts, radius, spacing, type } from '../../theme/tokens';

const TRENDING_COUNT = 4;
const FEED_FILTERS: { label: string; value: TypeFilter }[] = [
  { label: 'all', value: 'all' },
  { label: 'eat', value: 'food' },
  { label: 'study', value: 'study' },
];

export function FeedScreen({ navigation }: TabScreenProps<'Feed'>) {
  const toast = useToast();
  const { nowIndex, nowLabel } = useNow();
  const spots = useSpotStore((state) => state.spots);
  const topComments = useSpotStore((state) => state.topComments);
  const feedFilter = useSpotStore((state) => state.feedFilter);
  const setFeedFilter = useSpotStore((state) => state.setFeedFilter);

  const trending = useMemo(
    () =>
      [...spots].sort((a, b) => b.hourlyBusy[nowIndex] - a.hourlyBusy[nowIndex]).slice(0, TRENDING_COUNT),
    [spots, nowIndex]
  );

  const listed = useMemo(
    () =>
      spots
        .filter((spot) => feedFilter === 'all' || spot.type === feedFilter)
        .sort((a, b) => b.rating - a.rating),
    [spots, feedFilter]
  );

  const openSpot = (spot: Spot) => navigation.navigate('LocationDetail', { spotId: spot.id });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <MustyAvatar size={42} />
        <Text style={styles.wordmark}>
          musty&apos;s map<Text style={styles.period}>.</Text>
        </Text>
      </View>

      <Pressable
        accessibilityRole="search"
        onPress={() => toast('search coming soon')}
        style={styles.searchBar}
      >
        <SearchIcon size={19} color={colors.sealGrey} />
        <Text style={styles.searchPlaceholder}>search a spot or a person</Text>
      </Pressable>

      <View style={styles.trendingHeader}>
        <SectionLabel label="trending rn" caption={`busiest at ${nowLabel}`} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      >
        {trending.map((spot, index) => (
          <PressableCard key={spot.id} onPress={() => openSpot(spot)} style={styles.trendingCard}>
            <StripedPhoto stripe={10} label="[ photo ]" style={styles.trendingPhoto}>
              <View style={styles.trendingLive}>
                <LivePill occupancy={spot.hourlyBusy[nowIndex]} />
              </View>
              <View style={styles.rankPill}>
                <Text style={styles.rankLabel}>#{index + 1}</Text>
              </View>
            </StripedPhoto>
            <View style={styles.trendingBody}>
              <Text style={styles.trendingName}>{spot.name}</Text>
              <StarNumber
                value={spot.rating}
                size={13}
                family={fonts.regular}
                color={colors.sealGrey}
                suffix={` · ${Math.round(spot.hourlyBusy[nowIndex] * 0.45)} check-ins this hr`}
              />
            </View>
          </PressableCard>
        ))}
      </ScrollView>

      <View style={styles.allSpotsHeader}>
        <SectionLabel label="all spots" />
        <View style={styles.chipRow}>
          {FEED_FILTERS.map((filter) => (
            <Chip
              key={filter.value}
              label={filter.label}
              selected={feedFilter === filter.value}
              onPress={() => setFeedFilter(filter.value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.list}>
        {listed.map((spot) => {
          const occupancy = spot.hourlyBusy[nowIndex];
          const topComment = topComments[spot.id];
          return (
            <PressableCard key={spot.id} onPress={() => openSpot(spot)} style={styles.spotCard}>
              <View style={styles.spotRow}>
                <CategoryTile type={spot.type} />
                <View style={styles.spotMeta}>
                  <Text style={styles.spotName}>{spot.name}</Text>
                  <Text style={styles.spotSub}>
                    {spot.walkTime} walk · {spot.hoursLabel}
                  </Text>
                </View>
                <View style={styles.spotRating}>
                  <StarNumber value={spot.rating} size={20} letterSpacing={-0.6} />
                  <Text style={styles.spotRatingCount}>{spot.ratingCount} ratings</Text>
                </View>
              </View>

              <View style={styles.busyRow}>
                <View style={styles.busyLabel}>
                  <Dot size={8} color={busyColor(occupancy)} />
                  <Text style={styles.busyLabelText} numberOfLines={1}>
                    {busyLiveLabel(occupancy)}
                  </Text>
                </View>
                <View style={styles.busyTrack}>
                  <View
                    style={[styles.busyFill, { width: `${occupancy}%`, backgroundColor: busyColor(occupancy) }]}
                  />
                </View>
              </View>

              <View style={styles.quoteBox}>
                <Text style={styles.quoteText}>
                  “{topComment ? topComment.text : 'no reviews yet'}”
                </Text>
                <StarNumber
                  value={topComment ? topComment.stars : '—'}
                  size={12}
                  family={fonts.regular}
                  color={colors.sealGrey}
                  prefix={`top comment · @${topComment ? topComment.authorHandle : '—'} · `}
                />
              </View>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: spacing.screen },
  wordmark: { fontFamily: fonts.semibold, fontSize: 25, letterSpacing: -1, color: colors.polyGreen },
  period: { color: colors.serenityDeep },
  searchBar: {
    marginTop: 16,
    marginHorizontal: spacing.screen,
    height: 50,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
  },
  searchPlaceholder: { fontSize: 16, color: colors.sealGrey },
  trendingHeader: { paddingTop: 26, paddingHorizontal: spacing.screen, paddingBottom: 12 },
  carousel: { gap: 12, paddingHorizontal: spacing.screen, paddingBottom: 4 },
  trendingCard: {
    width: 210,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  trendingPhoto: { height: 112 },
  trendingLive: { position: 'absolute', top: 10, left: 10 },
  rankPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.offWhite,
  },
  rankLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.polyGreen },
  trendingBody: { paddingTop: 12, paddingHorizontal: 14, paddingBottom: 14, gap: 3 },
  trendingName: { ...type.cardTitleSm },
  allSpotsHeader: { paddingTop: 28, paddingHorizontal: spacing.screen, paddingBottom: 12, gap: 12 },
  chipRow: { flexDirection: 'row', gap: 8 },
  list: { paddingHorizontal: spacing.screen, gap: 12 },
  spotCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 14,
    gap: 12,
  },
  spotRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  spotMeta: { flex: 1, minWidth: 0, gap: 2 },
  spotName: { ...type.cardTitle },
  spotSub: { fontSize: 13, color: colors.sealGrey },
  spotRating: { alignItems: 'flex-end', gap: 1 },
  spotRatingCount: { fontSize: 11, color: colors.sealGrey },
  busyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  busyLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 104 },
  busyLabelText: { fontFamily: fonts.medium, fontSize: 13 },
  busyTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.track, overflow: 'hidden' },
  busyFill: { height: '100%', borderRadius: 3 },
  quoteBox: {
    backgroundColor: colors.quoteBg,
    borderRadius: radius.busyTile,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6,
  },
  quoteText: { fontSize: 15, lineHeight: 21 },
});
