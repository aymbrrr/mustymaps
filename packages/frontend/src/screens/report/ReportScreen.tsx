/**
 * Report screen — self-report conditions at a location.
 * Target is a submit in under 15 seconds: busyness is the only required field.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useLocationStore } from '../../stores/locationStore';
import { colors, spacing, typography } from '../../constants/theme';
import {
  BUSYNESS_LEVELS,
  Busyness,
  OpenSeats,
  OPEN_SEATS_LABELS,
} from '../../lib/crowdUtils';
import { validate } from '../../lib/validation';
import { AppRootParamList } from '../../navigation/types';

const WAIT_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'None' },
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 20, label: '20 min' },
  { value: 30, label: '30+ min' },
];

const SEAT_OPTIONS: OpenSeats[] = ['none', 'few', 'many'];

export function ReportScreen() {
  const route = useRoute<RouteProp<AppRootParamList, 'Report'>>();
  const navigation = useNavigation<NativeStackNavigationProp<AppRootParamList>>();
  const { locationId, locationName } = route.params;

  const submitReport = useLocationStore((s) => s.submitReport);

  const [busyness, setBusyness] = useState<Busyness | null>(null);
  const [waitMinutes, setWaitMinutes] = useState<number | null>(null);
  const [openSeats, setOpenSeats] = useState<OpenSeats | null>(null);
  const [freeFood, setFreeFood] = useState(false);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (busyness == null) return;
    setIsSubmitting(true);
    setError(null);

    const result = await submitReport({
      location_id: locationId,
      busyness,
      wait_minutes: waitMinutes,
      open_seats: openSeats,
      free_food: freeFood,
      note: note.trim() ? validate.note(note) : null,
    });

    setIsSubmitting(false);
    if (result.ok) {
      navigation.goBack();
    } else {
      setError(result.error ?? 'Could not submit your report.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button">
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{locationName}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Section title="How busy is it?" required>
          <View style={styles.optionRow}>
            {BUSYNESS_LEVELS.map((level) => {
              const active = busyness === level.value;
              return (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.busynessOption,
                    active && { backgroundColor: level.color, borderColor: level.color },
                  ]}
                  onPress={() => setBusyness(level.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`${level.label} — ${level.hint}`}
                >
                  <Text style={[styles.busynessLabel, active && styles.optionTextActive]}>
                    {level.label}
                  </Text>
                  <Text style={[styles.busynessHint, active && styles.optionTextActive]}>
                    {level.hint}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <Section title="Wait time">
          <View style={styles.optionRow}>
            {WAIT_OPTIONS.map((option) => (
              <Pill
                key={option.value}
                label={option.label}
                active={waitMinutes === option.value}
                onPress={() =>
                  setWaitMinutes(waitMinutes === option.value ? null : option.value)
                }
              />
            ))}
          </View>
        </Section>

        <Section title="Open seats">
          <View style={styles.optionRow}>
            {SEAT_OPTIONS.map((seats) => (
              <Pill
                key={seats}
                label={OPEN_SEATS_LABELS[seats]}
                active={openSeats === seats}
                onPress={() => setOpenSeats(openSeats === seats ? null : seats)}
              />
            ))}
          </View>
        </Section>

        <View style={styles.foodRow}>
          <View style={styles.foodTextBlock}>
            <Text style={styles.sectionTitle}>Free food here</Text>
            <Text style={styles.sectionHint}>Tabling, leftovers, an event giveaway</Text>
          </View>
          <Switch
            value={freeFood}
            onValueChange={setFreeFood}
            trackColor={{ true: colors.primary, false: '#CFD8DC' }}
            accessibilityLabel="Free food available here"
          />
        </View>

        <Section title="Anything else?">
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Optional — line is out the door, 2nd floor is empty..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={280}
            accessibilityLabel="Optional note"
          />
          <Text style={styles.charCount}>{note.length}/280</Text>
        </Section>

        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, busyness == null && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={busyness == null || isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Submit report"
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={styles.submitButtonText}>Submit report</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Section({
  title,
  required,
  children,
}: {
  title: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
        {required && <Text style={styles.requiredMark}> *</Text>}
      </Text>
      {children}
    </View>
  );
}

function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.pillText, active && styles.optionTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  cancel: { ...typography.body, color: colors.primary, width: 64 },
  headerTitle: { ...typography.heading3, color: colors.textPrimary, flex: 1, textAlign: 'center' },
  headerSpacer: { width: 64 },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg },
  section: { gap: spacing.sm },
  sectionTitle: { ...typography.label, color: colors.textPrimary, fontSize: 16 },
  sectionHint: { ...typography.bodySm, color: colors.textMuted },
  requiredMark: { color: colors.error },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  busynessOption: {
    flex: 1,
    minWidth: 96,
    minHeight: 64,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.sm,
    justifyContent: 'center',
  },
  busynessLabel: { ...typography.label, color: colors.textPrimary },
  busynessHint: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  optionTextActive: { color: colors.textInverse },
  pill: {
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { ...typography.bodySm, color: colors.textPrimary },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  foodTextBlock: { flex: 1, gap: 2 },
  noteInput: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    minHeight: 88,
    textAlignVertical: 'top',
  },
  charCount: { ...typography.caption, color: colors.textMuted, alignSelf: 'flex-end' },
  error: { ...typography.bodySm, color: colors.error },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: { backgroundColor: '#B0BEC5' },
  submitButtonText: { ...typography.label, color: colors.textInverse, fontSize: 16 },
});
