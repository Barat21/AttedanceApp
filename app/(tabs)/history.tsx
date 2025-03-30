import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { format, formatDistanceStrict } from 'date-fns';
import { useTimeStore } from '../../store/timeStore';
import { ChevronRight } from 'lucide-react-native';
import Animated, { 
  FadeInDown,
  SlideInLeft,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export default function HistoryScreen() {
  const { history } = useTimeStore();

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(0, { damping: 15 }) }],
    opacity: withSpring(1),
  }));

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[styles.header, headerStyle]}
        entering={SlideInLeft.springify()}
      >
        <Text style={styles.title}>Time History</Text>
        <Text style={styles.subtitle}>Your recent work sessions</Text>
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {history.length === 0 ? (
          <Animated.View 
            entering={FadeInDown.springify()}
            style={styles.emptyState}
          >
            <Text style={styles.emptyTitle}>No History Yet</Text>
            <Text style={styles.emptyText}>
              Your work sessions will appear here once you start tracking time.
            </Text>
          </Animated.View>
        ) : (
          history.map((entry, index) => (
            <Animated.View
              key={entry.id}
              entering={FadeInDown.springify().delay(index * 100)}
              style={styles.entry}
            >
              <View style={styles.dateContainer}>
                <View>
                  <Text style={styles.date}>
                    {format(entry.punchIn, 'MMM d, yyyy')}
                  </Text>
                  <Text style={styles.duration}>
                    {entry.punchOut
                      ? formatDistanceStrict(entry.punchOut, entry.punchIn)
                      : 'In progress'}
                  </Text>
                </View>
                <ChevronRight size={20} color="#666" />
              </View>
              <View style={styles.timeContainer}>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>Start</Text>
                  <Text style={styles.time}>
                    {format(entry.punchIn, 'HH:mm')}
                  </Text>
                </View>
                <View style={styles.timeSeparator} />
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>End</Text>
                  <Text style={styles.time}>
                    {entry.punchOut
                      ? format(entry.punchOut, 'HH:mm')
                      : '--:--'}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Outfit-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
    fontFamily: 'Outfit-Regular',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  entry: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#00ff87',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  date: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
  },
  duration: {
    color: '#00ff87',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Outfit-Regular',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Outfit-Regular',
  },
  time: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
  },
  timeSeparator: {
    width: 1,
    height: 30,
    backgroundColor: '#444',
    marginHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Outfit-Bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontFamily: 'Outfit-Regular',
  },
});