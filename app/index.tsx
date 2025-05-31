import { Redirect } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { auth } from '../firebase';

const { width, height } = Dimensions.get('window');

export default function IndexScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={width < 400 ? 'small' : 'large'} color={Colors.primaryAccent} />
      </View>
    );
  }

  if (user) {
    // User is logged in, redirect to the main tabs
    return <Redirect href="/(tabs)/home" />;
  } else {
    // User is not logged in, redirect to the authentication flow
    return <Redirect href="/(auth)/login" />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondaryPaletteDark,
    paddingHorizontal: width * 0.05,
    minHeight: height,
  },
});