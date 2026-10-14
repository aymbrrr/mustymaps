import React from 'react';
import { StyleSheet, Text as RNText, TextProps } from 'react-native';
import { colors, fonts } from '../../theme/tokens';

/**
 * Every bit of copy goes through here so Geist and the ink colour are the
 * defaults — a bare RNText would silently fall back to the system font.
 */
export function Text({ style, ...rest }: TextProps) {
  return <RNText {...rest} style={[styles.base, style]} />;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: fonts.regular,
    color: colors.ink,
  },
});
