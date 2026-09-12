// MainActivity.kt — پوسته WebView اندروید (پوشه shared را در assets کپی کن)
// package com.smh.tabrik
import android.os.Bundle; import android.webkit.*; import androidx.appcompat.app.AppCompatActivity
class MainActivity : AppCompatActivity() {
  override fun onCreate(s: Bundle?) { super.onCreate(s)
    val w = WebView(this)
    w.settings.javaScriptEnabled = true; w.settings.domStorageEnabled = true
    w.settings.mediaPlaybackRequiresUserGesture = false; w.settings.allowFileAccess = true
    w.webViewClient = WebViewClient(); w.webChromeClient = WebChromeClient()
    w.loadUrl("file:///android_asset/shared/index.html"); setContentView(w)
  }
  override fun onBackPressed() { /* اگر WebView قابل برگشت بود برگرد */ super.onBackPressed() }
}
