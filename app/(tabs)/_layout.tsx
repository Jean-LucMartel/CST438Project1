import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    
    <Tabs>

    //navigation button for home screen
      <Tabs.Screen 
      name="index" 
      options={{ 
        title: 'Home',
        tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          )
      }} />

    //navigation button for favorites
      <Tabs.Screen 
      name="favorites" 
      options={{ 
        title: 'Favorites',
        tabBarIcon: ({color, focused}) => (
            <Ionicons name={focused ? 'baseball-sharp' : 'baseball-outline'} color={color} size={24} />
        )

      }} />

    //navigation button for search
    <Tabs.Screen
    name = "search"
    options = {{
        title: 'Search',
        tabBarIcon: ({color, focused}) => (
            <Ionicons name = {focused ? 'search-sharp' : 'search-outline'} color = {color} size = {24} />
        )

    }} />

    </Tabs>
  );
}
