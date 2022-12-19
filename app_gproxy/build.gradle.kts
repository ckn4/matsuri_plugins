plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

setupAll()

android {
    defaultConfig {
        applicationId = "moe.matsuri.plugin.gproxy"
        versionCode = 1
        versionName = "v20221219"
    }
}
