import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthButton } from '../../components/auth/AuthButton';
import { AuthError } from '../../components/auth/AuthError';
import { AuthField } from '../../components/auth/AuthField';
import { colors, typography, spacing, frostedCard } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import { AuthStackParamList } from '../../navigation/types';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn'> };

export function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading, error, clearError } = useAuthStore();

  const handleSignIn = async () => {
    if (!email.trim() || !password) return;
    clearError();
    await signIn(email.trim().toLowerCase(), password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.wordmark}>sensly</Text>
          <Text style={styles.title}>Welcome back</Text>
        </View>

        <View style={[frostedCard, styles.form]}>
          <AuthError message={error} />
          <AuthField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com"
            keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email"
            returnKeyType="next" accessibilityLabel="Email address" />
          <AuthField label="Password" value={password} onChangeText={setPassword} placeholder="Your password"
            secureTextEntry autoComplete="current-password" returnKeyType="done" onSubmitEditing={handleSignIn}
            accessibilityLabel="Password" />
          <AuthButton label="Sign in" onPress={handleSignIn} disabled={!email || !password} loading={isLoading} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} accessibilityRole="button" style={styles.switchLink}>
          <Text style={styles.switchText}>Don&apos;t have an account? <Text style={styles.switchTextBold}>Create one</Text></Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DFF6F7' },
  inner: { flex: 1, paddingHorizontal: spacing.xl },
  header: { paddingTop: spacing.lg, marginBottom: spacing.xl },
  backButton: { marginBottom: spacing.md },
  backText: { ...typography.body, color: colors.primary },
  wordmark: { fontSize: 36, fontWeight: '800', color: colors.primary, letterSpacing: -1, textAlign: 'center', marginBottom: spacing.sm },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  form: { gap: spacing.md, padding: spacing.lg },
  switchLink: { alignItems: 'center', paddingVertical: spacing.xl },
  switchText: { ...typography.body, color: colors.textSecondary },
  switchTextBold: { color: colors.primary, fontWeight: '600' },
});
