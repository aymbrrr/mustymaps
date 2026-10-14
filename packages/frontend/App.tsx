/**
 * App entry point.
 *
 * configureBackend is the one place the app is bound to a data source. See
 * src/data/createBackend.ts for which slots are live and which are still the
 * in-memory scaffold.
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
import { createBackend } from './src/data/createBackend';
import { RootNavigator } from './src/navigation/RootNavigator';

void SplashScreen.preventAutoHideAsync();

configureBackend(createBackend());

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
