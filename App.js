import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { RootNavigator } from './src/navigation/RootNavigator';
import { CustomSplashScreen } from './src/components/CustomSplashScreen';
import { initAudio, stopAllLevelSounds } from './src/utils/audio';
import { AppState } from 'react-native';

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

  // Handle app state changes to stop audio when app goes to background
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        // Stop all audio when app goes to background
        stopAllLevelSounds().catch(error => {
          console.log('Error stopping sounds on app background:', error);
        });
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
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
