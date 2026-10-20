@echo off
"C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.20.101-hotspot\\bin\\java" ^
  --enable-native-access ^
  ALL-UNNAMED ^
  --class-path ^
  "C:\\Users\\K27\\.gradle\\caches\\modules-2\\files-2.1\\com.google.prefab\\cli\\2.1.0\\aa32fec809c44fa531f01dcfb739b5b3304d3050\\cli-2.1.0-all.jar" ^
  com.google.prefab.cli.AppKt ^
  --build-system ^
  cmake ^
  --platform ^
  android ^
  --abi ^
  x86_64 ^
  --os-version ^
  24 ^
  --stl ^
  c++_shared ^
  --ndk-version ^
  27 ^
  --output ^
  "C:\\Users\\K27\\AppData\\Local\\Temp\\agp-prefab-staging8116516516326357036\\staged-cli-output" ^
  "C:\\Users\\K27\\.gradle\\caches\\9.4.1\\transforms\\892e41b78f62a347e26edf02bde8c06c\\transformed\\react-android-0.88.0-debug\\prefab" ^
  "C:\\Users\\K27\\.gradle\\caches\\9.4.1\\transforms\\8ecdea8e879178aa1e721829f4e819fb\\transformed\\kolibri-android-0.2.3\\prefab" ^
  "C:\\Users\\K27\\.gradle\\caches\\9.4.1\\transforms\\b86a96f5d63dd8d2ccd91bf10067a8b1\\transformed\\hermes-android-260318099.0.4-debug\\prefab" ^
  "C:\\Users\\K27\\.gradle\\caches\\9.4.1\\transforms\\00e9f838836fbc0e39e2c6aa6eaaebb6\\transformed\\fbjni-0.7.0\\prefab"
