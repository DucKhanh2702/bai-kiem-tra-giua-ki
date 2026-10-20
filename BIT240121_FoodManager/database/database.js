import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('BIT240121_food.db');

export const initDatabase = () => {
  try {
    db.execSync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS BIT240121_DishCategory (
        BIT240121_Id INTEGER PRIMARY KEY AUTOINCREMENT,
        BIT240121_Name TEXT NOT NULL,
        BIT240121_Description TEXT
      );

      CREATE TABLE IF NOT EXISTS BIT240121_Dish (
        BIT240121_Id INTEGER PRIMARY KEY AUTOINCREMENT,
        BIT240121_Name TEXT NOT NULL,
        BIT240121_Price REAL NOT NULL,
        BIT240121_PreparationTime INTEGER NOT NULL,
        BIT240121_IsAvailable INTEGER NOT NULL,
        BIT240121_Description TEXT,
        BIT240121_DishCategoryId INTEGER,
        FOREIGN KEY (BIT240121_DishCategoryId) REFERENCES BIT240121_DishCategory (BIT240121_Id)
      );

      CREATE TABLE IF NOT EXISTS BIT240121_DishImage (
        BIT240121_Id INTEGER PRIMARY KEY AUTOINCREMENT,
        BIT240121_DishId INTEGER,
        BIT240121_ImageUrl TEXT NOT NULL,
        BIT240121_IsThumbnail INTEGER NOT NULL,
        FOREIGN KEY (BIT240121_DishId) REFERENCES BIT240121_Dish (BIT240121_Id)
      );
    `);

    // Kiểm tra xem đã có dữ liệu loại món ăn chưa, nếu chưa thì thêm dữ liệu mẫu
    const categoryCount = db.getFirstSync('SELECT COUNT(*) as count FROM BIT240121_DishCategory;');
    if (categoryCount.count === 0) {
      // Thêm 3 loại món ăn mẫu (đáp ứng tối thiểu yêu cầu đề bài)
      db.runSync(`INSERT INTO BIT240121_DishCategory (BIT240121_Name, BIT240121_Description) VALUES ('Món chính', 'Các món ăn chính trong bữa ăn');`);
      db.runSync(`INSERT INTO BIT240121_DishCategory (BIT240121_Name, BIT240121_Description) VALUES ('Đồ uống', 'Các loại nước giải khát');`);
      db.runSync(`INSERT INTO BIT240121_DishCategory (BIT240121_Name, BIT240121_Description) VALUES ('Khai vị', 'Món ăn nhẹ mở đầu bữa tiệc');`);

      // Thêm 5 món ăn mẫu phân bổ vào các loại
      db.runSync(`INSERT INTO BIT240121_Dish (BIT240121_Name, BIT240121_Price, BIT240121_PreparationTime, BIT240121_IsAvailable, BIT240121_Description, BIT240121_DishCategoryId) VALUES ('Phở bò đặc biệt', 50000, 15, 1, 'Phở bò truyền thống thơm ngon', 1);`);
      db.runSync(`INSERT INTO BIT240121_Dish (BIT240121_Name, BIT240121_Price, BIT240121_PreparationTime, BIT240121_IsAvailable, BIT240121_Description, BIT240121_DishCategoryId) VALUES ('Cơm tấm sườn bì', 45000, 12, 1, 'Cơm tấm sườn nướng thơm phức', 1);`);
      db.runSync(`INSERT INTO BIT240121_Dish (BIT240121_Name, BIT240121_Price, BIT240121_PreparationTime, BIT240121_IsAvailable, BIT240121_Description, BIT240121_DishCategoryId) VALUES ('Trà sữa trân châu', 30000, 5, 1, 'Trà sữa ngọt béo kèm trân châu', 2);`);
      db.runSync(`INSERT INTO BIT240121_Dish (BIT240121_Name, BIT240121_Price, BIT240121_PreparationTime, BIT240121_IsAvailable, BIT240121_Description, BIT240121_DishCategoryId) VALUES ('Nước cam ép', 25000, 5, 1, 'Cam tươi nguyên chất giàu vitamin C', 2);`);
      db.runSync(`INSERT INTO BIT240121_Dish (BIT240121_Name, BIT240121_Price, BIT240121_PreparationTime, BIT240121_IsAvailable, BIT240121_Description, BIT240121_DishCategoryId) VALUES ('Salad trộn dầu giấm', 35000, 10, 1, 'Rau củ tươi mát chống ngấy', 3);`);

      // Thêm ảnh mẫu cho các món ăn
      db.runSync(`INSERT INTO BIT240121_DishImage (BIT240121_DishId, BIT240121_ImageUrl, BIT240121_IsThumbnail) VALUES (1, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43', 1);`);
      db.runSync(`INSERT INTO BIT240121_DishImage (BIT240121_DishId, BIT240121_ImageUrl, BIT240121_IsThumbnail) VALUES (2, 'https://images.unsplash.com/photo-1626803775151-61d756612f40', 1);`);
      db.runSync(`INSERT INTO BIT240121_DishImage (BIT240121_DishId, BIT240121_ImageUrl, BIT240121_IsThumbnail) VALUES (3, 'https://images.unsplash.com/photo-1541658016709-82535e94bc69', 1);`);
      db.runSync(`INSERT INTO BIT240121_DishImage (BIT240121_DishId, BIT240121_ImageUrl, BIT240121_IsThumbnail) VALUES (4, 'https://images.unsplash.com/photo-1613478223719-2ab802602423', 1);`);
      db.runSync(`INSERT INTO BIT240121_DishImage (BIT240121_DishId, BIT240121_ImageUrl, BIT240121_IsThumbnail) VALUES (5, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 1);`);

      console.log("Seeded sample data successfully!");
    }

    console.log("Database initialized successfully!");
  } catch (error) {
    console.log("Error initializing database: ", error);
  }
};

// ⚠️ BỔ SUNG DÒNG NÀY ĐỂ CÁC FILE KHÁC NHẬN DIỆN ĐƯỢC DB
export default db;