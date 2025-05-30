// app/(tabs)/tasks/index.tsx (Moved and Updated)
import { useRouter } from 'expo-router';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { db } from '../../../firebase';

type Task = {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  note?: string;
  attachment?: string;
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteTask = (id: string) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'tasks', id));
            } catch (err) {
              console.error("Error deleting task: ", err);
              Alert.alert("Error", "Failed to delete task.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription}>{item.description}</Text>
      {item.category && <Text style={styles.taskCategory}>Category: {item.category}</Text>}
      {item.note && <Text style={styles.taskNote}>Note: {item.note}</Text>}
      {item.attachment && <Text style={styles.taskAttachment}>Attachment: {item.attachment.substring(0, 30)}...</Text>}
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push({
              pathname: '/tasks/edit',
              params: {
                id: item.id,
                title: item.title,
                description: item.description,
                category: item.category,
                note: item.note,
                attachment: item.attachment,
              },
            })
          }
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTask(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Tasks</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(tabs)/tasks/create')}>
        <Text style={styles.buttonText}>Add New Task</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
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
  addButton: {
    backgroundColor: Colors.buttonPrimary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  taskItem: {
    backgroundColor: Colors.secondaryPaletteLight,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryBase,
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 5,
  },
  taskCategory: {
    fontSize: 14,
    color: Colors.complementaryAccent,
    marginBottom: 3,
  },
  taskNote: {
    fontSize: 14,
    color: Colors.primaryBase,
    marginBottom: 3,
  },
  taskAttachment: {
    fontSize: 14,
    color: Colors.complementaryAccent,
    marginBottom: 3,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: Colors.buttonSecondary,
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: Colors.errorText,
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
});