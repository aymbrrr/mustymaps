import React, { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import {
  colors,
  DISABLED_OPACITY,
  PRESS_SCALE_CARD,
  radius,
  shadows,
  type,
} from '../../theme/tokens';
import { Text } from './Text';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/** h56 pill, green fill. Disabled stays visible at 35%. */
export function PrimaryButton({ label, onPress, disabled, height = 56, style }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      onPress={disabled ? undefined : onPress}
      style={[styles.primary, { height, opacity: disabled ? DISABLED_OPACITY : 1 }, style]}
    >
      <Text style={[type.button, styles.primaryLabel, height <= 54 ? type.buttonSm : null]}>{label}</Text>
    </Pressable>
  );
}

/** Pill with an outline and no fill. */
export function SecondaryButton({ label, onPress, disabled, height = 54, style }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      onPress={disabled ? undefined : onPress}
      style={[styles.secondary, { height, opacity: disabled ? DISABLED_OPACITY : 1 }, style]}
    >
      <Text style={[type.buttonSm, styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

export function DangerButton({ label, onPress, height = 50, style }: ButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.danger, { height }, style]}>
      <Text style={[type.buttonSm, styles.dangerLabel]}>{label}</Text>
    </Pressable>
  );
}

interface CircleButtonProps {
  size: number;
  onPress: () => void;
  children: ReactNode;
  background?: string;
  shadow?: 'none' | 'soft' | 'card';
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
}

/** The round back / share / close / recenter controls. */
export function CircleButton({
  size,
  onPress,
  children,
  background = colors.card,
  shadow = 'none',
  style,
  accessibilityLabel,
}: CircleButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: background },
        shadow === 'soft' ? shadows.circleButton : null,
        shadow === 'card' ? shadows.headerCard : null,
        pressed ? { opacity: 0.7 } : null,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

/** Cards and rows compress to .985 while held. */
export function PressableCard({
  onPress,
  children,
  style,
  scale = PRESS_SCALE_CARD,
  accessibilityLabel,
}: {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scale?: number;
  accessibilityLabel?: string;
}) {
  if (!onPress) return <View style={style}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [style, pressed ? { transform: [{ scale }] } : null]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    borderRadius: radius.pill,
    backgroundColor: colors.polyGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: { color: colors.offWhite },
  secondary: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.outlineButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: { color: colors.ink },
  danger: {
    borderRadius: radius.pill,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerLabel: { color: colors.card },
  circle: { alignItems: 'center', justifyContent: 'center' },
});
