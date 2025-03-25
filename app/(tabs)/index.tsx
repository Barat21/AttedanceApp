import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import PunchButton from '../../components/PunchButton';
import TimeDisplay from '../../components/TimeDisplay';
import { useAuthStore } from '../../store/authStore';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function TabOneScreen() {
  const user = useAuthStore((state) => state.user);
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.Text 
        entering={FadeIn.delay(200)}
        style={styles.greeting}
      >
        Welcome, {user?.name}!
      </Animated.Text>
      <TimeDisplay />
      <PunchButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  greeting: {
    fontSize: 24,
    color: '#00ff87',
    marginBottom: 32,
    fontFamily: 'Inter-Bold',
    position: 'absolute',
    top: 48,
  },
});