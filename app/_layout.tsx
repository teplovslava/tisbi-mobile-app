import LanguageContext from '@/context/LanguageContext';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import store from '../store/index'
import { Provider } from 'react-redux'
import { Provider as AuthProvider } from '@/context/Auth';
import { View } from 'react-native';


export {
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'GilroyBold': require('../assets/fonts/Gilroy-Black.ttf'),
    'GilroyRegular': require('../assets/fonts/Gilroy-Regular.ttf'),
    'GilroyThin': require('../assets/fonts/Gilroy-Thin.ttf'),
  });

 

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <View style={{flex:1, backgroundColor:'#000'}}>
      <AuthProvider>
      <Provider store={store}>
        <LanguageContext>
          <Stack screenOptions={{headerShown:false}} />
        </LanguageContext>
      </Provider>
    </AuthProvider>
    </View>
  );
}
