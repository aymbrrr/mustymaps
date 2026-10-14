import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { EyeIcon, EyeOffIcon } from '../../components/Icons';
import { useToast } from '../../components/ToastHost';
import { PrimaryButton } from '../../components/ui/Buttons';
import { Field } from '../../components/ui/Inputs';
import { Text } from '../../components/ui/Text';
import { AuthStackParamList } from '../../navigation/types';
import { useSessionStore } from '../../stores/sessionStore';
import { colors, fonts, type } from '../../theme/tokens';
import { BackChevron, INVALID_EMAIL_MESSAGE, isCalPolyEmail } from './authShared';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const toast = useToast();
  const signIn = useSessionStore((state) => state.signIn);
  const requestPasswordReset = useSessionStore((state) => state.requestPasswordReset);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const emailOk = isCalPolyEmail(email);

  const onSignIn = async () => {
    if (!emailOk) {
      setEmailError(true);
      return;
    }
    const failure = await signIn(email, password);
    toast(failure ?? 'welcome back.');
  };

  const onForgot = async () => {
    if (!emailOk) {
      toast('enter your email first');
      return;
    }
    await requestPasswordReset(email);
    toast(`reset link sent to ${email.trim()}`);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <BackChevron onPress={() => navigation.goBack()} />

      <Text style={[type.sectionLabel, styles.eyebrow]}>welcome back</Text>
      <Text style={styles.title}>
        sign in<Text style={styles.period}>.</Text>
      </Text>

      <Field
        label="email"
        containerStyle={styles.emailField}
        value={email}
        onChangeText={(next) => {
          setEmail(next);
          setEmailError(false);
        }}
        placeholder="you@calpoly.edu"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        error={emailError ? INVALID_EMAIL_MESSAGE : null}
      />

      <Field
        label="password"
        containerStyle={styles.passwordField}
        value={password}
        onChangeText={setPassword}
        placeholder="your password"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        textContentType="password"
        accessory={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'hide password' : 'show password'}
            onPress={() => setShowPassword((visible) => !visible)}
            hitSlop={8}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </Pressable>
        }
      />

      <Text accessibilityRole="button" style={styles.forgot} onPress={onForgot}>
        forgot password?
      </Text>

      <PrimaryButton
        label="sign in →"
        onPress={onSignIn}
        disabled={!emailOk || password.length === 0}
        style={styles.submit}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          new here?{' '}
          <Text style={styles.footerLink} onPress={() => navigation.replace('SignUp')}>
            sign up →
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  content: { paddingTop: 60, paddingHorizontal: 28, paddingBottom: 40 },
  eyebrow: { marginTop: 38 },
  title: { ...type.authTitle, marginTop: 12 },
  period: { color: colors.serenityDeep },
  emailField: { marginTop: 40 },
  passwordField: { marginTop: 24 },
  forgot: { alignSelf: 'flex-end', marginTop: 14, fontFamily: fonts.medium, fontSize: 15 },
  submit: { marginTop: 26 },
  footer: { marginTop: 20, alignItems: 'center' },
  footerText: { fontSize: 15, color: colors.sealGrey },
  footerLink: { fontFamily: fonts.semibold, color: colors.polyGreen },
});
