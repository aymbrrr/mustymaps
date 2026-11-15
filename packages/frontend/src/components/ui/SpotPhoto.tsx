import { Image } from 'expo-image';
import React, { useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme/tokens';
import { StripedPhoto } from './StripedPhoto';

interface SpotPhotoProps {
  /** Absolute URL, normally from spotPhotoUrl(). Falls back to stripes when absent. */
  uri?: string;
  /** Stripe width for the fallback; the design uses 12 / 10 / 9 by surface. */
  stripe?: number;
  /** Fallback caption. A real photo shows no caption. */
  label?: string;
  labelSize?: number;
  plate?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Overlays — back button, live pill, rank pill. Rendered above the photo. */
  children?: React.ReactNode;
}

/**
 * A spot's photo, with the striped placeholder as its fallback.
 *
 * memory-disk caching means a photo is fetched once per device and then served
 * locally, including across app launches.
 */
export function SpotPhoto({ uri, stripe, label, labelSize, plate, style, children }: SpotPhotoProps) {
  // A missing object in the bucket is a content mistake, not a user-facing
  // failure — show the placeholder rather than an empty rectangle.
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <StripedPhoto stripe={stripe} label={label} labelSize={labelSize} plate={plate} style={style}>
        {children}
      </StripedPhoto>
    );
  }
  return (
    <View style={[styles.container, style]}>
      <Image
        source={uri}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={200}
        accessible={false}
        onError={() => setFailed(true)}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // Shows through until the first paint, so a cold load does not flash white.
    backgroundColor: colors.serenity,
  },
});
