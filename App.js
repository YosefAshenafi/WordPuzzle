import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { RootNavigator } from './src/navigation/RootNavigator';
import { CustomSplashScreen } from './src/components/CustomSplashScreen';
import { initAudio } from './src/utils/audio';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize audio
        await initAudio();

        // You can add other initialization here
        // For example, loading fonts, etc.
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const handleSplashAnimationComplete = async () => {
    setShowSplash(false);
  };

  if (showSplash || !appIsReady) {
    return <CustomSplashScreen onAnimationComplete={handleSplashAnimationComplete} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigator />
      <StatusBar barStyle="light-content" />
    </GestureHandlerRootView>
  );
}
