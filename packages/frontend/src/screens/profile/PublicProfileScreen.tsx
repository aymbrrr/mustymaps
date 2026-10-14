import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ChevronLeftIcon, ShareIcon } from '../../components/Icons';
import { useToast } from '../../components/ToastHost';
import { CircleButton, PressableCard } from '../../components/ui/Buttons';
import { Card, Divider, SectionLabel, StatsCard } from '../../components/ui/Layout';
import { Avatar, OutlineTag, ScorePill } from '../../components/ui/Pills';
import { StarNumber } from '../../components/ui/Stars';
import { StripedPhoto } from '../../components/ui/StripedPhoto';
import { Text } from '../../components/ui/Text';
import { backend } from '../../data/backend';
import { initialsOf } from '../../domain/rating';
import { useAsync } from '../../hooks/useAsync';
import { AppStackParamList } from '../../navigation/types';
import { colors, fonts, radius, spacing, type } from '../../theme/tokens';

type Props = NativeStackScreenProps<AppStackParamList, 'PublicProfile'>;

export function PublicProfileScreen({ navigation, route }: Props) {
  const { userId } = route.params;
  const toast = useToast();
  const profile = useAsync(() => backend().profiles.getPublicProfile(userId), [userId]);

  if (!profile) return <View style={styles.screen} />;

  const maxDistribution = Math.max(...profile.ratingDistribution);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <CircleButton
            size={44}
            accessibilityLabel="back"
            background={colors.offWhite}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size={20} />
          </CircleButton>
          <CircleButton
            size={44}
            accessibilityLabel="share profile"
            background={colors.offWhite}
            onPress={() => toast('profile link copied')}
          >
            <ShareIcon />
          </CircleButton>
        </View>

        <View style={styles.identity}>
          <Avatar
            initials={initialsOf(profile.name)}
            size={84}
            fontSize={32}
            background={colors.polyGreen}
            color={colors.offWhite}
          />
          <View style={styles.identityText}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.meta}>
              @{profile.handle} · {profile.majorYear}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <StatsCard
          items={[
            { label: 'ratings', value: <Text style={styles.statValue}>{profile.ratingCount}</Text> },
            { label: 'avg given', value: <StarNumber value={profile.avgGiven} size={24} /> },
            { label: 'followers', value: <Text style={styles.statValue}>{profile.followers}</Text> },
          ]}
        />

        <View style={styles.section}>
          <SectionLabel label="how they rate" />
          <Card style={styles.distributionCard}>
            {profile.ratingDistribution.map((count, index) => (
              <View key={index} style={styles.distributionRow}>
                <Text style={styles.distributionLabel}>
                  {5 - index}
                  <Text style={styles.distributionStar}>★</Text>
                </Text>
                <View style={styles.distributionTrack}>
                  <View style={[styles.distributionFill, { width: `${(count / maxDistribution) * 100}%` }]} />
                </View>
                <Text style={styles.distributionCount}>{count}</Text>
              </View>
            ))}

            <Divider />

            <View style={styles.splitLabels}>
              <Text style={styles.splitFood}>food · {profile.foodPct}%</Text>
              <Text style={styles.splitStudy}>study · {100 - profile.foodPct}%</Text>
            </View>
            <View style={styles.splitBar}>
              <View style={[styles.splitBarFood, { width: `${profile.foodPct}%` }]} />
              <View style={styles.splitBarStudy} />
            </View>
          </Card>

          <View style={styles.labelRow}>
            {profile.labels.map((label) => (
              <OutlineTag key={label} label={label} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel label="go-to spots" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.goToScroll}
            contentContainerStyle={styles.goToRow}
          >
            {profile.goToSpots.map((spot) => (
              <PressableCard
                key={spot.spotId}
                onPress={() => navigation.push('LocationDetail', { spotId: spot.spotId })}
                style={styles.goToCard}
              >
                <StripedPhoto stripe={9} label="[ photo ]" style={styles.goToPhoto} />
                <View style={styles.goToBody}>
                  <Text style={styles.goToName}>{spot.spotName}</Text>
                  <StarNumber
                    value={spot.stars}
                    size={13}
                    family={fonts.regular}
                    color={colors.sealGrey}
                    prefix="they gave "
                  />
                </View>
              </PressableCard>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionLabel label="recent ratings" />
          {profile.recentRatings.map((rating, index) => (
            <PressableCard
              key={`${rating.spotId}-${index}`}
              onPress={() => navigation.push('LocationDetail', { spotId: rating.spotId })}
              style={styles.recentCard}
            >
              <View style={styles.recentHead}>
                <View style={styles.recentMeta}>
                  <Text style={styles.recentName}>{rating.spotName}</Text>
                  <Text style={styles.recentWhen}>{rating.createdAtLabel}</Text>
                </View>
                <ScorePill score={rating.stars} />
              </View>
              <Text style={styles.recentText}>{rating.text}</Text>
            </PressableCard>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  content: { paddingBottom: 40 },
  header: {
    backgroundColor: colors.serenity,
    paddingTop: spacing.safeTop,
    paddingHorizontal: spacing.screen,
    paddingBottom: 26,
    borderBottomLeftRadius: radius.sheet,
    borderBottomRightRadius: radius.sheet,
    gap: 18,
  },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between' },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  identityText: { flex: 1, minWidth: 0, gap: 3 },
  name: { fontFamily: fonts.semibold, fontSize: 26, letterSpacing: -0.78, color: colors.polyGreen },
  meta: { fontSize: 14 },
  body: { paddingTop: spacing.screen, paddingHorizontal: spacing.screen, gap: spacing.section },
  statValue: { fontFamily: fonts.semibold, fontSize: 24 },
  section: { gap: 12 },
  distributionCard: { paddingVertical: 16, paddingHorizontal: 18, gap: 9 },
  distributionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  distributionLabel: { width: 28, fontFamily: fonts.semibold, fontSize: 14 },
  distributionStar: { fontSize: 10 },
  distributionTrack: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.track, overflow: 'hidden' },
  distributionFill: { height: '100%', borderRadius: 5, backgroundColor: colors.polyGreen },
  distributionCount: { width: 28, textAlign: 'right', fontSize: 13, color: colors.sealGrey },
  splitLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  splitFood: { fontFamily: fonts.medium, fontSize: 13 },
  splitStudy: { fontFamily: fonts.medium, fontSize: 13, color: colors.sealGrey },
  splitBar: { flexDirection: 'row', height: 12, gap: 3 },
  splitBarFood: { backgroundColor: colors.polyGreen, borderRadius: 6 },
  splitBarStudy: { flex: 1, backgroundColor: colors.serenity, borderRadius: 6 },
  labelRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  goToScroll: { marginHorizontal: -spacing.screen },
  goToRow: { gap: 10, paddingHorizontal: spacing.screen },
  goToCard: {
    width: 150,
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  goToPhoto: { height: 92 },
  goToBody: { paddingTop: 10, paddingHorizontal: 12, paddingBottom: 12, gap: 3 },
  goToName: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 18 },
  recentCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    gap: 8,
  },
  recentHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  recentMeta: { flex: 1, gap: 1 },
  recentName: { ...type.cardTitleSm },
  recentWhen: { fontSize: 12, color: colors.sealGrey },
  recentText: { fontSize: 15, lineHeight: 22 },
});
