package com.viceversa.parsePushNotifications;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import com.parse.Parse;
import com.parse.ParseException;
import com.parse.ParseInstallation;
import com.parse.PushService;
import org.json.JSONObject;

public class PushHandlerActivity extends Activity
{
    public static final String TAG = "VICEVERSAT";
    /*
     * this activity will be started if the user touches a notification that we own.
     * We send it's data off to the push plugin for processing.
     * If needed, we boot up the main activity to kickstart the application.
     * @see android.app.Activity#onCreate(android.os.Bundle)
     */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {

        super.onCreate(savedInstanceState);

        Log.v(TAG, "onCreate");

        boolean isPushPluginActive = ParsePushNotificationPlugin.isActive();
        processPushBundle();

        finish();

        if (!isPushPluginActive) {
            forceMainActivityReload();
        }
    }

    /**
     * Takes the pushBundle extras from the intent,
     * and sends it through to the Plugin for processing.
     */
    private void processPushBundle()
    {
        Log.v(TAG, "processPushBundle");
        Bundle extras = getIntent().getExtras();

        if (extras != null)	{
            Log.v(TAG, "processPushBundle1");
            ParsePushNotificationPlugin.NotificationReceived(extras.getString("com.parse.Data"), false);
        } else {
            Log.v(TAG, "processPushBundle2");
        }
    }

    /**
     * Forces the main activity to re-launch if it's unloaded.
     */
    private void forceMainActivityReload()
    {
        PackageManager pm = getPackageManager();
        Intent launchIntent = pm.getLaunchIntentForPackage(getApplicationContext().getPackageName());
        startActivity(launchIntent);
    }

}