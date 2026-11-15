import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useToast } from '../../components/ToastHost';
import { GrabHandle } from '../../components/ui/Layout';
import { Avatar } from '../../components/ui/Pills';
import { Sheet } from '../../components/ui/Sheet';
import { Text } from '../../components/ui/Text';
import { Me, MeDraft } from '../../domain/models';
import { initialsOf } from '../../domain/rating';
import { colors, fonts, radius, type } from '../../theme/tokens';

interface EditProfileSheetProps {
  visible: boolean;
  me: Me;
  onCancel: () => void;
  onSave: (draft: MeDraft) => void;
}

export function EditProfileSheet({ visible, me, onCancel, onSave }: EditProfileSheetProps) {
  const toast = useToast();
  const [draft, setDraft] = useState<MeDraft>(me);
  const [wasVisible, setWasVisible] = useState(visible);

  // Reopening discards an abandoned edit rather than resuming it.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setDraft({ name: me.name, handle: me.handle, majorYear: me.majorYear, bio: me.bio });
  }

  const field = (key: keyof MeDraft) => (value: string) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <Sheet visible={visible} onDismiss={onCancel} variant="docked" dismissOnScrim={false} contentStyle={styles.sheet}>
      <GrabHandle style={styles.handle} />

      <View style={styles.headerRow}>
        <Text accessibilityRole="button" style={styles.cancel} onPress={onCancel}>
          cancel
        </Text>
        <Text style={styles.title}>edit profile</Text>
        <Text accessibilityRole="button" style={styles.save} onPress={() => onSave(draft)}>
          save
        </Text>
      </View>

      <View style={styles.avatarRow}>
        <Avatar initials={initialsOf(draft.name)} size={64} fontSize={26} />
        <Text accessibilityRole="button" style={styles.changePhoto} onPress={() => toast('opens photo picker')}>
          change photo
        </Text>
      </View>

      <EditField label="name" value={draft.name} onChangeText={field('name')} />
      <EditField label="handle" value={draft.handle} onChangeText={field('handle')} autoCapitalize="none" />
      <EditField label="major · year" value={draft.majorYear} onChangeText={field('majorYear')} />
      <EditField label="bio" value={draft.bio} onChangeText={field('bio')} multiline />
    </Sheet>
  );
}

function EditField({
  label,
  multiline,
  ...rest
}: { label: string; multiline?: boolean } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={type.sectionLabel}>{label}</Text>
      <TextInput
        {...rest}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={colors.sealGrey}
        style={[styles.input, multiline ? styles.inputMultiline : null]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { gap: 14 },
  handle: { marginBottom: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cancel: { fontSize: 16, color: colors.sealGrey },
  title: { fontFamily: fonts.semibold, fontSize: 17 },
  save: { fontFamily: fonts.semibold, fontSize: 16, color: colors.polyGreen },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 6 },
  changePhoto: { fontFamily: fonts.semibold, fontSize: 15, color: colors.polyGreen },
  field: { gap: 6 },
  input: {
    height: 52,
    borderRadius: radius.inputSm,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.ink,
  },
  inputMultiline: { minHeight: 80, height: undefined, paddingVertical: 14, lineHeight: 22 },
});
