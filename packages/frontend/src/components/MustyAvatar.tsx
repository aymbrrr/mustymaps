/**
 * The Musty mascot slot.
 *
 * The mascot artwork is not part of the design handoff. Drop a transparent
 * PNG/SVG at `assets/musty.png` and set MUSTY_SOURCE to `require` it; every
 * surface that shows Musty (intro, map header, feed header, share card) picks it
 * up. Until then this renders the same placeholder the prototype used.
 */
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { colors, fonts } from '../theme/tokens';
import { Text } from './ui/Text';

const MUSTY_SOURCE: ImageSourcePropType | null = null;

interface MustyAvatarProps {
  size: number;
  /** Intro screen frames the mascot in a 6pt green ring. */
  ring?: boolean;
  placeholder?: string;
}

export function MustyAvatar({ size, ring = false, placeholder }: MustyAvatarProps) {
  const inner = ring ? size - 12 : size;
  return (
    <View
      style={[
        styles.frame,
        { width: size, height: size, borderRadius: size / 2 },
        ring ? styles.ring : null,
      ]}
    >
      {MUSTY_SOURCE ? (
        <Image source={MUSTY_SOURCE} style={{ width: inner, height: inner }} resizeMode="contain" />
      ) : placeholder ? (
        <Text style={styles.placeholder}>{placeholder}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: colors.serenity,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ring: { borderWidth: 6, borderColor: colors.polyGreen },
  placeholder: { fontFamily: fonts.medium, fontSize: 13, color: colors.polyGreen },
});
