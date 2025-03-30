import { StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { useTimeStore } from '../store/timeStore';

export default function TimeDisplay() {
  const { currentSession } = useTimeStore();

  const pulseAnim = useAnimatedStyle(() => ({
    transform: [
      { scale: withRepeat(
        withSequence(
          withSpring(1.05, { damping: 10 }),
          withSpring(1, { damping: 10 })
        ),
        -1,
        true
      ) }
    ],
    opacity: currentSession ? 1 : 0.5,
  }));

  return (
    <Animated.View 
      entering={SlideInDown.springify().delay(300)}
      style={styles.container}
    >
      <View style={styles.card}>
        <Animated.View style={[styles.timeContainer, pulseAnim]}>
          <Text style={styles.time}>
            {format(new Date(), 'HH:mm:ss')}
          </Text>
          <Text style={styles.date}>
            {format(new Date(), 'EEEE, MMMM d')}
          </Text>
        </Animated.View>
        <Animated.View 
          entering={FadeIn.delay(600)}
          style={styles.statusContainer}
        >
          <View style={[
            styles.statusDot,
            currentSession ? styles.statusActive : styles.statusInactive
          ]} />
          <Text style={styles.statusText}>
            {currentSession ? 'Active Session' : 'No Active Session'}
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    minWidth: 300,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#00ff87',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Outfit-Bold',
    letterSpacing: 2,
  },
  date: {
    fontSize: 18,
    color: '#888',
    marginTop: 8,
    fontFamily: 'Outfit-Regular',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#00ff87',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusActive: {
    backgroundColor: '#00ff87',
    shadowColor: '#00ff87',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  statusInactive: {
    backgroundColor: '#888',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
  },
});