import { useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { db } from '../../../firebase';

type Attachment = {
  id: string;
  name: string;
  url: string;
  createdAt?: any;
};

export default function AttachmentsScreen() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'attachments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const attachmentsData: Attachment[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Attachment, 'id'>),
      }));
      setAttachments(attachmentsData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddAttachment = async () => {
    setError('');
    if (!newAttachmentUrl.trim()) {
      setError('Attachment URL/Base64 cannot be empty.');
      return;
    }
    if (!newAttachmentName.trim()) {
      setError('Attachment name cannot be empty.');
      return;
    }

    try {
      await addDoc(collection(db, 'attachments'), {
        name: newAttachmentName,
        url: newAttachmentUrl,
        createdAt: new Date(),
      });
      setNewAttachmentUrl('');
      setNewAttachmentName('');
    } catch (err) {
      console.error("Error adding attachment: ", err);
      setError((err as Error).message);
    }
  };

  const handleDeleteAttachment = (id: string) => {
    Alert.alert(
      "Delete Attachment",
      "Are you sure you want to delete this attachment?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'attachments', id));
            } catch (err) {
              console.error("Error deleting attachment: ", err);
              Alert.alert("Error", "Failed to delete attachment.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleOpenAttachment = (url: string) => {
    // Basic validation for URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      Linking.openURL(url).catch(err => Alert.alert("Error", "Could not open URL: " + err.message));
    } else if (url.startsWith('data:')) {
      // For Base64, a more complex viewer might be needed, or indicate it's for display
      Alert.alert("Base64 Content", "This is Base64 content. You might need a specific viewer or save it to a file.");
    } else {
      Alert.alert("Invalid Content", "Attachment is not a valid URL or recognized Base64 format.");
    }
  };

  const renderAttachmentItem = ({ item }: { item: Attachment }) => (
    <View style={styles.attachmentItem}>
      <View style={styles.attachmentDetails}>
        <Text style={styles.attachmentName}>{item.name}</Text>
        <Text style={styles.attachmentUrl}>URL/Base64: {item.url.substring(0, 40)}...</Text>
      </View>
      <View style={styles.attachmentActions}>
        <TouchableOpacity style={styles.viewButton} onPress={() => handleOpenAttachment(item.url)}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteAttachment(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Attachments</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Attachment Name"
          value={newAttachmentName}
          onChangeText={setNewAttachmentName}
          style={styles.input}
          placeholderTextColor={Colors.textDark}
        />
        <TextInput
          placeholder="Attachment URL or Base64 String"
          value={newAttachmentUrl}
          onChangeText={setNewAttachmentUrl}
          style={styles.input}
          placeholderTextColor={Colors.textDark}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddAttachment}>
          <Text style={styles.buttonText}>Add Attachment</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={attachments}
        renderItem={renderAttachmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.secondaryPaletteLight,
    color: Colors.textDark,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: Colors.buttonPrimary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  attachmentItem: {
    backgroundColor: Colors.secondaryPaletteLight,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  attachmentDetails: {
    flex: 1,
    marginRight: 10,
  },
  attachmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryBase,
  },
  attachmentUrl: {
    fontSize: 14,
    color: Colors.textDark,
  },
  attachmentActions: {
    flexDirection: 'row',
  },
  viewButton: {
    backgroundColor: Colors.complementaryAccent,
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: Colors.errorText,
    padding: 8,
    borderRadius: 5,
  },
  error: {
    color: Colors.errorText,
    textAlign: 'center',
    marginBottom: 8,
  },
});