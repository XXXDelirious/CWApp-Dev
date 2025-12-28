package com.alphaaid.logger;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class CWLoggerModule extends ReactContextBaseJavaModule {

    public CWLoggerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "CWLogger";
    }

    @ReactMethod
    public void log(String level, String screen, String message, String json) {
        switch (level) {
            case "i":
                CWLogger.i(screen, message, json);
                break;
            case "w":
                CWLogger.w(screen, message, json);
                break;
            case "e":
                CWLogger.e(screen, message, json);
                break;
            default:
                CWLogger.d(screen, message, json);
                break;
        }
    }

    @ReactMethod
    public void setEnabled(boolean enabled) {
        CWLogger.setEnabled(enabled);
    }
}
