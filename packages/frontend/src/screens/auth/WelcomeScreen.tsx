import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../../constants/theme';
import { AuthStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Musty&apos;s Map</Text>
        <Text style={styles.tagline}>
          See how busy campus is before you walk over — and find the free food.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('SignUp')}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SignIn')}
          accessibilityRole="button"
        >
          <Text style={styles.secondaryButtonText}>I already have one</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  hero: { flex: 1, justifyContent: 'center', gap: spacing.md },
  title: { ...typography.heading1, fontSize: 36, lineHeight: 44, color: colors.primary },
  tagline: { ...typography.bodyLg, color: colors.textSecondary },
  actions: { gap: spacing.sm, paddingBottom: spacing.xl },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { ...typography.label, color: colors.textInverse, fontSize: 16 },
  secondaryButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { ...typography.label, color: colors.primary, fontSize: 16 },
});
