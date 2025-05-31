import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { Colors } from '../../constants/Colors'; // Correct path from app/(tabs)/_layout.tsx

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide header by default for all tabs within the layout
        tabBarActiveTintColor: Colors.primaryAccent, // Active tab icon/label color
        tabBarInactiveTintColor: Colors.primaryBase, // Inactive tab icon/label color
        tabBarStyle: {
          backgroundColor: Colors.secondaryPaletteLight, // Tab bar background color
          borderTopColor: Colors.inputBorder,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home" // This will be your original app/index.tsx content (Welcome screen)
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks/index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-checks" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories/index"
        options={{
          title: "Categories",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shape" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes/index"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="note-multiple-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="attachments/index"
        options={{
          title: "Attachments",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="attachment" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="preferences/index"
        options={{
          title: "Preferences",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
      {/* Hidden screens that are part of the tasks flow but not directly in tabs */}
      <Tabs.Screen
        name="tasks/create"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tasks/edit"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}