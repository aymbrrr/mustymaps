import React, { useEffect, useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { HourlyChart } from '../../components/BusynessChart';
import { ChevronLeftIcon, ShareIcon } from '../../components/Icons';
import { QuickRateSheet } from '../../components/QuickRateSheet';
import { useToast } from '../../components/ToastHost';
import { CircleButton, PressableCard, PrimaryButton, SecondaryButton } from '../../components/ui/Buttons';
import { FadeScrim } from '../../components/ui/FadeScrim';
import { Card, rowDivider, SectionLabel } from '../../components/ui/Layout';
import { Avatar, InfoChip, LivePill, ScorePill, Tag, TypeChip } from '../../components/ui/Pills';
import { StarRow } from '../../components/ui/Stars';
import { StripedPhoto } from '../../components/ui/StripedPhoto';
import { Text } from '../../components/ui/Text';
import { backend } from '../../data/backend';
import { busyLevelName, CHART_FIRST_HOUR, hourLabel } from '../../domain/busyness';
import {
  busynessDetailSub,
  curveForDay,
  DAY_LABELS,
  initialsOf,
  SUB_SCORE_LABELS,
} from '../../domain/rating';
import { useAsync } from '../../hooks/useAsync';
import { useNow } from '../../hooks/useNow';
import { AppStackParamList } from '../../navigation/types';
import { useSessionStore } from '../../stores/sessionStore';
import { useSpotStore } from '../../stores/spotStore';
import { colors, fonts, radius, spacing, type } from '../../theme/tokens';

type Props = NativeStackScreenProps<AppStackParamList, 'LocationDetail'>;

export function LocationDetailScreen({ navigation, route }: Props) {
  const { spotId } = route.params;
  const toast = useToast();
  const { nowIndex } = useNow();
  const reduceMotion = useSessionStore((state) => state.settings.reduceMotion);
  const spots = useSpotStore((state) => state.spots);
  const remember = useSpotStore((state) => state.remember);

  const spot = useMemo(() => spots.find((candidate) => candidate.id === spotId) ?? null, [spots, spotId]);
  const reviews = useAsync(() => backend().reviews.listForSpot(spotId), [spotId]);

  const [dayIndex, setDayIndex] = useState(0);
  const [hourIndex, setHourIndex] = useState(nowIndex);
  const [quickRateOpen, setQuickRateOpen] = useState(false);

  useEffect(() => {
    remember(spotId);
  }, [remember, spotId]);

  if (!spot) return <View style={styles.screen} />;

  const curve = curveForDay(spot.hourlyBusy, dayIndex);
  const occupancyAtHour = curve[hourIndex];
  const isNow = dayIndex === 0 && hourIndex === nowIndex;
  const busyTitle = isNow
    ? `${busyLevelName(occupancyAtHour)} right now`
    : `usually ${busyLevelName(occupancyAtHour)} ${DAY_LABELS[dayIndex]} at ${hourLabel(CHART_FIRST_HOUR + hourIndex)}`;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <StripedPhoto stripe={12} label={`[ photo · ${spot.name} ]`} labelSize={12} plate style={styles.hero}>
          <CircleButton
            size={44}
            accessibilityLabel="back"
            background={colors.offWhite}
            shadow="soft"
            style={styles.heroBack}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size={20} />
          </CircleButton>
          <CircleButton
            size={44}
            accessibilityLabel="share spot"
            background={colors.offWhite}
            shadow="soft"
            style={styles.heroShare}
            onPress={() => toast(`link to ${spot.name} copied`)}
          >
            <ShareIcon />
          </CircleButton>
        </StripedPhoto>

        <View style={styles.sheet}>
          <View style={styles.headBlock}>
            <View style={styles.chipRow}>
              <TypeChip type={spot.type} />
              <InfoChip label={spot.hoursLabel} />
              <InfoChip label={`${spot.walkTime} walk`} />
            </View>
            <Text style={type.locationName}>{spot.name}</Text>
            <Text style={styles.area}>{spot.area}</Text>

            <View style={styles.ratingRow}>
              <Text style={type.bigRating}>{spot.rating}</Text>
              <View style={styles.ratingMeta}>
                <StarRow value={Math.round(spot.rating)} size={11} />
                <Text style={styles.ratingCount}>{spot.ratingCount} ratings</Text>
              </View>
              <LivePill occupancy={spot.hourlyBusy[nowIndex]} large />
            </View>
          </View>

          <View style={styles.section}>
            <SectionLabel label="how busy" />
            <View style={styles.dayRow}>
              {DAY_LABELS.map((day, index) => {
                const selected = index === dayIndex;
                return (
                  <Pressable
                    key={day}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setDayIndex(index)}
                    style={[
                      styles.dayChip,
                      {
                        backgroundColor: selected ? colors.polyGreen : colors.card,
                        borderColor: selected ? colors.polyGreen : colors.inputBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.dayLabel, { color: selected ? colors.offWhite : colors.ink }]}>
                      {index === 0 ? 'today' : day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Card style={styles.busyCard}>
              <View style={styles.busyHeading}>
                <Text style={styles.busyTitle}>{busyTitle}</Text>
                <Text style={styles.busySub}>{busynessDetailSub(spot.type, occupancyAtHour, isNow)}</Text>
              </View>
              <HourlyChart
                curve={curve}
                selectedHour={hourIndex}
                nowIndex={nowIndex}
                isToday={dayIndex === 0}
                onSelectHour={setHourIndex}
                animate={!reduceMotion}
              />
            </Card>
          </View>

          <View style={styles.section}>
            <SectionLabel label="the breakdown" />
            <Card style={styles.breakdownCard}>
              {SUB_SCORE_LABELS[spot.type].map((label, index) => (
                <View key={label} style={[styles.breakdownRow, rowDivider(index)]}>
                  <Text style={styles.breakdownLabel}>{label}</Text>
                  <View style={styles.breakdownTrack}>
                    <View style={[styles.breakdownFill, { width: `${(spot.subScores[index] / 5) * 100}%` }]} />
                  </View>
                  <Text style={styles.breakdownValue}>{spot.subScores[index].toFixed(1)}</Text>
                </View>
              ))}
            </Card>
            <View style={styles.tagRow}>
              {spot.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SectionLabel label="reviews" caption="newest first" />
            {(reviews ?? []).map((review) => (
              <Card key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHead}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`open @${review.authorHandle}`}
                    onPress={() => navigation.navigate('PublicProfile', { userId: review.authorId })}
                  >
                    <Avatar initials={initialsOf(review.authorName)} size={38} fontSize={15} />
                  </Pressable>
                  <PressableCard
                    scale={1}
                    onPress={() => navigation.navigate('PublicProfile', { userId: review.authorId })}
                    style={styles.reviewAuthor}
                  >
                    <Text style={styles.reviewHandle}>@{review.authorHandle}</Text>
                    <Text style={styles.reviewWhen}>{review.createdAtLabel}</Text>
                  </PressableCard>
                  <ScorePill score={review.stars} />
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <FadeScrim />
        <SecondaryButton
          label="quick rate"
          height={54}
          style={styles.footerSecondary}
          onPress={() => setQuickRateOpen(true)}
        />
        <PrimaryButton
          label="write a review"
          height={54}
          style={styles.footerPrimary}
          onPress={() => navigation.navigate('Rate', { spotId })}
        />
      </View>

      <QuickRateSheet
        visible={quickRateOpen}
        spot={spot}
        onDismiss={() => setQuickRateOpen(false)}
        onWriteFullReview={(stars, busyLevel) => {
          setQuickRateOpen(false);
          navigation.navigate('Rate', { spotId, seedStars: stars, seedBusyLevel: busyLevel });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  scrollContent: { paddingBottom: 120 },
  hero: { height: 290 },
  heroBack: { position: 'absolute', top: spacing.safeTop, left: 18 },
  heroShare: { position: 'absolute', top: spacing.safeTop, right: 18 },
  sheet: {
    marginTop: -28,
    backgroundColor: colors.offWhite,
    borderTopLeftRadius: radius.heroOverlap,
    borderTopRightRadius: radius.heroOverlap,
    paddingTop: 24,
    paddingHorizontal: spacing.screen,
    gap: spacing.section,
  },
  headBlock: { gap: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  area: { fontSize: 15, color: colors.sealGrey },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 8 },
  ratingMeta: { flex: 1, gap: 4 },
  ratingCount: { fontSize: 13, color: colors.sealGrey },
  section: { gap: 12 },
  dayRow: { flexDirection: 'row', gap: 6 },
  dayChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dayLabel: { fontFamily: fonts.medium, fontSize: 13 },
  busyCard: { paddingTop: 18, paddingHorizontal: 16, paddingBottom: 14, gap: 14 },
  busyHeading: { gap: 3 },
  busyTitle: { fontFamily: fonts.semibold, fontSize: 19, letterSpacing: -0.38 },
  busySub: { fontSize: 14, color: colors.sealGrey },
  breakdownCard: { paddingVertical: 6, paddingHorizontal: 18 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  breakdownLabel: { width: 72, fontSize: 15 },
  breakdownTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.track, overflow: 'hidden' },
  breakdownFill: { height: '100%', borderRadius: 4, backgroundColor: colors.polyGreen },
  breakdownValue: { width: 28, textAlign: 'right', fontFamily: fonts.semibold, fontSize: 15 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reviewCard: { padding: 16, gap: 10 },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAuthor: { flex: 1, gap: 1 },
  reviewHandle: { fontFamily: fonts.semibold, fontSize: 15 },
  reviewWhen: { fontSize: 12, color: colors.sealGrey },
  reviewText: { fontSize: 15, lineHeight: 22 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    paddingTop: 14,
    paddingHorizontal: spacing.screen,
    paddingBottom: 34,
  },
  footerSecondary: { flex: 1, backgroundColor: colors.offWhite },
  footerPrimary: { flex: 1.4 },
});
