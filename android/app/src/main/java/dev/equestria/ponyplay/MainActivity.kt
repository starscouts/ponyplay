package dev.equestria.ponyplay

import android.annotation.SuppressLint
import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ActivityInfo
import android.graphics.Color
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import android.util.Log
import android.view.Display
import android.view.View
import android.view.WindowManager
import android.webkit.GeolocationPermissions
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import okhttp3.*
import kotlin.system.exitProcess


class MainActivity : SensorEventListener, Activity() {
    private lateinit var mSensorManager: SensorManager
    private lateinit var mLightSensor: Sensor
    private lateinit var broadcastReceiver: BroadcastReceiver
    var lightSensorValue: Float = 0f
    val mainAppURL: String = "https://ponyplay-raindrops.equestria.dev:20443/app.html"

    override fun onSensorChanged(sensorEvent: SensorEvent) {
        if (sensorEvent.sensor.type == Sensor.TYPE_LIGHT) {
            Log.d("SensorTest", "" + sensorEvent.values[0])
            lightSensorValue = sensorEvent.values[0]
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN)
    }

    override fun onAccuracyChanged(sensor: Sensor?, i: Int) {}

    fun showError() {
        MaterialAlertDialogBuilder(this).setCancelable(false)
            .setTitle("Error")
            .setMessage("Unable to communicate with your local Ponyplay Station.")
            .setNegativeButton("Quit") { _, _ ->
                this.moveTaskToBack(true)
                exitProcess(0)
            }.show()
    }

    override fun onDestroy() {
        unregisterReceiver(broadcastReceiver)
        super.onDestroy()
    }

    override fun onResume() {
        window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN)

        super.onResume()

        mSensorManager.registerListener(this, mLightSensor, SensorManager.SENSOR_DELAY_NORMAL)
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN)

        super.onWindowFocusChanged(hasFocus)
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //
        // getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)
        setContentView(R.layout.activity_main)

        val intentFilter = IntentFilter()
        intentFilter.addAction("startApp")
        intentFilter.addAction("closeApp")

        broadcastReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                if (intent.action == "startApp") {
                    val av = findViewById<WebView>(R.id.appview)
                    av.visibility = View.VISIBLE

                    val webSettings = av.settings
                    webSettings.javaScriptEnabled = true
                    webSettings.cacheMode = WebSettings.LOAD_NO_CACHE
                    webSettings.domStorageEnabled = true
                    webSettings.allowFileAccess = true
                    webSettings.allowContentAccess = true
                    webSettings.safeBrowsingEnabled = false

                    webSettings.allowUniversalAccessFromFileURLs = true
                    webSettings.allowFileAccessFromFileURLs = true

                    webSettings.mediaPlaybackRequiresUserGesture = false
                    webSettings.userAgentString = "Mozilla/5.0 (Linux; Ponyplay; main) AppleWebKit/" + webSettings.userAgentString.split("AppleWebKit/")[1]

                    av.webViewClient = object : WebViewClient() {
                        @Deprecated("Deprecated in Java")
                        override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                            av.loadUrl(url)
                            return true
                        }
                    }

                    av.setLayerType(View.LAYER_TYPE_HARDWARE, null)

                    intent.getStringExtra("url")?.let { av.loadUrl(it) }
                } else if (intent.action == "closeApp") {
                    val av = findViewById<WebView>(R.id.appview)
                    av.visibility = View.GONE
                    av.loadUrl("about:blank")
                }
            }
        }

        registerReceiver(broadcastReceiver, intentFilter, RECEIVER_NOT_EXPORTED)

        mSensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        mLightSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_LIGHT)

        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT

        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN)
        this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE)

        val wv = findViewById<WebView>(R.id.webview)

        val volleyQueue = Volley.newRequestQueue(baseContext)

        val jsonObjectRequest = JsonObjectRequest(
            Request.Method.GET, "https://ponyplay-raindrops.equestria.dev:20443/availabilitycheck.txt", null,

            { response ->
                Log.i("HTTPRequest", response.toString())

                if (response.getString("status") == "OK") {
                    wv.clearCache(true)
                    wv.clearHistory()

                    val webSettings = wv.settings
                    webSettings.javaScriptEnabled = true
                    webSettings.cacheMode = WebSettings.LOAD_NO_CACHE
                    webSettings.domStorageEnabled = true
                    webSettings.allowFileAccess = true
                    webSettings.allowContentAccess = true
                    webSettings.safeBrowsingEnabled = false

                    webSettings.allowUniversalAccessFromFileURLs = true
                    webSettings.allowFileAccessFromFileURLs = true

                    webSettings.mediaPlaybackRequiresUserGesture = false
                    webSettings.userAgentString = "Mozilla/5.0 (Linux; Ponyplay; main) AppleWebKit/" + webSettings.userAgentString.split("AppleWebKit/")[1]

                    wv.loadUrl(mainAppURL)
                    wv.addJavascriptInterface(JavaScriptExtensions(this), "engine")
                    wv.setLayerType(View.LAYER_TYPE_HARDWARE, null)

                    wv.webViewClient = object : WebViewClient() {
                        @Deprecated("Deprecated in Java")
                        override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                            wv.loadUrl(url)
                            return true
                        }
                    }

                    wv.webChromeClient = object : WebChromeClient() {
                        override fun onPermissionRequest(request: PermissionRequest) {
                            Log.d("WebView", "onPermissionRequest")
                            runOnUiThread {
                                Log.d("WebView", request.origin.toString())
                                Log.d("WebView", "GRANTED")
                                request.grant(request.resources)
                            }
                        }

                        override fun onGeolocationPermissionsShowPrompt(
                            origin: String?,
                            callback: GeolocationPermissions.Callback
                        ) {
                            callback.invoke(origin, true, false)
                        }
                    }

                    WebView.setWebContentsDebuggingEnabled(false)
                } else {
                    showError()
                }
            },

            { error ->
                showError()
                Log.e("HTTPRequest", "Request error: ${error.localizedMessage}")
            })

        volleyQueue.add(jsonObjectRequest)
    }
}