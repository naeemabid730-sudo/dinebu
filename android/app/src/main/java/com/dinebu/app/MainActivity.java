package com.dinebu.app;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import com.google.firebase.messaging.FirebaseMessaging;
// Import Google Auth Plugin
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Register Google Auth Plugin
        registerPlugin(GoogleAuth.class);

        // 2. Firebase Messaging Token Logic
        FirebaseMessaging.getInstance().getToken()
            .addOnCompleteListener(task -> {
                if (task.isSuccessful()) {
                    String token = task.getResult();
                    Log.d("FCM_TOKEN", "✅ Token: " + token);
                    getSharedPreferences("FCMPrefs", MODE_PRIVATE)
                        .edit()
                        .putString("fcm_token", token)
                        .apply();
                } else {
                    Log.e("FCM_TOKEN", "❌ Token failed: " + task.getException());
                }
            });
    }
}