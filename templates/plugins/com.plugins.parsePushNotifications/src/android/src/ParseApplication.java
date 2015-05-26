package com.viceversa.parsePushNotifications;

import android.app.Application;
import com.parse.Parse;
import com.parse.ParseCrashReporting;
import com.parse.ParseInstallation;
import com.parse.PushService;
import android.content.Context;
// retrieve keystore
import android.util.Log;
import java.security.MessageDigest;
import android.content.pm.Signature;
import android.util.Base64;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import java.lang.Exception;
import java.security.NoSuchAlgorithmException;
import android.content.pm.PackageInfo;

import com.parse.ParseObject;
import com.parse.SaveCallback;
import com.parse.ParseException;

/*TWITTER*/
import io.fabric.sdk.android.Fabric;
import com.twitter.sdk.android.Twitter;
import com.twitter.sdk.android.core.TwitterAuthConfig;
/*FLURRY*/
import com.flurry.android.FlurryAgent;

import android.content.pm.PackageManager;
import android.content.pm.PackageInfo;

import com.viceversa.parsePushNotifications.PushHandlerActivity;

public class ParseApplication extends Application {

	private static ParseApplication instance = new ParseApplication();

	public static Context getContext() {
		return instance;
	}
	public Context getApplicationContext() {
		return instance;
	}

    private String getKey(String keyName) {
        int id = getResources().getIdentifier(keyName, "string", getPackageName());
        return getString(id);
    }

    public ParseApplication(){
        super();
        instance = this;
    }

    public void saveEventually(ParseObject obj) {
       obj.saveEventually(new SaveCallback() {
            public void done(ParseException e) {
                Log.v("VICEVERSAT", "done");
                if (e == null) {
                    Log.v("VICEVERSAT", "success");
                } else {
                    Log.v("VICEVERSAT", "error");
                }
            } 
        });
    }
    public void onCreate(){
        String KEYSTORETAG = "VICEVERSAT";
        PackageInfo info;
        try {
            String appId = getKey("app_id");
            String clientId = getKey("client_id");
            String flurryId = getKey("flurry_id");
            // TWITTER
            TwitterAuthConfig authConfig = new TwitterAuthConfig("LTK8UNgtf2vLSvZlccOyYcvfO", "hgvj4LwJBqgltR3ekrJkIiaLuNSw4AYvzGt7Esv10oh13ZEcx3");
            Fabric.with(this, new Twitter(authConfig));
            // FLURRY
            FlurryAgent.init(this, flurryId);
            // PARSE
            Log.e(KEYSTORETAG,"oncreate Application");
            ParseCrashReporting.enable(this);
            Parse.initialize(this, appId, clientId);
            PushService.setDefaultPushCallback(this, PushHandlerActivity.class);
            ParseInstallation.getCurrentInstallation().saveInBackground();
        } catch (Exception e) {
            Log.e(KEYSTORETAG, e.toString());
        }
    }
}
