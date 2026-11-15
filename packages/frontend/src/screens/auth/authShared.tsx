import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ChevronLeftIcon } from '../../components/Icons';
import { validate } from '../../lib/validation';

export const INVALID_EMAIL_MESSAGE = 'needs to be a @calpoly.edu email.';

export const isCalPolyEmail = validate.isCalPolyEmail;

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
