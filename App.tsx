
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeView } from './src/components';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  useEffect(() => {
    const prepare = async () => {
      try {

        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
    return console.log("App ready", appIsReady);
  }, [])

  const onLayoutRootView = useCallback(async () => {
    // Callback function execute an async anonymous function to remove the splash screen.
    // Storing the promise and ready to use it when the app is ready.
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // If the app is not ready, don't render anything.
  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeView
        onLayout={onLayoutRootView}
        className='justify-center items-center border-2'
      >
        <View className='bg-[#000] w-full h-full justify-center items-center'>
          <StatusBar style="auto" hidden />
          <Text className='text-[#ff00AA] border-2 border-[#123] self-center'>Open up App.tsx to start working on your app!</Text>
        </View>
      </SafeView>
    </SafeAreaProvider>
  );
}
