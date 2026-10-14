import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ChevronLeftIcon } from '../../components/Icons';

/**
 * Sign-up is gated to Cal Poly students. The gateway enforces this too — this
 * copy exists so the field can turn red before a round trip.
 */
const CALPOLY_EMAIL = /@calpoly\.edu$/i;

export const INVALID_EMAIL_MESSAGE = 'needs to be a @calpoly.edu email.';

export function isCalPolyEmail(email: string): boolean {
  return CALPOLY_EMAIL.test(email.trim());
}

/** 44pt back target, nudged left so the glyph lines up with the screen padding. */
export function BackChevron({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="back" onPress={onPress} style={styles.back}>
      <ChevronLeftIcon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: { width: 44, height: 44, marginLeft: -10, alignItems: 'center', justifyContent: 'center' },
});
