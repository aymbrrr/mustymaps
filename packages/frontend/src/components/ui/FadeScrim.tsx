import React, { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../../theme/tokens';

/**
 * Transparent-to-background fade behind sticky footers, so content scrolling
 * underneath dissolves instead of clipping.
 */
export function FadeScrim() {
  // useId() contains colons, which are not valid in an SVG url(#...) reference.
  const gradientId = `fade${useId().replace(/\W/g, '')}`;
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.offWhite} stopOpacity={0} />
          <Stop offset="0.3" stopColor={colors.offWhite} stopOpacity={1} />
          <Stop offset="1" stopColor={colors.offWhite} stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
  );
}
