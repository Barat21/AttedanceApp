import { useCallback, useState } from 'react';
import { StyleSheet, Pressable, View, Text, ActivityIndicator } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
  SlideInUp,
  FadeIn,
} from 'react-native-reanimated';
import { useTimeStore } from '../store/timeStore';

export default function PunchButton() {
  const { currentSession, punchIn, punchOut } = useTimeStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scale = useSharedValue(1);
  const rotation = useSharedValue('0deg');
  const glow = useSharedValue(0);

  const handlePress = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      scale.value = withSequence(
        withSpring(0.9, { damping: 10 }),
        withSpring(1.1, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
      
      rotation.value = withSequence(
        withTiming('-15deg', { duration: 150 }),
        withTiming('15deg', { duration: 150 }),
        withTiming('0deg', { duration: 150 })
      );

      glow.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 1000 })
      );

      if (currentSession) {
        await punchOut();
      } else {
        await punchIn();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [currentSession, punchIn, punchOut]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: rotation.value }
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: withSpring(glow.value ? 1.2 : 1, { damping: 12 }) }],
  }));

  return (
    <Animated.View 
      entering={SlideInUp.springify().delay(400)}
      style={styles.container}
    >
      <Animated.View style={[styles.glowEffect, glowStyle]} />
      <Animated.View 
        entering={FadeIn.delay(600)}
        style={styles.tooltipContainer}
      >
        {error ? (
          <Text style={[styles.tooltip, styles.error]}>{error}</Text>
        ) : (
          <Text style={styles.tooltip}>
            {currentSession ? 'Tap to punch out' : 'Tap to punch in'}
          </Text>
        )}
      </Animated.View>
      <Pressable onPress={handlePress} disabled={loading}>
        <Animated.View style={[
          styles.button,
          buttonStyle,
          currentSession ? styles.active : styles.inactive,
          loading && styles.buttonDisabled
        ]}>
          <View style={styles.buttonInner}>
            {loading ? (
              <ActivityIndicator color={currentSession ? '#fff' : '#000'} />
            ) : (
              <Text style={[
                styles.buttonText,
                currentSession ? styles.activeText : styles.inactiveText
              ]}>
                {currentSession ? 'OUT' : 'IN'}
              </Text>
            )}
          </View>
        </Animated.View>
      </Pressable>
      <Animated.Text 
        entering={FadeIn.delay(800)}
        style={styles.status}
      >
        {currentSession ? 'Currently Working' : 'Not Clocked In'}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  active: {
    backgroundColor: '#ff4444',
    shadowColor: '#ff4444',
  },
  inactive: {
    backgroundColor: '#00ff87',
    shadowColor: '#00ff87',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    letterSpacing: 2,
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: '#000',
  },
  glowEffect: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#00ff87',
    opacity: 0,
    shadowColor: '#00ff87',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  tooltipContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tooltip: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
  },
  error: {
    color: '#ff4444',
  },
  status: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
    fontFamily: 'Outfit-Regular',
  },
});