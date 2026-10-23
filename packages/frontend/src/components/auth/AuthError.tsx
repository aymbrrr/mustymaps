import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

export function AuthError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorBox: { backgroundColor: '#FDECEA', borderRadius: 8, padding: spacing.md },
  errorText: { ...typography.bodySm, color: colors.error },
});
