import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { db } from '../../../firebase';

type Params = {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  note?: string;
  attachment?: string;
};

export default function EditTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();
  const id = typeof params.id === 'string' ? params.id : undefined;

  const [title, setTitle] = useState(params.title ?? '');
  const [description, setDescription] = useState(params.description ?? '');
  const [category, setCategory] = useState(params.category ?? '');
  const [note, setNote] = useState(params.note ?? '');
  const [attachment, setAttachment] = useState(params.attachment ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        setLoading(true);
        try {
          const taskRef = doc(db, 'tasks', id);
          const taskSnap = await getDoc(taskRef);
          if (taskSnap.exists()) {
            const taskData = taskSnap.data();
            setTitle(taskData.title || '');
            setDescription(taskData.description || '');
            setCategory(taskData.category || '');
            setNote(taskData.note || '');
            setAttachment(taskData.attachment || '');
          } else {
            Alert.alert("Error", "Task not found!");
            router.back();
          }
        } catch (err) {
          console.error("Error fetching task: ", err);
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [id]);

  const handleUpdateTask = async () => {
    setError('');
    if (!title.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    if (!id) {
      setError('Task ID is missing.');
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        title,
        description,
        category,
        note,
        attachment,
      });
      router.back();
    } catch (err) {
      console.error("Error updating document: ", err);
      setError((err as Error).message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading task...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Task</Text>
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
        placeholder="Attachment URL/Base64 (Placeholder)"
        value={attachment}
        onChangeText={setAttachment}
        style={styles.input}
        placeholderTextColor={Colors.textDark}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleUpdateTask}>
        <Text style={styles.buttonText}>Update Task</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Cancel</Text>
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
  loadingText: {
    fontSize: 18,
    color: Colors.primaryBase,
    textAlign: 'center',
    marginTop: 50,
  },
});