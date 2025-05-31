import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors'; // Correct path from app/(tabs)/home.tsx

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Navbar (These buttons will largely be superseded by the Tab Navigator, but kept for context) */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.navButton}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.navButton}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Section */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to TaskMate</Text>
        <Text style={styles.subtitle}>Your Daily Task Manager</Text>
        <Text style={styles.description}>
          Organize your tasks, stay productive, and achieve your goals with ease.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryPaletteDark,
    padding: 20,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryBase,
    padding: 10,
    backgroundColor: Colors.secondaryPaletteLight,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.complementaryAccent,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: Colors.primaryBase,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});