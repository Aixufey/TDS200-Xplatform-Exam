import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeView } from './src/components';
import { useCustomFonts } from './src/hooks';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [appIsReady, setAppIsReady] = useState<boolean>(false);
    const fontsLoaded = useCustomFonts();

    useEffect(() => {
        try {
            if (fontsLoaded) {
                setTimeout(() => {
                    setAppIsReady(true);
                }, 2000);
            }
        } catch (e) {
            console.warn(e);
        }

        return console.log('App ready', appIsReady);
        // splash screen is dependent on fonts to be loaded, reconcile the dependencies.
    }, [fontsLoaded]);

    const onLayoutRootView = useCallback(async () => {
        // useCallback hook execute an async anonymous function to remove the splash screen.
        // The 'callBacker' is the anonymous async storing the promise and ready to use it when the app is ready.
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
            <SafeView onLayout={onLayoutRootView} className="justify-center items-center border-2">
                <View className="bg-[#000] w-full h-full justify-center items-center">
                    <StatusBar style="auto" hidden />
                    <Text className="text-[#ff00AA] border-2 border-[#123] self-center font-handjet-regular">
                        Open up App.tsx to start working on your app!
                    </Text>
                </View>
            </SafeView>
        </SafeAreaProvider>
    );
}
