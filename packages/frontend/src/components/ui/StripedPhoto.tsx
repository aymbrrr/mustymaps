import React, { useId } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';
import { colors } from '../../theme/tokens';
import { Text } from './Text';

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

interface StripedPhotoProps {
  /** Perpendicular width of one stripe; the design uses 12 / 10 / 9 by surface. */
  stripe?: number;
  label?: string;
  labelSize?: number;
  /** Hero photos put the label on a translucent plate. */
  plate?: boolean;
  /** Override the two stripe fills; defaults to the serenity pair. */
  stripeColors?: [string, string];
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Stand-in for a spot photo: diagonal serenity stripes with a monospace caption.
 * Swap for a real <Image> once photos are supplied.
 */
export function StripedPhoto({
  stripe = 12,
  label,
  labelSize = 10,
  plate = false,
  stripeColors = [colors.serenity, colors.serenityStripe],
  style,
  children,
}: StripedPhotoProps) {
  // useId() contains colons, which are not valid in an SVG url(#...) reference.
  const patternId = `stripes${useId().replace(/\W/g, '')}`;
  return (
    <View style={[styles.container, style]}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern
            id={patternId}
            width={stripe * 2}
            height={stripe * 2}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <Rect x={0} y={0} width={stripe} height={stripe * 2} fill={stripeColors[0]} />
            <Rect x={stripe} y={0} width={stripe} height={stripe * 2} fill={stripeColors[1]} />
          </Pattern>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${patternId})`} />
      </Svg>
      {label ? (
        <Text style={[styles.label, plate ? styles.plate : null, { fontFamily: MONO, fontSize: labelSize }]}>
          {label}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  label: { color: colors.polyGreen },
  plate: {
    backgroundColor: 'rgba(250,249,246,0.75)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
