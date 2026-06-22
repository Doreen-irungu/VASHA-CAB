/**
 * Vasha Cab – App Entry Point
 * Electric Vehicle Ride-Sharing Platform
 *
 * Tech: React Native · Expo · TypeScript · React Navigation
 */
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
