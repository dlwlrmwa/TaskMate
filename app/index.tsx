import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.navButton}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
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
    backgroundColor: '#C1A9D9',
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
    color: '#010440',
    padding: 10,
    backgroundColor: '#9E82D9',
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
    color: '#5317A6',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#7B4BBF',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#010440',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
