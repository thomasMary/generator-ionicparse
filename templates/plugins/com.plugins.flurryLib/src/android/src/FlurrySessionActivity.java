package com.viceversa.flurryLib;

import java.util.Set;

import android.app.Activity;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;

import com.flurry.android.FlurryAgent;

import android.content.pm.PackageManager;
import android.content.pm.PackageInfo;

public class FlurrySessionActivity extends Activity {
    public static final String TAG = "VICEVERSAT";

    private String getKey() {
        int id = getResources().getIdentifier("flurry_id", "string", getPackageName());
        return getString(id);
    }

    @Override
    protected void onStart() {
        super.onStart();
        String key = this.getKey();
        Log.v(TAG, "onStart: " + key);
        FlurryAgent.onStartSession(this, key);
    }

    @Override
    protected void onStop() {
        super.onStop();
        Log.v(TAG, "onStop");   
        FlurryAgent.onEndSession(this);
    }

}
