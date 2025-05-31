import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { db } from '../../../firebase';
export default function CreateTaskScreen() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); 
  const [note, setNote] = useState(''); 
  const [attachment, setAttachment] = useState(''); 
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateTask = async () => {
    setError('');
    if (!title.trim()) {
      setError('Task title cannot be empty.');
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        title,
        description,
        category,
        note,
        attachment,
        createdAt: serverTimestamp(),
        // Add userId when authentication is fully integrated and accessible here
      });
      router.back();
    } catch (err) {
      console.error("Error adding document: ", err);
      setError((err as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Task</Text>
      <TextInput
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor={Colors.textDark}
      />
      <TextInput
        placeholder="Description (Optional)"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.textArea]}
        multiline
        placeholderTextColor={Colors.textDark}
      />
      <TextInput
        placeholder="Category (e.g., Work, Personal)"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
        placeholderTextColor={Colors.textDark}
      />
      <TextInput
        placeholder="Note (Optional)"
        value={note}
        onChangeText={setNote}
        style={[styles.input, styles.textArea]}
        multiline
        placeholderTextColor={Colors.textDark}
      />
      <TextInput
        placeholder="Attachment URL (Optional)"
        value={attachment}
        onChangeText={setAttachment}
        style={styles.input}
        placeholderTextColor={Colors.textDark}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back to Tasks</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: Colors.secondaryPaletteLight,
    color: Colors.textDark,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: Colors.buttonPrimary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: Colors.complementaryAccent, 
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
  },
});