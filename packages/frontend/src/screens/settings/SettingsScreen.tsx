import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ChevronLeftIcon, ChevronRightIcon } from '../../components/Icons';
import { useToast } from '../../components/ToastHost';
import { CircleButton, DangerButton, SecondaryButton } from '../../components/ui/Buttons';
import { Toggle } from '../../components/ui/Inputs';
import { ListCard, rowDivider, SectionLabel } from '../../components/ui/Layout';
import { Dialog } from '../../components/ui/Sheet';
import { Text } from '../../components/ui/Text';
import { AppSettings } from '../../domain/models';
import { AppStackParamList } from '../../navigation/types';
import { useSessionStore } from '../../stores/sessionStore';
import { colors, fonts, spacing, type } from '../../theme/tokens';

type Props = NativeStackScreenProps<AppStackParamList, 'Settings'>;

const DISABLED_ROW_OPACITY = 0.4;
const VERSION_LINE = 'musty’s map 1.0 (12) · made at cal poly';

type SettingsRow =
  | { kind: 'toggle'; key: keyof AppSettings; label: string; sub?: string; disabled?: boolean }
  | { kind: 'nav'; label: string; value?: string; onPress: () => void; danger?: boolean };

interface SettingsSection {
  title: string;
  rows: SettingsRow[];
  footer?: string;
}

export function SettingsScreen({ navigation }: Props) {
  const toast = useToast();
  const settings = useSessionStore((state) => state.settings);
  const toggleSetting = useSessionStore((state) => state.toggleSetting);
  const signOut = useSessionStore((state) => state.signOut);
  const deleteAccount = useSessionStore((state) => state.deleteAccount);
  const email = useSessionStore((state) => state.me?.email ?? '');

  const [confirmDelete, setConfirmDelete] = useState(false);

  // Every push sub-toggle follows the master switch and the mute-all override.
  const pushMuted = !settings.notifs || settings.muteAll;

  const sections: SettingsSection[] = [
    {
      title: 'notifications',
      footer: 'you can also manage these in iOS settings → musty’s map.',
      rows: [
        { kind: 'toggle', key: 'notifs', label: 'allow notifications' },
        {
          kind: 'toggle',
          key: 'muteAll',
          label: 'mute all',
          sub: 'pause every push. no dings, no buzz.',
          disabled: !settings.notifs,
        },
        { kind: 'toggle', key: 'replies', label: 'replies to your reviews', disabled: pushMuted },
        { kind: 'toggle', key: 'follows', label: 'new followers', disabled: pushMuted },
        {
          kind: 'toggle',
          key: 'busyAlerts',
          label: 'busy alerts',
          sub: 'ping me when a spot i rated clears out',
          disabled: pushMuted,
        },
        { kind: 'toggle', key: 'sounds', label: 'sounds', disabled: pushMuted },
        { kind: 'toggle', key: 'badges', label: 'badge app icon', disabled: pushMuted },
      ],
    },
    {
      title: 'location',
      footer: 'used to show spots near you. never shown on your profile.',
      rows: [
        {
          kind: 'nav',
          label: 'location access',
          value: 'while using',
          onPress: () => toast('opens iOS settings'),
        },
        { kind: 'toggle', key: 'precise', label: 'precise location' },
      ],
    },
    {
      title: 'privacy',
      rows: [
        {
          kind: 'toggle',
          key: 'publicProfile',
          label: 'public profile',
          sub: 'anyone at cal poly can see your ratings',
        },
        { kind: 'toggle', key: 'showRatings', label: 'show ratings on profile' },
        {
          kind: 'toggle',
          key: 'tracking',
          label: 'allow tracking',
          sub: 'measure ads across other apps. off by default.',
        },
        {
          kind: 'nav',
          label: 'blocked users',
          value: 'none',
          onPress: () => toast('you haven’t blocked anyone'),
        },
        { kind: 'nav', label: 'download my data', onPress: () => toast('we’ll email you a copy') },
      ],
    },
    {
      title: 'accessibility',
      rows: [
        { kind: 'toggle', key: 'reduceMotion', label: 'reduce motion' },
        { kind: 'toggle', key: 'haptics', label: 'haptics' },
        { kind: 'nav', label: 'text size', value: 'system', onPress: () => toast('follows iOS text size') },
      ],
    },
    {
      title: 'legal',
      rows: [
        { kind: 'nav', label: 'terms of service', onPress: () => toast('opens terms') },
        { kind: 'nav', label: 'privacy policy', onPress: () => toast('opens privacy policy') },
        { kind: 'nav', label: 'community guidelines', onPress: () => toast('opens guidelines') },
      ],
    },
    {
      title: 'account',
      rows: [
        { kind: 'nav', label: 'email', value: email, onPress: () => toast('verified school email') },
        { kind: 'nav', label: 'change password', onPress: () => toast('reset link sent') },
        { kind: 'nav', label: 'sign out', danger: true, onPress: () => void signOut() },
        { kind: 'nav', label: 'delete account', danger: true, onPress: () => setConfirmDelete(true) },
      ],
    },
  ];

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <CircleButton size={44} accessibilityLabel="back" onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={20} />
          </CircleButton>
        </View>

        <Text style={styles.title}>
          settings<Text style={styles.period}>.</Text>
        </Text>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionLabel}>
              <SectionLabel label={section.title} />
            </View>
            <ListCard>
              {section.rows.map((row, index) => (
                <SettingsRowView
                  key={row.label}
                  row={row}
                  index={index}
                  settings={settings}
                  onToggle={toggleSetting}
                />
              ))}
            </ListCard>
            {section.footer ? <Text style={styles.footer}>{section.footer}</Text> : null}
          </View>
        ))}

        <Text style={styles.version}>{VERSION_LINE}</Text>
      </ScrollView>

      <Dialog visible={confirmDelete} onDismiss={() => setConfirmDelete(false)}>
        <Text style={styles.dialogTitle}>delete your account?</Text>
        <Text style={styles.dialogBody}>
          this permanently wipes your profile, ratings and reviews. no undo.
        </Text>
        <DangerButton
          label="delete forever"
          style={styles.dialogPrimary}
          onPress={async () => {
            setConfirmDelete(false);
            const failure = await deleteAccount();
            if (failure) toast(failure);
          }}
        />
        <SecondaryButton label="never mind" height={50} onPress={() => setConfirmDelete(false)} />
      </Dialog>
    </>
  );
}

function SettingsRowView({
  row,
  index,
  settings,
  onToggle,
}: {
  row: SettingsRow;
  index: number;
  settings: AppSettings;
  onToggle: (key: keyof AppSettings) => void;
}) {
  const isToggle = row.kind === 'toggle';
  const disabled = isToggle && !!row.disabled;

  const body = (
    <View style={[styles.row, rowDivider(index), disabled ? styles.rowDisabled : null]}>
      <View style={styles.rowText}>
        <Text
          style={[
            styles.rowLabel,
            !isToggle && row.danger ? styles.rowLabelDanger : null,
          ]}
        >
          {row.label}
        </Text>
        {isToggle && row.sub ? <Text style={styles.rowSub}>{row.sub}</Text> : null}
      </View>

      {isToggle ? (
        <Toggle value={settings[row.key]} disabled={disabled} onToggle={() => onToggle(row.key)} />
      ) : row.danger ? null : (
        <View style={styles.rowValue}>
          {row.value ? <Text style={styles.rowValueText}>{row.value}</Text> : null}
          <ChevronRightIcon />
        </View>
      )}
    </View>
  );

  if (isToggle) {
    return (
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: settings[row.key], disabled }}
        onPress={disabled ? undefined : () => onToggle(row.key)}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <Pressable accessibilityRole="button" onPress={row.onPress}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  content: { paddingTop: 56, paddingBottom: 50 },
  header: { paddingTop: 4, paddingHorizontal: 18, paddingBottom: 8 },
  title: { ...type.screenTitle, paddingTop: 6, paddingHorizontal: 22, paddingBottom: 4 },
  period: { color: colors.serenityDeep },
  section: { paddingTop: 22, paddingHorizontal: 18, gap: 10 },
  sectionLabel: { paddingHorizontal: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    minHeight: spacing.row,
  },
  rowDisabled: { opacity: DISABLED_ROW_OPACITY },
  rowText: { flex: 1, minWidth: 0, gap: 2 },
  rowLabel: { fontSize: 16 },
  rowLabelDanger: { fontFamily: fonts.semibold, color: colors.danger },
  rowSub: { fontSize: 13, lineHeight: 18, color: colors.sealGrey },
  rowValue: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValueText: { fontSize: 15, color: colors.sealGrey },
  footer: { paddingHorizontal: 6, fontSize: 13, lineHeight: 18, color: colors.sealGrey },
  version: { paddingTop: 28, paddingHorizontal: 22, textAlign: 'center', fontSize: 13, color: colors.sealGrey },
  dialogTitle: { fontFamily: fonts.semibold, fontSize: 21, letterSpacing: -0.42, textAlign: 'center' },
  dialogBody: { fontSize: 15, lineHeight: 21, color: colors.sealGrey, textAlign: 'center' },
  dialogPrimary: { marginTop: 8 },
});
