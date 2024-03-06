import { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import Navigation from "@navigation/Navigation";
import { store } from "@redux/store";

SplashScreen.preventAutoHideAsync(); // Show splash scren while fetching resources

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  // Load Inter font
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Light": require("@assets/fonts/Inter-Light.otf"),
    "Inter-Regular": require("@assets/fonts/Inter-Regular.otf"),
    "Inter-Bold": require("@assets/fonts/Inter-Bold.otf"),
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        const sleep = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        await sleep(5000); // TODO: Delete this; Sleep 5 seconds
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    };
    prepare();
  }, []);

  // Memoize asynchronous function for hiding splash screen
  const onLayoutRootView = useCallback(async () => {
    if (isAppReady || fontsLoaded || fontError) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isAppReady, fontsLoaded, fontError]);

  if (!isAppReady && !fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <Navigation />
        <StatusBar style="light" />
      </SafeAreaProvider>
    </Provider>
  );
}
