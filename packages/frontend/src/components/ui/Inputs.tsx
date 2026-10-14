import React, { ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors, fonts, radius, type } from '../../theme/tokens';
import { Text } from './Text';

interface FieldProps extends TextInputProps {
  label?: string;
  /** Red border + message under the field. */
  error?: string | null;
  /** Eye toggle or similar, pinned to the right edge. */
  accessory?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Field({ label, error, accessory, containerStyle, style, ...rest }: FieldProps) {
  return (
    <View style={containerStyle}>
      {label ? <Text style={[type.sectionLabel, styles.fieldLabel]}>{label}</Text> : null}
      <View style={styles.inputWrap}>
        <TextInput
          {...rest}
          placeholderTextColor={colors.sealGrey}
          style={[
            styles.input,
            { borderColor: error ? colors.danger : colors.inputBorder },
            accessory ? styles.inputWithAccessory : null,
            style,
          ]}
        />
        {accessory ? <View style={styles.accessory}>{accessory}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

/** Multi-line input: review text, profile bio. */
export function TextArea({ style, ...rest }: TextInputProps) {
  return (
    <TextInput
      {...rest}
      multiline
      textAlignVertical="top"
      placeholderTextColor={colors.sealGrey}
      style={[styles.textArea, style]}
    />
  );
}

/** iOS-style 51×31 switch; the knob slides 20pt. */
export function Toggle({
  value,
  onToggle,
  disabled,
}: {
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      onPress={disabled ? undefined : onToggle}
      style={[styles.track, { backgroundColor: value ? colors.polyGreen : colors.toggleOff }]}
    >
      <View style={[styles.knob, { transform: [{ translateX: value ? 20 : 0 }] }]} />
    </Pressable>
  );
}

/** 24pt rounded checkbox; checked fills green with a tick. */
export function Checkbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={[
        styles.checkbox,
        {
          backgroundColor: checked ? colors.polyGreen : colors.card,
          borderColor: checked ? colors.polyGreen : colors.checkboxBorder,
        },
      ]}
    >
      {checked ? <Text style={styles.checkmark}>✓</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fieldLabel: { marginBottom: 10 },
  inputWrap: { position: 'relative', justifyContent: 'center' },
  input: {
    height: 56,
    borderRadius: radius.input,
    borderWidth: 1,
    backgroundColor: colors.card,
    paddingHorizontal: 18,
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.ink,
  },
  inputWithAccessory: { paddingRight: 54 },
  accessory: { position: 'absolute', right: 14, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  error: { fontSize: 13, color: colors.danger, marginTop: 8 },
  textArea: {
    minHeight: 108,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.card,
    padding: 16,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 23,
    color: colors.ink,
  },
  track: { width: 51, height: 31, borderRadius: 16, justifyContent: 'center', paddingHorizontal: 2 },
  knob: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: colors.card,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 2.5,
    elevation: 2,
  },
  checkbox: { width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  checkmark: { fontFamily: fonts.bold, fontSize: 14, color: colors.offWhite },
});
