import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, Alert, ScrollView, SafeAreaView } from 'react-native';
import { initDatabase } from './database/database';
import { getCategories, getDishes, addDish, deleteDish } from './database/dishService';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Trạng thái Form thêm món ăn
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [prepTime, setPrepTime] = useState('15');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState(null);

  // Khởi tạo database và tải dữ liệu
  const loadData = () => {
    try {
      initDatabase();
      const cats = getCategories();
      setCategories(cats);
      const ds = getDishes(selectedCategory, searchQuery);
      setDishes(ds);
    } catch (error) {
      console.log('Lỗi tải dữ liệu:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  // Xử lý thêm món ăn mới
  const handleAddDish = () => {
    if (!dishName.trim() || !price || !categoryId) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên món, giá tiền và chọn danh mục!');
      return;
    }
    try {
      addDish(
        dishName.trim(),
        parseFloat(price),
        parseInt(prepTime) || 15,
        true,
        description.trim(),
        categoryId,
        imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
      );
      Alert.alert('Thành công', 'Đã thêm món ăn mới vào hệ thống!');
      
      // Reset form
      setDishName('');
      setPrice('');
      setPrepTime('15');
      setDescription('');
      setImageUrl('');
      loadData();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm món ăn: ' + error.message);
    }
  };

  // Xử lý xóa món ăn
  const handleDeleteDish = (id) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa món ăn này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          deleteDish(id);
          loadData();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Quản lý Món Ăn (BIT240121)</Text>

      {/* Ô tìm kiếm món ăn */}
      <TextInput
        style={styles.input}
        placeholder="🔍 Tìm kiếm tên món ăn..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Thanh lọc theo danh mục */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catContainer}>
        <TouchableOpacity
          style={[styles.catButton, selectedCategory === null && styles.catActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.catText, selectedCategory === null && styles.catTextActive]}>Tất cả</Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.BIT240121_Id}
            style={[styles.catButton, selectedCategory === cat.BIT240121_Id && styles.catActive]}
            onPress={() => setSelectedCategory(cat.BIT240121_Id)}
          >
            <Text style={[styles.catText, selectedCategory === cat.BIT240121_Id && styles.catTextActive]}>
              {cat.BIT240121_Name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Form thêm món ăn */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>➕ Thêm Món Ăn Mới</Text>
        <View style={styles.rowInputs}>
          <TextInput style={[styles.miniInput, { flex: 2 }]} placeholder="Tên món ăn" value={dishName} onChangeText={setDishName} />
          <TextInput style={[styles.miniInput, { flex: 1, marginLeft: 6 }]} placeholder="Giá (đ)" keyboardCategory="numeric" keyboardType="numeric" value={price} onChangeText={setPrice} />
        </View>
        <TextInput style={styles.miniInput} placeholder="Đường dẫn ảnh (URL hình ảnh)" value={imageUrl} onChangeText={setImageUrl} />
        
        {/* Chọn danh mục cho món ăn */}
        <Text style={styles.subLabel}>Chọn danh mục:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.BIT240121_Id}
              style={[styles.selectCatBtn, categoryId === cat.BIT240121_Id && styles.selectCatActive]}
              onPress={() => setCategoryId(cat.BIT240121_Id)}
            >
              <Text style={{ color: categoryId === cat.BIT240121_Id ? '#fff' : '#333', fontSize: 12, fontWeight: '500' }}>
                {cat.BIT240121_Name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddDish}>
          <Text style={styles.addBtnText}>Lưu Món Ăn Vào SQLite</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách hiển thị món ăn */}
      <FlatList
        data={dishes}
        keyExtractor={(item) => item.BIT240121_Id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image 
              source={{ uri: item.BIT240121_ImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }} 
              style={styles.image} 
            />
            <View style={styles.cardInfo}>
              <Text style={styles.title}>{item.BIT240121_Name}</Text>
              <Text style={styles.priceText}>Giá: {item.BIT240121_Price.toLocaleString()} đ</Text>
              <Text style={styles.dishCat}>📁 {item.CategoryName || 'Chưa phân loại'}</Text>
              <Text style={styles.timeText}>
                ⏱️ {item.BIT240121_PreparationTime} phút ({item.BIT240121_PreparationTime <= 15 ? 'Nhanh' : 'Thông thường'})
              </Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteDish(item.BIT240121_Id)}>
              <Text style={styles.deleteText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  input: { 
    backgroundColor: '#fff', 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },
  catContainer: { 
    flexDirection: 'row', 
    marginBottom: 10, 
    maxHeight: 40 
  },
  catButton: { 
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    backgroundColor: '#e9ecef', 
    borderRadius: 20, 
    marginRight: 8, 
    height: 34, 
    justifyContent: 'center' 
  },
  catActive: { 
    backgroundColor: '#007AFF' 
  },
  catText: { 
    color: '#495057', 
    fontWeight: '500', 
    fontSize: 13 
  },
  catTextActive: { 
    color: '#fff' 
  },
  formContainer: { 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#dee2e6' 
  },
  formTitle: { 
    fontWeight: 'bold', 
    marginBottom: 8, 
    color: '#333', 
    fontSize: 14 
  },
  rowInputs: { 
    flexDirection: 'row', 
    marginBottom: 6 
  },
  miniInput: { 
    backgroundColor: '#f8f9fa', 
    padding: 8, 
    borderRadius: 6, 
    marginBottom: 6, 
    borderWidth: 1, 
    borderColor: '#e9ecef', 
    fontSize: 13 
  },
  subLabel: { 
    fontSize: 12, 
    color: '#6c757d', 
    marginBottom: 4 
  },
  selectCatBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    backgroundColor: '#f1f3f5', 
    borderRadius: 6, 
    marginRight: 6, 
    borderWidth: 1, 
    borderColor: '#ced4da' 
  },
  selectCatActive: { 
    backgroundColor: '#28a745', 
    borderColor: '#28a745' 
  },
  addBtn: { 
    backgroundColor: '#28a745', 
    padding: 10, 
    borderRadius: 6, 
    alignItems: 'center', 
    marginTop: 4 
  },
  addBtnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee'
  },
  image: { 
    width: 60, 
    height: 60, 
    borderRadius: 6, 
    marginRight: 10, 
    backgroundColor: '#eee' 
  },
  cardInfo: { 
    flex: 1 
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  priceText: {
    color: '#dc3545',
    fontWeight: 'bold',
    fontSize: 13,
    marginVertical: 2,
  },
  dishCat: { 
    fontSize: 12, 
    color: '#6c757d' 
  },
  timeText: {
    fontSize: 12,
    color: '#555',
  },
  deleteBtn: { 
    backgroundColor: '#dc3545', 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 6 
  },
  deleteText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 12 
  }
});