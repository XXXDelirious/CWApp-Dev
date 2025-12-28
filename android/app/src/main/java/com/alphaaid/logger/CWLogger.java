package com.alphaaid.logger;

import android.util.Log;

public final class CWLogger {

    private static boolean enabled = true;
    private static final String TAG = "CWApp";

    private CWLogger() {}

    public static void setEnabled(boolean value) {
        enabled = value;
    }

    public static void d(String screen, String message, String json) {
        if (!enabled) return;
        Log.d(TAG, format(screen, message, json));
    }

    public static void i(String screen, String message, String json) {
        if (!enabled) return;
        Log.i(TAG, format(screen, message, json));
    }

    public static void w(String screen, String message, String json) {
        if (!enabled) return;
        Log.w(TAG, format(screen, message, json));
    }

    public static void e(String screen, String message, String json) {
        if (!enabled) return;
        Log.e(TAG, format(screen, message, json));
    }

    private static String format(String screen, String message, String json) {
        if (json == null || json.isEmpty()) {
            return "[" + screen + "] " + message;
        }
        return "[" + screen + "] " + message + " | data=" + json;
    }
}
