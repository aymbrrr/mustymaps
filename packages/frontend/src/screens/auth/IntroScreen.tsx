import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { MustyAvatar } from '../../components/MustyAvatar';
import { useToast } from '../../components/ToastHost';
import { PrimaryButton } from '../../components/ui/Buttons';
import { Text } from '../../components/ui/Text';
import { colors, fonts, type } from '../../theme/tokens';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Intro'>;

export function IntroScreen({ navigation }: Props) {
  const toast = useToast();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>
          musty&apos;s map<Text style={styles.period}>.</Text>
        </Text>
        <Text style={styles.tagline}>
          rate where you eat, study &amp; lock in <Text style={styles.taglineAccent}>@ cal poly slo</Text>.
        </Text>
      </View>

      <View style={styles.mascot}>
        <MustyAvatar size={250} ring placeholder="drop musty here" />
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="get started" onPress={() => navigation.navigate('SignUp')} style={styles.cta} />
        <Text style={styles.signInLine}>
          already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('SignIn')}>
            sign in
          </Text>
        </Text>
        <Text style={styles.legal}>
          by continuing, you agree to the{' '}
          <Text style={styles.legalLink} onPress={() => toast('opens terms of service')}>
            terms of service
          </Text>{' '}
          and{' '}
          <Text style={styles.legalLink} onPress={() => toast('opens privacy policy')}>
            privacy policy
          </Text>
          .
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite, paddingTop: 72, paddingHorizontal: 28, paddingBottom: 40 },
  header: { gap: 12 },
  wordmark: { ...type.heroWordmark, color: colors.polyGreen },
  period: { color: colors.serenityDeep },
  tagline: { fontSize: 19, lineHeight: 25, maxWidth: 280 },
  taglineAccent: { fontFamily: fonts.semibold, color: colors.polyGreen },
  mascot: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  footer: { gap: 16, alignItems: 'center' },
  cta: { width: '100%' },
  signInLine: { fontSize: 15, color: colors.sealGrey },
  link: { fontFamily: fonts.semibold, color: colors.polyGreen },
  legal: { fontSize: 12, lineHeight: 17, color: colors.sealGrey, textAlign: 'center', maxWidth: 280 },
  legalLink: { color: colors.ink, textDecorationLine: 'underline' },
});
