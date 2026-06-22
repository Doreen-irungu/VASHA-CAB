/**
 * Root Stack Navigator
 * Splash → Auth → Main (Tabs) → VehicleSelection → LiveTracking → RideComplete
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utilities/types';
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import VehicleSelectionScreen from '../screens/VehicleSelectionScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="VehicleSelection"
          component={VehicleSelectionScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="LiveTracking"
          component={LiveTrackingScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
