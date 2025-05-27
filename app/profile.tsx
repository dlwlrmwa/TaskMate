import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      {/* Add user info here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C1A9D9' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#5317A6' },
});