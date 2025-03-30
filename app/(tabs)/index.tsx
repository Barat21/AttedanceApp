import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useFonts, Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { SplashScreen } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import PunchButton from '../../components/PunchButton';
import TimeDisplay from '../../components/TimeDisplay';
import { useAuthStore } from '../../store/authStore';
import { useTimeStore } from '../../store/timeStore';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function TabOneScreen() {
  const user = useAuthStore((state) => state.user);
  const checkStatus = useTimeStore((state) => state.checkStatus);
  const [fontsLoaded, fontError] = useFonts({
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Bold': Outfit_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (user) {
      checkStatus().catch(console.error);
    }
  }, [user]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.Text 
        entering={SlideInUp.springify().delay(200)}
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
    fontFamily: 'Outfit-Bold',
    position: 'absolute',
    top: 48,
  },
});