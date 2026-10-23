import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthButton } from '../../components/auth/AuthButton';
import { AuthError } from '../../components/auth/AuthError';
import { AuthField } from '../../components/auth/AuthField';
import { colors, typography, spacing, frostedCard } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import { AuthStackParamList } from '../../navigation/types';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'> };

export function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const handleSignUp = async () => {
    setLocalError('');
    clearError();
    if (!email.trim()) { setLocalError('Email is required'); return; }
    if (password.length < 8) { setLocalError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setLocalError('Passwords do not match'); return; }
    await signUp(email.trim().toLowerCase(), password);
    setEmailSent(true);
  };

  const displayError = localError || error;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.wordmark}>sensly</Text>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Your contributions are always anonymous to other users.</Text>
          </View>

          <View style={[frostedCard, styles.form]}>
            <AuthError message={displayError} />

            {emailSent && !error ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>✅ Check your email to confirm your account, then sign in.</Text>
                <AuthButton label="Go to sign in" onPress={() => navigation.navigate('SignIn')} />
              </View>
            ) : (
              <>
                <AuthField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com"
                  keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email"
                  returnKeyType="next" accessibilityLabel="Email address" />
                <AuthField label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters"
                  secureTextEntry autoComplete="new-password" returnKeyType="next" accessibilityLabel="Password" />
                <AuthField label="Confirm password" value={confirm} onChangeText={setConfirm} placeholder="Repeat your password"
                  secureTextEntry autoComplete="new-password" returnKeyType="done" onSubmitEditing={handleSignUp}
                  accessibilityLabel="Confirm password" />
                <AuthButton label="Create account" onPress={handleSignUp} disabled={!email || !password || !confirm} loading={isLoading} />
                <Text style={styles.privacyNote}>Your ratings and contributions are always anonymous. We never share your personal data.</Text>
              </>
            )}
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('SignIn')} accessibilityRole="button" style={styles.switchLink}>
            <Text style={styles.switchText}>Already have an account? <Text style={styles.switchTextBold}>Sign in</Text></Text>
          </TouchableOpacity>
        </ScrollView>
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
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.xs, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  form: { gap: spacing.md, padding: spacing.lg },
  successBox: { backgroundColor: '#E8F4FB', borderRadius: 8, padding: spacing.md, gap: spacing.md },
  successText: { ...typography.body, color: colors.textPrimary, lineHeight: 22 },
  privacyNote: { ...typography.bodySm, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  switchLink: { alignItems: 'center', paddingVertical: spacing.xl },
  switchText: { ...typography.body, color: colors.textSecondary },
  switchTextBold: { color: colors.primary, fontWeight: '600' },
});
