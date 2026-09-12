package com.smh.tabrik.bazaar;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * پل پرداخت کافه‌بازار.
 * گام اتصال (در android/settings.gradle و build.gradle وابستگی Poolakey اضافه شود):
 *   docs: https://github.com/cafebazaar/Poolakey
 *
 *  1) Payment را با همین packageName و امضای keystore ثبت‌شده در پیشخوان بساز.
 *  2) purchaseProduct(productId) ← شناسه‌های واقعی پنل (vip_monthly/...)
 *  3) بعد از موفقیت: consume (مصرفی) یا acknowledge (اشتراک/غیرمصرفی) + بفرست به سرور برای Verify.
 *  4) نتیجه را با call.resolve({ok:true}) برگردان تا JS پرمیوم را باز کند.
 */
@CapacitorPlugin(name = "BazaarBilling")
public class BazaarBillingPlugin extends Plugin {

    @PluginMethod
    public void purchase(PluginCall call) {
        String productId = call.getString("productId", "");
        // TODO: اتصال Poolakey — نمونه:
        // payment.purchaseProduct(getActivity(), productId, "payload-" + System.currentTimeMillis(), null,
        //   new PurchaseListener() {
        //     public void onSuccess(...) { JSObject r = new JSObject(); r.put("ok", true); call.resolve(r); }
        //     public void onFailure(...) { call.reject("PURCHASE_FAILED"); }
        //   });
        call.reject("NOT_WIRED_YET");
    }

    @PluginMethod
    public void ownedPurchases(PluginCall call) {
        // TODO: getPurchasedProducts → برگرداندن لیست خریدهای فعال برای بازیابی پرمیوم
        JSObject r = new JSObject();
        r.put("products", new com.getcapacitor.JSArray());
        call.resolve(r);
    }
}
