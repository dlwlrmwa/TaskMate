import { useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { db } from '../../../firebase';

type Note = {
  id: string;
  content: string;
  createdAt?: any;
};

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData: Note[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Note, 'id'>),
      }));
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddNote = async () => {
    setError('');
    if (!newNoteContent.trim()) {
      setError('Note content cannot be empty.');
      return;
    }
    try {
      await addDoc(collection(db, 'notes'), {
        content: newNoteContent,
        createdAt: new Date(),
      });
      setNewNoteContent('');
    } catch (err) {
      console.error("Error adding note: ", err);
      setError((err as Error).message);
    }
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'notes', id));
            } catch (err) {
              console.error("Error deleting note: ", err);
              Alert.alert("Error", "Failed to delete note.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteContent}>{item.content}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteNote(item.id)}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Notes</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="New Note Content"
          value={newNoteContent}
          onChangeText={setNewNoteContent}
          style={[styles.input, styles.textArea]}
          multiline
          placeholderTextColor={Colors.textDark}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
          <Text style={styles.buttonText}>Add Note</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
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
    flexDirection: 'column',
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  noteItem: {
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
  noteContent: {
    flex: 1,
    fontSize: 16,
    color: Colors.primaryBase,
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