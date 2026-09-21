/**
 * Profile screen — account info and sign out.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, typography, spacing } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';

export function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Profile</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>{user?.email ?? 'Signed in'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={signOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  heading: { ...typography.heading1, color: colors.textPrimary },
  section: { gap: spacing.sm },
  sectionTitle: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase' },
  row: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
  },
  rowText: { ...typography.body, color: colors.textPrimary },
  signOutButton: {
    minHeight: 52,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: { ...typography.label, color: colors.error, fontSize: 16 },
});
