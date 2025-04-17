package dev.equestria.ponyplay

import android.content.Intent
import android.provider.Settings
import android.webkit.JavascriptInterface
import android.webkit.WebView


class JavaScriptExtensions(originalActivity: MainActivity) {
    private val activity: MainActivity = originalActivity
    private var lightSensorValue: Int = 0

    @JavascriptInterface
    fun getSystemBrightness(): Int {
        return Settings.System.getInt(
            activity.baseContext.contentResolver,
            Settings.System.SCREEN_BRIGHTNESS)
    }

    @JavascriptInterface
    fun getBrightness(): Float {
        return activity.lightSensorValue
    }

    @JavascriptInterface
    fun setBrightness(brightness: Int): Int {
        Settings.System.putInt(
            activity.baseContext.contentResolver,
            Settings.System.SCREEN_BRIGHTNESS_MODE,
            Settings.System.SCREEN_BRIGHTNESS_MODE_MANUAL
        )

        Settings.System.putInt(
            activity.baseContext.contentResolver, Settings.System.SCREEN_BRIGHTNESS, brightness
        )

        return Settings.System.getInt(
            activity.baseContext.contentResolver, Settings.System.SCREEN_BRIGHTNESS
        )
    }

    @JavascriptInterface
    fun reloadWebView() {
        val wv = activity.findViewById<WebView>(R.id.webview)
        wv.reload()
    }

    @JavascriptInterface
    fun startApp(url: String) {
        val i = Intent()
        i.setAction("startApp")
        i.putExtra("url", url)
        activity.sendBroadcast(i)
    }

    @JavascriptInterface
    fun closeApp() {
        val i = Intent()
        i.setAction("closeApp")
        activity.sendBroadcast(i)
    }
}

