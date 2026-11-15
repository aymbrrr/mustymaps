import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ShareIcon, SlidersIcon } from '../../components/Icons';
import { useToast } from '../../components/ToastHost';
import { CircleButton, PressableCard, PrimaryButton, SecondaryButton } from '../../components/ui/Buttons';
import { SectionLabel, StatsCard } from '../../components/ui/Layout';
import { Avatar, CategoryTile, Chip, ScorePill } from '../../components/ui/Pills';
import { StarNumber } from '../../components/ui/Stars';
import { Text } from '../../components/ui/Text';
import { MeDraft, Spot } from '../../domain/models';
import { initialsOf } from '../../domain/rating';
import { TabScreenProps } from '../../navigation/types';
import { useRatingStore } from '../../stores/ratingStore';
import { useSessionStore } from '../../stores/sessionStore';
import { TypeFilter, useSpotStore } from '../../stores/spotStore';
import { colors, fonts, radius, spacing, type } from '../../theme/tokens';
import { EditProfileSheet } from './EditProfileSheet';
import { ShareProfileSheet } from './ShareProfileSheet';

const PROFILE_FILTERS: { label: string; value: TypeFilter }[] = [
  { label: 'all', value: 'all' },
  { label: 'eat', value: 'food' },
  { label: 'study', value: 'study' },
];

export function ProfileScreen({ navigation }: TabScreenProps<'Profile'>) {
  const toast = useToast();
  const me = useSessionStore((state) => state.me);
  const saveProfile = useSessionStore((state) => state.saveProfile);
  const spots = useSpotStore((state) => state.spots);
  const myRatings = useRatingStore((state) => state.myRatings);
  const loadMyRatings = useRatingStore((state) => state.loadMyRatings);

  const [filter, setFilter] = useState<TypeFilter>('all');
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    void loadMyRatings();
  }, [loadMyRatings]);

  const spotById = useMemo(() => new Map(spots.map((spot) => [spot.id, spot])), [spots]);

  const averageGiven = myRatings.length
    ? (myRatings.reduce((total, rating) => total + rating.stars, 0) / myRatings.length).toFixed(1)
    : '—';

  const countFor = (value: TypeFilter) =>
    value === 'all'
      ? myRatings.length
      : myRatings.filter((rating) => spotById.get(rating.spotId)?.type === value).length;

  const visibleRatings = myRatings.filter(
    (rating) => filter === 'all' || spotById.get(rating.spotId)?.type === filter
  );

  const topSpot = [...myRatings].sort((a, b) => b.stars - a.stars)[0];

  if (!me) return <View style={styles.screen} />;

  const onSave = async (draft: MeDraft) => {
    await saveProfile(draft);
    setEditOpen(false);
    toast('profile updated');
  };

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.handle}>@{me.handle}</Text>
          <CircleButton size={46} accessibilityLabel="share profile" shadow="soft" onPress={() => setShareOpen(true)}>
            <ShareIcon />
          </CircleButton>
          <CircleButton
            size={46}
            accessibilityLabel="settings"
            shadow="soft"
            onPress={() => navigation.navigate('Settings')}
          >
            <SlidersIcon />
          </CircleButton>
        </View>

        <View style={styles.identity}>
          <Avatar initials={initialsOf(me.name)} size={108} fontSize={44} >
            {me.isTopRater ? (
              <View style={styles.topRaterBadge}>
                <Text style={styles.topRaterLabel}>TOP RATER</Text>
              </View>
            ) : null}
          </Avatar>
          <Text style={styles.name}>{me.name}</Text>
          <Text style={styles.major}>{me.majorYear}</Text>
          <Text style={styles.bio}>{me.bio}</Text>
        </View>

        <StatsCard
          style={styles.statsCard}
          items={[
            { label: 'ratings', value: <Text style={styles.statValue}>{myRatings.length}</Text> },
            { label: 'avg given', value: <StarNumber value={averageGiven} size={24} /> },
            { label: 'followers', value: <Text style={styles.statValue}>{me.followers}</Text> },
          ]}
        />

        <View style={styles.actions}>
          <SecondaryButton label="edit profile" height={50} style={styles.action} onPress={() => setEditOpen(true)} />
          <PrimaryButton label="share profile" height={50} style={styles.action} onPress={() => setShareOpen(true)} />
        </View>

        <View style={styles.ratingsSection}>
          <SectionLabel label="your ratings" />
          <View style={styles.chipRow}>
            {PROFILE_FILTERS.map((option) => (
              <Chip
                key={option.value}
                label={`${option.label} · ${countFor(option.value)}`}
                selected={filter === option.value}
                onPress={() => setFilter(option.value)}
              />
            ))}
          </View>

          {visibleRatings.map((rating) => {
            const spot = spotById.get(rating.spotId);
            if (!spot) return null;
            return (
              <RatingCard
                key={rating.spotId}
                spot={spot}
                stars={rating.stars}
                when={rating.ratedAtLabel}
                note={rating.note}
                onPress={() => navigation.navigate('LocationDetail', { spotId: spot.id })}
              />
            );
          })}
        </View>
      </ScrollView>

      <EditProfileSheet visible={editOpen} me={me} onCancel={() => setEditOpen(false)} onSave={onSave} />

      <ShareProfileSheet
        visible={shareOpen}
        me={me}
        ratingCount={myRatings.length}
        avgGiven={averageGiven}
        topSpotName={topSpot ? (spotById.get(topSpot.spotId)?.name ?? '—') : '—'}
        onDismiss={() => setShareOpen(false)}
        onShareVia={() => {
          setShareOpen(false);
          toast('opens iOS share sheet');
        }}
      />
    </>
  );
}

function RatingCard({
  spot,
  stars,
  when,
  note,
  onPress,
}: {
  spot: Spot;
  stars: number;
  when: string;
  note: string;
  onPress: () => void;
}) {
  return (
    <PressableCard onPress={onPress} style={styles.ratingCard}>
      <View style={styles.ratingRow}>
        <CategoryTile type={spot.type} />
        <View style={styles.ratingMeta}>
          <Text style={styles.ratingName}>{spot.name}</Text>
          <Text style={styles.ratingWhen}>rated {when}</Text>
        </View>
        <ScorePill score={stars} size={14} />
      </View>
      <Text style={styles.ratingNote}>{note}</Text>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  content: { paddingTop: spacing.safeTop, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 22, paddingRight: 18 },
  handle: { flex: 1, fontFamily: fonts.semibold, fontSize: 24, letterSpacing: -0.48 },
  identity: { alignItems: 'center', gap: 6, paddingTop: 22, paddingHorizontal: 24 },
  topRaterBadge: {
    position: 'absolute',
    right: -6,
    bottom: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.polyGreen,
    borderWidth: 3,
    borderColor: colors.offWhite,
  },
  topRaterLabel: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 0.66, color: colors.offWhite },
  name: { fontFamily: fonts.semibold, fontSize: 26, letterSpacing: -0.78, marginTop: 8 },
  major: { fontSize: 14, color: colors.sealGrey },
  bio: { fontSize: 15, lineHeight: 21, textAlign: 'center', maxWidth: 280 },
  statsCard: { marginTop: 22, marginHorizontal: spacing.screen },
  statValue: { fontFamily: fonts.semibold, fontSize: 24 },
  actions: { flexDirection: 'row', gap: 10, paddingTop: 14, paddingHorizontal: spacing.screen },
  action: { flex: 1 },
  ratingsSection: { paddingTop: 28, paddingHorizontal: spacing.screen, gap: 12 },
  chipRow: { flexDirection: 'row', gap: 8 },
  ratingCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 14,
    gap: 10,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ratingMeta: { flex: 1, minWidth: 0, gap: 2 },
  ratingName: { ...type.cardTitleSm },
  ratingWhen: { fontSize: 13, color: colors.sealGrey },
  ratingNote: { fontSize: 15, lineHeight: 21 },
});
