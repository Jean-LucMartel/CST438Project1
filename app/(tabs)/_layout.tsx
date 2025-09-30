import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from "../../auth/AuthProvider"; // 👈 import AuthProvider hook
import { FavoritesProvider } from "../favorites/FavoritesProvider";

export default function TabLayout() {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <FavoritesProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#fa5c5c"
          }}
        >

          <Tabs.Screen 
            name="index" 
            options={{ 
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
              )
            }} 
          />

          <Tabs.Screen name="rank" options={{ href: null }} />

          <Tabs.Screen 
            name="favorites" 
            options={{ 
              title: 'Favorites',
              tabBarIcon: ({color, focused}) => (
                <Ionicons name={focused ? 'star-sharp' : 'star-outline'} color={color} size={24} />
              )
            }} 
          />

          <Tabs.Screen
            name="savedrankings"
            options={{
              title: "Saved Rankings",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="teams"
            options={{
              title: 'Teams',
              tabBarIcon: ({color, focused}) => (
                <Ionicons name={focused ? 'shirt-sharp' : 'shirt-outline'} color={color} size={24} />
              )
            }} 
          />

          <Tabs.Screen
            name="search"
            options={{
              title: 'Search',
              tabBarIcon: ({color, focused}) => (
                <Ionicons name={focused ? 'search-sharp' : 'search-outline'} color={color} size={24} />
              )
            }} 
          />

          <Tabs.Screen
            name="profilepage"
            options={{
              title: 'Profile',
              tabBarIcon: ({color, focused}) => (
                <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />
              )
            }} 
          />

        </Tabs>
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}
