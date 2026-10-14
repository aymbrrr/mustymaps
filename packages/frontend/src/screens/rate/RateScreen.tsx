import React, { useEffect, useMemo } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { CloseIcon } from '../../components/Icons';
import { useToast } from '../../components/ToastHost';
import { CircleButton, PrimaryButton } from '../../components/ui/Buttons';
import { FadeScrim } from '../../components/ui/FadeScrim';
import { TextArea } from '../../components/ui/Inputs';
import { Card, rowDivider, SectionLabel } from '../../components/ui/Layout';
import { Chip, Tag } from '../../components/ui/Pills';
import { StarPicker } from '../../components/ui/Stars';
import { StripedPhoto } from '../../components/ui/StripedPhoto';
import { Text } from '../../components/ui/Text';
import { BUSY_LEVEL_COLORS, BUSY_LEVELS, BusyLevel } from '../../domain/busyness';
import { EXTRA_TAGS, STAR_CAPTIONS, SUB_SCORE_LABELS } from '../../domain/rating';
import { AppStackParamList } from '../../navigation/types';
import { useRatingStore } from '../../stores/ratingStore';
import { useSpotStore } from '../../stores/spotStore';
import { colors, fonts, radius, spacing, type } from '../../theme/tokens';

type Props = NativeStackScreenProps<AppStackParamList, 'Rate'>;

const SUB_SCORE_STEPS = [1, 2, 3, 4, 5];

export function RateScreen({ navigation, route }: Props) {
  const toast = useToast();
  const spots = useSpotStore((state) => state.spots);
  const draft = useRatingStore((state) => state.draft);
  const startDraft = useRatingStore((state) => state.startDraft);
  const setStars = useRatingStore((state) => state.setStars);
  const setSubScore = useRatingStore((state) => state.setSubScore);
  const setBusyLevel = useRatingStore((state) => state.setBusyLevel);
  const toggleTag = useRatingStore((state) => state.toggleTag);
  const setText = useRatingStore((state) => state.setText);
  const submitDraft = useRatingStore((state) => state.submitDraft);

  const { spotId, seedStars, seedBusyLevel } = route.params;

  useEffect(() => {
    startDraft(spotId, { stars: seedStars ?? 0, busyLevel: seedBusyLevel ?? null });
  }, [startDraft, spotId, seedStars, seedBusyLevel]);

  const spot = useMemo(
    () => spots.find((candidate) => candidate.id === draft.spotId) ?? null,
    [spots, draft.spotId]
  );

  if (!spot) return <View style={styles.screen} />;

  const tagOptions = [...spot.tags, ...EXTRA_TAGS[spot.type]];

  const post = async () => {
    if (!draft.stars) return;
    await submitDraft();
    navigation.goBack();
    toast('posted. thanks for the intel.');
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <CircleButton size={44} accessibilityLabel="close" onPress={() => navigation.goBack()}>
            <CloseIcon size={16} />
          </CircleButton>
          <Text style={styles.headerTitle}>rate a spot</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.spotPicker}
        >
          {spots.map((candidate) => (
            <Chip
              key={candidate.id}
              compact
              label={candidate.shortName}
              selected={candidate.id === draft.spotId}
              onPress={() => startDraft(candidate.id)}
            />
          ))}
        </ScrollView>

        <View style={styles.body}>
          <View style={styles.overallBlock}>
            <SectionLabel label="overall" />
            <Text style={type.rateQuestion}>
              how was {spot.shortName}
              <Text style={styles.questionMark}>?</Text>
            </Text>
            <View style={styles.starRow}>
              <StarPicker value={draft.stars} onChange={setStars} />
              <Text style={styles.starCaption}>{STAR_CAPTIONS[draft.stars]}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <SectionLabel label="the details" />
            <Card style={styles.detailsCard}>
              {SUB_SCORE_LABELS[spot.type].map((label, index) => (
                <View key={label} style={[styles.detailRow, rowDivider(index)]}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <View style={styles.segmentRow}>
                    {SUB_SCORE_STEPS.map((step) => (
                      <Pressable
                        key={step}
                        accessibilityRole="button"
                        accessibilityLabel={`${label} ${step} of 5`}
                        onPress={() => setSubScore(index, step)}
                        style={[
                          styles.segment,
                          {
                            backgroundColor:
                              step <= (draft.subScores[index] ?? 0) ? colors.polyGreen : colors.track,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </Card>
          </View>

          <View style={styles.section}>
            <SectionLabel label="how busy is it rn?" />
            <View style={styles.wrapRow}>
              {BUSY_LEVELS.map((label, index) => (
                <Chip
                  key={label}
                  label={label}
                  dotColor={BUSY_LEVEL_COLORS[index]}
                  selected={draft.busyLevel === index}
                  onPress={() => setBusyLevel(index as BusyLevel)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SectionLabel label="tags" />
            <View style={styles.wrapRow}>
              {tagOptions.map((tag) => (
                <Tag
                  key={tag}
                  roomy
                  label={tag}
                  selected={draft.tags.includes(tag)}
                  onPress={() => toggleTag(tag)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SectionLabel label="anything else?" />
            <TextArea
              value={draft.text}
              onChangeText={setText}
              placeholder="the tea, the tips, the best seat…"
            />
            <Pressable accessibilityRole="button" onPress={() => toast('opens photo picker')}>
              <StripedPhoto
                stripe={10}
                stripeColors={['rgba(213,228,244,0.5)', 'rgba(213,228,244,0.2)']}
                style={styles.photoButton}
              >
                <Text style={styles.photoLabel}>+ add a photo</Text>
              </StripedPhoto>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <FadeScrim />
        <PrimaryButton
          label={draft.stars ? 'post rating' : 'tap a star to rate'}
          onPress={post}
          disabled={!draft.stars}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  scrollContent: { paddingTop: 56, paddingBottom: 130 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 4, paddingHorizontal: 18, paddingBottom: 10 },
  headerTitle: { flex: 1, textAlign: 'center', fontFamily: fonts.semibold, fontSize: 17 },
  headerSpacer: { width: 44 },
  spotPicker: { gap: 8, paddingTop: 6, paddingHorizontal: 18, paddingBottom: 4 },
  body: { paddingTop: 18, paddingHorizontal: spacing.screen, gap: 24 },
  overallBlock: { gap: 6 },
  questionMark: { color: colors.serenityDeep },
  starRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  starCaption: { marginLeft: 10, fontFamily: fonts.semibold, fontSize: 16, color: colors.polyGreen },
  section: { gap: 10 },
  detailsCard: { paddingVertical: 4, paddingHorizontal: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  detailLabel: { width: 78, fontSize: 15 },
  segmentRow: { flex: 1, flexDirection: 'row', gap: 5 },
  segment: { flex: 1, height: 30, borderRadius: radius.segment },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoButton: {
    height: 88,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(21,71,52,0.3)',
  },
  photoLabel: { fontFamily: fonts.medium, fontSize: 15, color: colors.polyGreen },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 14,
    paddingHorizontal: spacing.screen,
    paddingBottom: 34,
  },
});
