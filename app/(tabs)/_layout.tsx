import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{flex: 1}}> 
    <Tabs
      screenOptions={{
      tabBarActiveTintColor: "#fa5c5c"
      } 
    }  
    >
{/* navigation button for login screen, just a placeholder to be able to move around tabs will remove later */}
  <Tabs.Screen 
        name="login" 
        options={{ 
          title: 'Login',
          tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
            )
        }} />

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
            <Ionicons name={focused ? 'star-sharp' : 'star-outline'} color={color} size={24} />
        )

      }} />

              //navigation button for teams
    <Tabs.Screen
    name = "teams"
    options = {{
        title: 'Teams',
        tabBarIcon: ({color, focused}) => (
            <Ionicons name = {focused ? 'shirt-sharp' : 'shirt-outline'} color = {color} size = {24} />
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

    //navigation button for profilepage
    <Tabs.Screen
    name = "profilepage"
    options = {{
        title: 'Profile',
        tabBarIcon: ({color, focused}) => (
          <Ionicons name = {focused ? 'person-sharp' : 'person-outline'} color = {color} size = {24} />
        )

    }} />

    </Tabs>
    </GestureHandlerRootView>
  );
}