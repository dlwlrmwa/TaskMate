// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors'; // Correct path from app/(auth)/_layout.tsx

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide header for auth screens
        contentStyle: {
          backgroundColor: Colors.secondaryPaletteDark, // Set background color for auth screens
        }
      }}
    >
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
    </Stack>
  );
}