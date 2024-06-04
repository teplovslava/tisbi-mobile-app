import { WebsocketProvider } from '@/context/WebSocketContext';
import { useAppSelector } from '@/store/hooks';
import { TabBar } from '@/ui/customTabBar';
import { FontAwesome } from '@expo/vector-icons';
import { Tabs, usePathname, useSegments } from 'expo-router';
import { useSelector } from 'react-redux';

export default function TabLayout() {

  const {token} = useAppSelector((state) => state.user);
   
  

  return (
    <WebsocketProvider token={token}>
      <Tabs screenOptions={{ 
        headerShown: false,
        }}

        tabBar={(props) => <TabBar {...props} icons={['calendar', 'comments', 'gear']} />}>
        <Tabs.Screen
          name="(main)"
          options={{
            title: 'Schedule',
          }}
        />
        <Tabs.Screen
          name="(chat)"
          options={{
            title: 'Forum',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
          }}
        />
      </Tabs>
    </WebsocketProvider>
  );
}