// app/(tabs)/categories/index.tsx (Moved and Updated)
import { useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { db } from '../../../firebase';

type Category = {
  id: string;
  name: string;
  createdAt?: any;
};

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categoriesData: Category[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Category, 'id'>),
      }));
      setCategories(categoriesData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddCategory = async () => {
    setError('');
    if (!newCategoryName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }
    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategoryName,
        createdAt: new Date(),
      });
      setNewCategoryName('');
    } catch (err) {
      console.error("Error adding category: ", err);
      setError((err as Error).message);
    }
  };

  const handleDeleteCategory = (id: string) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? Tasks associated with this category will not be deleted but their category field will become invalid.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'categories', id));
            } catch (err) {
              console.error("Error deleting category: ", err);
              Alert.alert("Error", "Failed to delete category.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCategory(item.id)}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Categories</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="New Category Name"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          style={styles.input}
          placeholderTextColor={Colors.textDark}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.buttonText}>Add Category</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
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
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.secondaryPaletteLight,
    color: Colors.textDark,
    marginRight: 10,
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
  categoryItem: {
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
  categoryName: {
    fontSize: 18,
    color: Colors.primaryBase,
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