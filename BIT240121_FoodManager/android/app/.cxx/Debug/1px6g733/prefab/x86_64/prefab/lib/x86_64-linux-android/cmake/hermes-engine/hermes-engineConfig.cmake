if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "C:/Users/K27/.gradle/caches/9.4.1/transforms/b86a96f5d63dd8d2ccd91bf10067a8b1/transformed/hermes-android-260318099.0.4-debug/prefab/modules/hermesvm/libs/android.x86_64/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/K27/.gradle/caches/9.4.1/transforms/b86a96f5d63dd8d2ccd91bf10067a8b1/transformed/hermes-android-260318099.0.4-debug/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

