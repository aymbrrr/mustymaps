import React from 'react';
import { Pressable, StyleSheet, TextStyle, View } from 'react-native';
import { colors, fonts, PRESS_SCALE_CONTROL } from '../../theme/tokens';
import { Text } from './Text';

const STAR = '★';
/** The inline star glyph is rendered smaller than the number beside it. */
const INLINE_STAR_RATIO = 0.72;

interface StarNumberProps {
  value: number | string;
  size: number;
  color?: string;
  family?: string;
  letterSpacing?: number;
  /** Rendered after the number, e.g. " · 37 check-ins this hr". */
  suffix?: string;
  prefix?: string;
  style?: TextStyle;
}

/** "★ 4.6" — the star never wraps away from its number. */
export function StarNumber({
  value,
  size,
  color = colors.ink,
  family = fonts.semibold,
  letterSpacing,
  prefix,
  suffix,
  style,
}: StarNumberProps) {
  return (
    <Text
      numberOfLines={1}
      style={[{ fontFamily: family, fontSize: size, color, letterSpacing }, style]}
    >
      {prefix}
      <Text style={{ fontFamily: family, fontSize: size * INLINE_STAR_RATIO, color }}>{STAR}</Text>
      {` ${value}`}
      {suffix}
    </Text>
  );
}

/** Non-interactive star row; `size` is the glyph size. */
export function StarRow({ value, size, gap = 2 }: { value: number; size: number; gap?: number }) {
  return (
    <View style={[styles.row, { gap }]}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Text key={n} style={{ fontSize: size, color: n <= value ? colors.polyGreen : colors.starEmpty }}>
          {STAR}
        </Text>
      ))}
    </View>
  );
}

interface StarPickerProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  gap?: number;
  spread?: boolean;
}

export function StarPicker({ value, onChange, size = 24, gap = 6, spread = false }: StarPickerProps) {
  return (
    <View style={[styles.row, spread ? styles.spread : null, spread ? null : { gap }]}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable
          key={n}
          accessibilityRole="button"
          accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`}
          onPress={() => onChange(n)}
          style={({ pressed }) => [pressed ? { transform: [{ scale: PRESS_SCALE_CONTROL }] } : null]}
          hitSlop={8}
        >
          <Text style={{ fontSize: size, lineHeight: size, color: n <= value ? colors.polyGreen : colors.starEmpty }}>
            {STAR}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  spread: { flex: 1, justifyContent: 'space-between' },
});
