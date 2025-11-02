import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LevelSelectionScreen } from '../screens/LevelSelectionScreen';
import { GameScreen } from '../screens/GameScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { stopAllLevelSounds } from '../utils/audio';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: 'transparent' },
      }}
      listeners={{
        state: (e) => {
          // Stop all audio when navigating away from Game screen
          const routeName = e.data.state.routes[e.data.state.index]?.name;
          if (routeName !== 'Game') {
            stopAllLevelSounds().catch(error => {
              console.log('Error stopping sounds on navigation:', error);
            });
          }
        },
      }}
    >
      {!user ? (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ animationTypeForReplace: 'pop' }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ animationTypeForReplace: 'pop' }}
          />
          <Stack.Screen
            name="Levels"
            component={LevelSelectionScreen}
            options={{
              animationTypeForReplace: 'fade',
            }}
          />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{
              animationTypeForReplace: 'fade',
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              animationTypeForReplace: 'fade',
            }}
          />
          <Stack.Screen
            name="Leaderboard"
            component={LeaderboardScreen}
            options={{
              animationTypeForReplace: 'fade',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};
