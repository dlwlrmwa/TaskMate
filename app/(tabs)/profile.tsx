import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { signOut, updateProfile } from 'firebase/auth'; // Import updateProfile
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { auth, db } from '../../firebase';

export default function ProfileScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editProfilePhotoUrl, setEditProfilePhotoUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUserEmail(currentUser.email);
        setEditDisplayName(currentUser.displayName || '');

        // Fetch user document from Firestore for profile photo
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setProfilePhotoUrl(userData.profilePhotoUrl || null);
            setEditProfilePhotoUrl(userData.profilePhotoUrl || '');
            setEditDisplayName(userData.displayName || currentUser.displayName || '');
          }
        } catch (err) {
          console.error("Error fetching user profile data:", err);
          setError("Failed to load profile data.");
        }
      } else {
        setUserEmail(null);
        setProfilePhotoUrl(null);
        setEditDisplayName('');
        setEditProfilePhotoUrl('');
        // Redirect to login if no user is found after initial check, handled by _layout.tsx
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login'); // Redirect to login after logout
    } catch (err) {
      console.error("Error logging out:", err);
      Alert.alert("Logout Error", (err as Error).message);
    }
  };

  const handleChooseProfilePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true, // Request Base64 data
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setEditProfilePhotoUrl(`data:image/jpeg;base64,${selectedAsset.base64}`);
      }
    }
  };

  const handleSaveProfile = async () => {
    setError('');
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          displayName: editDisplayName,
          profilePhotoUrl: editProfilePhotoUrl,
          updatedAt: new Date(),
        }, { merge: true });

        // Update Firebase Auth profile if displayName changed
        if (user.displayName !== editDisplayName) {
          await updateProfile(user, { displayName: editDisplayName }); // CORRECTED CALL
        }

        setProfilePhotoUrl(editProfilePhotoUrl);
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("Failed to save profile: " + (err as Error).message);
      }
    } else {
      setError("No user logged in.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primaryAccent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>

      {/* Profile Photo Section */}
      <TouchableOpacity onPress={isEditing ? handleChooseProfilePhoto : undefined} style={styles.profilePhotoContainer}>
        {profilePhotoUrl ? (
          <Image source={{ uri: profilePhotoUrl }} style={styles.profilePhoto} />
        ) : (
          <View style={styles.placeholderPhoto}>
            <Text style={styles.placeholderPhotoText}>No Photo</Text>
          </View>
        )}
        {isEditing && (
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        )}
      </TouchableOpacity>

      {/* User Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userEmail}</Text>

        <Text style={styles.label}>Display Name:</Text>
        {isEditing ? (
          <TextInput
            style={styles.editableInput}
            value={editDisplayName}
            onChangeText={setEditDisplayName}
            placeholder="Enter display name"
            placeholderTextColor={Colors.textDark}
          />
        ) : (
          <Text style={styles.value}>{editDisplayName || 'N/A'}</Text>
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.buttonText}>Save Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: Colors.secondaryPaletteDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondaryPaletteDark,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: Colors.primaryAccent,
  },
  profilePhotoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.secondaryPaletteLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    overflow: 'hidden',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderPhoto: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderPhotoText: {
    color: Colors.textDark,
    fontSize: 16,
  },
  changePhotoText: {
    position: 'absolute',
    bottom: 5,
    color: Colors.primaryBase,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: Colors.secondaryPaletteLight,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryBase,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 15,
  },
  editableInput: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 15,
    backgroundColor: Colors.secondaryPaletteDark,
  },
  buttonContainer: {
    width: '100%',
  },
  editButton: {
    backgroundColor: Colors.buttonSecondary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: Colors.buttonPrimary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: Colors.complementaryAccent,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: Colors.errorText,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: Colors.errorText,
    textAlign: 'center',
    marginBottom: 8,
    marginTop: -10,
  },
});