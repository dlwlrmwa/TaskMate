// app/(tabs)/preferences/index.tsx (Moved and Updated)
import { getAuth } from 'firebase/auth'; // Import getAuth to get current user
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors'; // Correct path from app/(tabs)/preferences/index.tsx
import { db } from '../../../firebase'; // Correct path from app/(tabs)/preferences/index.tsx

export default function PreferencesScreen() {
  const auth = getAuth(); // Get the Firebase auth instance
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      setError('');
      const user = auth.currentUser;
      if (user) {
        try {
          const preferencesRef = doc(db, 'preferences', user.uid);
          const docSnap = await getDoc(preferencesRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setNotificationsEnabled(data.notificationsEnabled || false);
            setTheme(data.theme || 'light');
          } else {
            // If no preferences exist, create default ones
            await setDoc(preferencesRef, {
              notificationsEnabled: false,
              theme: 'light',
              createdAt: new Date(),
            });
          }
        } catch (err) {
          console.error("Error fetching/setting preferences: ", err);
          setError((err as Error).message);
        }
      } else {
        setError("No user logged in to fetch preferences.");
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchPreferences();
      } else {
        setLoading(false);
        setError("Please log in to manage preferences.");
        setNotificationsEnabled(false);
        setTheme('light');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const updatePreference = async (key: string, value: any) => {
    setError('');
    const user = auth.currentUser;
    if (user) {
      try {
        const preferencesRef = doc(db, 'preferences', user.uid);
        await setDoc(preferencesRef, { [key]: value }, { merge: true });
        Alert.alert("Success", "Preference updated successfully!");
      } catch (err) {
        console.error("Error updating preference: ", err);
        setError((err as Error).message);
        Alert.alert("Error", "Failed to update preference.");
      }
    } else {
      setError("Please log in to update preferences.");
      Alert.alert("Error", "Please log in to update preferences.");
    }
  };

  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    updatePreference('notificationsEnabled', newValue);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    updatePreference('theme', newTheme);
    // In a real app, you would apply the theme change here to the UI
    Alert.alert("Theme Change", `App theme set to ${newTheme}. (UI adaptation logic not implemented in this demo)`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading preferences...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Preferences</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Enable Notifications</Text>
        <Switch
          onValueChange={toggleNotifications}
          value={notificationsEnabled}
          trackColor={{ false: Colors.secondaryPaletteDark, true: Colors.buttonPrimary }}
          thumbColor={notificationsEnabled ? Colors.secondaryPaletteLight : Colors.textDark}
        />
      </View>

      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>App Theme ({theme === 'light' ? 'Light' : 'Dark'})</Text>
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <Text style={styles.buttonText}>Toggle Theme</Text>
        </TouchableOpacity>
      </View>

      {/* Add more preferences here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.secondaryPaletteDark,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: Colors.primaryAccent,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.primaryBase,
    textAlign: 'center',
    marginTop: 50,
  },
  error: {
    color: Colors.errorText,
    textAlign: 'center',
    marginBottom: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.secondaryPaletteLight,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  preferenceLabel: {
    fontSize: 18,
    color: Colors.primaryBase,
  },
  themeButton: {
    backgroundColor: Colors.buttonSecondary,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
});