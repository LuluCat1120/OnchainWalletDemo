package com.anonymous.OnchainWalletDemoExpo.settings;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = SettingsModule.NAME)
public class SettingsModule extends ReactContextBaseJavaModule {
    public static final String NAME = "SettingsModule";
    private String currentCurrency = "USD";

    public SettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("defaultCurrency", "USD");
        return constants;
    }

    @ReactMethod
    public void getCurrency(Promise promise) {
        promise.resolve(currentCurrency);
    }

    @ReactMethod
    public void setCurrency(String currency, Promise promise) {
        currentCurrency = currency;
        // 发送事件
        sendEvent("onCurrencyChange", currency);
        promise.resolve(currency);
    }

    @ReactMethod
    public void toggleCurrency(Promise promise) {
        if ("USD".equals(currentCurrency)) {
            currentCurrency = "HKD";
        } else {
            currentCurrency = "USD";
        }
        // 发送事件
        sendEvent("onCurrencyChange", currentCurrency);
        promise.resolve(currentCurrency);
    }

    private void sendEvent(String eventName, String currency) {
        Map<String, Object> params = new HashMap<>();
        params.put("currency", currency);
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Keep: Required for RN built in Event Emitter Calls
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Keep: Required for RN built in Event Emitter Calls
    }
} 