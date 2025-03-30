import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

function TabBarIcon({ Icon, focused }: { Icon: any, focused: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(focused ? 1.2 : 1) },
    ],
    opacity: withTiming(focused ? 1 : 0.5),
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon size={24} color={focused ? '#00ff87' : '#888'} />
    </Animated.View>
  );
}

export default function TabLayout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <Pressable
        onPress={handleLogout}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          backgroundColor: 'rgba(26, 26, 26, 0.98)',
          borderTopColor: '#333',
          borderTopWidth: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <TabBarIcon Icon={LogOut} focused={true} />
        <Text style={{
          color: '#00ff87',
          fontSize: 16,
          fontFamily: 'Outfit-Bold',
        }}>
          Logout
        </Text>
      </Pressable>
    </View>
  );
}