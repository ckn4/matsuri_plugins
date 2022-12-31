plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "moe.matsuri.plugin.gproxy"
        versionCode = 2
        versionName = "v20221231"
    }
}
