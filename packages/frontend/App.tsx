/**
 * App entry point.
 *
 * configureBackend is the one place the app is bound to a data source. Today it
 * gets the in-memory scaffold; swapping in a Supabase or REST adapter that
 * implements `Backend` (src/domain/ports.ts) is a one-line change here.
 */
import { registerRootComponent } from 'expo';
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  useFonts,
} from '@expo-google-fonts/geist';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastHost } from './src/components/ToastHost';
import { configureBackend } from './src/data/backend';
import { createInMemoryBackend } from './src/data/InMemoryBackend';
import { RootNavigator } from './src/navigation/RootNavigator';

void SplashScreen.preventAutoHideAsync();

configureBackend(createInMemoryBackend());

function App() {
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });

  useEffect(() => {
    // Holding the splash until Geist is ready avoids a flash of system font.
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ToastHost>
          <RootNavigator />
        </ToastHost>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);
