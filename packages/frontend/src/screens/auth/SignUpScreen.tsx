import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { EyeIcon, EyeOffIcon } from '../../components/Icons';
import { useToast } from '../../components/ToastHost';
import { PrimaryButton } from '../../components/ui/Buttons';
import { Checkbox, Field } from '../../components/ui/Inputs';
import { Text } from '../../components/ui/Text';
import { AuthStackParamList } from '../../navigation/types';
import { useSessionStore } from '../../stores/sessionStore';
import { colors, fonts, radius, type } from '../../theme/tokens';
import { BackChevron, INVALID_EMAIL_MESSAGE, isCalPolyEmail } from './authShared';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const MIN_PASSWORD_LENGTH = 8;
const CODE_LENGTH = 6;

export function SignUpScreen({ navigation }: Props) {
  const toast = useToast();
  const status = useSessionStore((state) => state.status);
  const pendingEmail = useSessionStore((state) => state.pendingEmail);
  const signUp = useSessionStore((state) => state.signUp);
  const verifyCode = useSessionStore((state) => state.verifyCode);
  const resendCode = useSessionStore((state) => state.resendCode);
  const editEmail = useSessionStore((state) => state.editEmail);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [code, setCode] = useState('');

  const awaitingCode = status === 'awaitingCode';
  const emailOk = isCalPolyEmail(email);
  const passwordsMatch = confirm.length > 0 && confirm !== password;
  const canCreate =
    emailOk && password.length >= MIN_PASSWORD_LENGTH && password === confirm && agreed;

  const onCreate = async () => {
    if (!emailOk) {
      setEmailError(true);
      return;
    }
    const failure = await signUp(email, password);
    if (failure) toast(failure);
  };

  const onVerify = async () => {
    const failure = await verifyCode(code);
    toast(failure ?? 'you’re in. welcome to musty’s map.');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <BackChevron onPress={() => (awaitingCode ? editEmail() : navigation.goBack())} />

      {awaitingCode ? (
        <View>
          <Text style={[type.sectionLabel, styles.eyebrow]}>almost there</Text>
          <Text style={styles.title}>
            check your inbox<Text style={styles.period}>.</Text>
          </Text>
          <Text style={styles.sub}>
            6-digit code sent to <Text style={styles.subStrong}>{pendingEmail}</Text>
          </Text>

          <Field
            containerStyle={styles.codeField}
            style={styles.codeInput}
            value={code}
            onChangeText={(next) => setCode(next.replace(/\D/g, '').slice(0, CODE_LENGTH))}
            placeholder="••••••"
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            maxLength={CODE_LENGTH}
          />

          <PrimaryButton
            label="let's go →"
            onPress={onVerify}
            disabled={code.length !== CODE_LENGTH}
            style={styles.verifyButton}
          />

          <View style={styles.codeLinks}>
            <Text
              accessibilityRole="button"
              style={styles.wrongEmail}
              onPress={() => {
                setCode('');
                editEmail();
              }}
            >
              ← wrong email
            </Text>
            <Text
              accessibilityRole="button"
              style={styles.resend}
              onPress={async () => {
                await resendCode();
                toast('new code sent');
              }}
            >
              resend code
            </Text>
          </View>
        </View>
      ) : (
        <View>
          <Text style={[type.sectionLabel, styles.formEyebrow]}>sign up</Text>
          <Text style={styles.signUpTitle}>
            what&apos;s your <Text style={styles.accent}>.edu</Text> email?
          </Text>
          <Text style={styles.sub}>we only use it to verify you&apos;re a student.</Text>

          <Field
            label="school email"
            containerStyle={styles.schoolEmailField}
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
            containerStyle={styles.stackedField}
            value={password}
            onChangeText={setPassword}
            placeholder="8+ characters"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            textContentType="newPassword"
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

          <Field
            label="confirm password"
            containerStyle={styles.stackedField}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="same as above"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            textContentType="newPassword"
            error={passwordsMatch ? 'passwords don’t match.' : null}
          />

          <View style={styles.agreeRow}>
            <Checkbox checked={agreed} onToggle={() => setAgreed((value) => !value)} />
            <Text style={styles.agreeText}>
              i agree to the{' '}
              <Text style={styles.legalLink} onPress={() => toast('opens terms of service')}>
                terms of service
              </Text>
              ,{' '}
              <Text style={styles.legalLink} onPress={() => toast('opens privacy policy')}>
                privacy policy
              </Text>
              , and{' '}
              <Text style={styles.legalLink} onPress={() => toast('opens community guidelines')}>
                community guidelines
              </Text>
              .
            </Text>
          </View>

          <PrimaryButton
            label="create account →"
            onPress={onCreate}
            disabled={!canCreate}
            style={styles.createButton}
          />

          <Text style={styles.footerText}>
            have an account?{' '}
            <Text style={styles.footerLink} onPress={() => navigation.replace('SignIn')}>
              sign in
            </Text>
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  content: { paddingTop: 60, paddingHorizontal: 28, paddingBottom: 40 },
  eyebrow: { marginTop: 30 },
  formEyebrow: { marginTop: 30 },
  title: { ...type.signUpTitle, marginTop: 12 },
  signUpTitle: { ...type.signUpTitle, marginTop: 12 },
  period: { color: colors.serenityDeep },
  accent: { color: colors.polyGreen },
  sub: { fontSize: 15, color: colors.sealGrey, marginTop: 12 },
  subStrong: { fontFamily: fonts.medium, color: colors.ink },
  schoolEmailField: { marginTop: 28 },
  stackedField: { marginTop: 20 },
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 22 },
  agreeText: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.sealGrey },
  legalLink: { color: colors.ink, textDecorationLine: 'underline' },
  createButton: { marginTop: 24 },
  footerText: { textAlign: 'center', fontSize: 15, color: colors.sealGrey, marginTop: 18 },
  footerLink: { fontFamily: fonts.semibold, color: colors.polyGreen },
  codeField: { marginTop: 28 },
  codeInput: {
    height: 64,
    borderRadius: radius.input,
    fontFamily: fonts.medium,
    fontSize: 28,
    letterSpacing: 14,
    textAlign: 'center',
  },
  verifyButton: { marginTop: 22 },
  codeLinks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  wrongEmail: { fontSize: 14, color: colors.sealGrey },
  resend: { fontFamily: fonts.semibold, fontSize: 14, color: colors.polyGreen },
});
