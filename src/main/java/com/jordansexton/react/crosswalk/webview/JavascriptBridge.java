package com.jordansexton.react.crosswalk.webview;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.xwalk.core.JavascriptInterface;

class JavascriptBridge {
  private ReactContext context;

  public JavascriptBridge(ReactContext context) {
    this.context = context;
  }

  @JavascriptInterface
  public void send(String message) {
    WritableMap params = Arguments.createMap();
    params.putString("message", message);
    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("crosswalkWebViewBridgeMessage", params);
  }
}
