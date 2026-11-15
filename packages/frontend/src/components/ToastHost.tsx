/**
 * App-wide toast. Toasts replace each other rather than stacking, matching the
 * prototype where a new message resets the 2.2s timer.
 */
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts, radius, shadows, TOAST_DURATION_MS } from '../theme/tokens';
import { Text } from './ui/Text';

const ToastContext = createContext<(message: string) => void>(() => {});

export function useToast(): (message: string) => void {
  return useContext(ToastContext);
}

export function ToastHost({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((next: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(next);
    timer.current = setTimeout(() => setMessage(null), TOAST_DURATION_MS);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message ? (
        <View style={styles.host} pointerEvents="none">
          <View style={[styles.toast, shadows.toast]}>
            <Text style={styles.label}>{message}</Text>
          </View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', top: 60, left: 0, right: 0, alignItems: 'center' },
  toast: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
  },
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.offWhite },
});
