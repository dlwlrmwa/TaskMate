import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/taskmate_logo.jpg')}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
