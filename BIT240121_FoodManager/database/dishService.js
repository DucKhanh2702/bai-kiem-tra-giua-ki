import db from './database';

// ------------------- QUẢN LÝ DANH MỤC (DishCategory) -------------------

// Lấy tất cả danh mục
export const getCategories = () => {
  return db.getAllSync('SELECT * FROM BIT240121_DishCategory;');
};

// Thêm danh mục mới
export const addCategory = (name, description) => {
  return db.runSync(
    'INSERT INTO BIT240121_DishCategory (BIT240121_Name, BIT240121_Description) VALUES (?, ?);',
    [name, description]
  );
};


// ------------------- QUẢN LÝ MÓN ĂN (Dish) -------------------

// Lấy danh sách tất cả món ăn kèm ảnh đại diện và tên danh mục (có hỗ trợ lọc theo Danh mục và Tìm kiếm)
export const getDishes = (categoryId = null, searchQuery = '') => {
  let query = `
    SELECT 
      d.BIT240121_Id,
      d.BIT240121_Name,
      d.BIT240121_Price,
      d.BIT240121_PreparationTime,
      d.BIT240121_IsAvailable,
      d.BIT240121_Description,
      d.BIT240121_DishCategoryId,
      c.BIT240121_Name AS CategoryName,
      i.BIT240121_ImageUrl
    FROM BIT240121_Dish d
    LEFT JOIN BIT240121_DishCategory c ON d.BIT240121_DishCategoryId = c.BIT240121_Id
    LEFT JOIN BIT240121_DishImage i ON d.BIT240121_Id = i.BIT240121_DishId AND i.BIT240121_IsThumbnail = 1
    WHERE 1=1
  `;
  const params = [];

  if (categoryId) {
    query += ' AND d.BIT240121_DishCategoryId = ?';
    params.push(categoryId);
  }

  if (searchQuery.trim() !== '') {
    query += ' AND d.BIT240121_Name LIKE ?';
    params.push(`%${searchQuery}%`);
  }

  query += ' ORDER BY d.BIT240121_Id DESC;';

  return db.getAllSync(query, params);
};

// Thêm món ăn mới (và thêm ảnh đại diện tương ứng)
export const addDish = (name, price, prepTime, isAvailable, description, categoryId, imageUrl) => {
  const result = db.runSync(
    `INSERT INTO BIT240121_Dish 
      (BIT240121_Name, BIT240121_Price, BIT240121_PreparationTime, BIT240121_IsAvailable, BIT240121_Description, BIT240121_DishCategoryId) 
     VALUES (?, ?, ?, ?, ?, ?);`,
    [name, price, prepTime, isAvailable ? 1 : 0, description, categoryId]
  );

  const newDishId = result.lastInsertRowId;

  // Nếu người dùng nhập đường dẫn ảnh, thêm ngay vào bảng DishImage làm Thumbnail
  if (imageUrl && imageUrl.trim() !== '') {
    db.runSync(
      `INSERT INTO BIT240121_DishImage (BIT240121_DishId, BIT240121_ImageUrl, BIT240121_IsThumbnail) VALUES (?, ?, 1);`,
      [newDishId, imageUrl]
    );
  }

  return newDishId;
};

// Cập nhật thông tin món ăn
export const updateDish = (id, name, price, prepTime, isAvailable, description, categoryId) => {
  return db.runSync(
    `UPDATE BIT240121_Dish 
     SET BIT240121_Name = ?, BIT240121_Price = ?, BIT240121_PreparationTime = ?, BIT240121_IsAvailable = ?, BIT240121_Description = ?, BIT240121_DishCategoryId = ?
     WHERE BIT240121_Id = ?;`,
    [name, price, prepTime, isAvailable ? 1 : 0, description, categoryId, id]
  );
};

// Xóa món ăn (các ảnh liên quan sẽ được tự động xóa nếu có khóa ngoại hoặc xóa kèm)
export const deleteDish = (id) => {
  db.runSync('DELETE FROM BIT240121_DishImage WHERE BIT240121_DishId = ?;', [id]);
  return db.runSync('DELETE FROM BIT240121_Dish WHERE BIT240121_Id = ?;', [id]);
};


// ------------------- QUẢN LÝ HÌNH ẢNH MÓN ĂN (DishImage) -------------------

// Lấy tất cả ảnh của một món ăn
export const getDishImages = (dishId) => {
  return db.getAllSync(
    'SELECT * FROM BIT240121_DishImage WHERE BIT240121_DishId = ?;',
    [dishId]
  );
};

// Thêm ảnh mới cho món ăn
export const addDishImage = (dishId, imageUrl, isThumbnail = 0) => {
  return db.runSync(
    'INSERT INTO BIT240121_DishImage (BIT240121_DishId, BIT240121_ImageUrl, BIT240121_IsThumbnail) VALUES (?, ?, ?);',
    [dishId, imageUrl, isThumbnail]
  );
};