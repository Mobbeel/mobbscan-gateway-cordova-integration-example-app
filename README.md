<p align="center">
  <a href="http://mobbeel.com">
    <img src="https://www.mobbeel.com/wp-content/uploads/2018/08/logo-mobbeel.png" width="350px">
  </a>
  <p align="center" style="font-size:180%;">Mobbeel Mobbscan Gateway iframe integration for Cordova</p>
</p>

[<img src="https://img.shields.io/hexpm/l/plug.svg">](https://raw.githubusercontent.com/Mobbeel/fataar-gradle-plugin/master/LICENSE)

---

## Index

- [Prerequisites](#prerequisites)
  - [Camera permissions](#camera-permissions)
    - [iOS](#ios)
    - [Android](#android)
  - [iOS Camera configuration](#ios-camera-configuration)
  - [Allow Navigation - Allow Intents](#allow-navigation---allow-intents)
  - [Config Security Policy (CSP)](#config-security-policy-csp)
- [Example of use](#example-of-use)

---

## Prerequisites

### Camera permissions

Mobbscan Gateway requires camera permissions to be able to scan documents and faces.

Cordova provides several ways to request permissions. In this example, we will use the [cordova.plugins.diagnostic](https://github.com/dpa99c/cordova-diagnostic-plugin). However, you can use any other plugin or method to request permissions.

#### iOS

iOS requires some additional explanations to request permissions. You need to add the following lines to the `config.xml` file.

```xml
<platform name="ios">
	<edit-config target="NSCameraUsageDescription" file="*-Info.plist" mode="merge">
		<string>need camera access to take pictures</string>
	</edit-config>
	<edit-config target="NSPhotoLibraryUsageDescription" file="*-Info.plist" mode="merge">
		<string>need photo library access to get pictures from there</string>
	</edit-config>
	<edit-config target="NSLocationWhenInUseUsageDescription" file="*-Info.plist" mode="merge">
		<string>need location access to find things nearby</string>
	</edit-config>
	<edit-config target="NSPhotoLibraryAddUsageDescription" file="*-Info.plist" mode="merge">
		<string>need photo library access to save pictures there</string>
	</edit-config>
</platform>
```

#### Android

Android requires the following permissions to be added to the `config.xml` file.

```xml
<platform name="android">
  <config-file target="AndroidManifest.xml" parent="/manifest">
	<uses-feature android:name="android.hardware.camera" android:required="true" />
	<uses-permission android:name="android.permission.CAMERA" />
	<uses-permission android:name="android.permission.INTERNET" />
	<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
	<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
	<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
	<uses-permission android:name="android.permission.RECORD_AUDIO" />
	<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  </config-file>
</platform>
```

<br />
This example contains a basic implementation for requesting camera permissions:

```javascript
function onDeviceReady() {
  checkCameraPermission(); // On app start, check camera permission
}

function checkCameraPermission() {
  cordova.plugins.diagnostic.getCameraAuthorizationStatus(
    (status) => {
      switch (status) {
        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
          console.log("Permission granted to use the camera");
          break;
        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
          console.log(
            "Permission to use the camera has not been requested yet"
          );
          requestCameraPermission();
          break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED:
          console.log("Permission denied to use the camera - ask again?");
          break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
          console.log(
            "Permission permanently denied to use the camera - guess we won't be using it then!"
          );
          break;
        default:
          break;
      }
    },
    (error) => {
      console.error(`The following error occurred: ${error}`);
    },
    false
  );
}

function requestCameraPermission() {
  cordova.plugins.diagnostic.requestCameraAuthorization(
    (status) => {
      switch (status) {
        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
          console.log("Permission granted to use the camera");
          break;
        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
          console.log(
            "Permission to use the camera has not been requested yet"
          );
          break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED:
          console.log("Permission denied to use the camera - ask again?");
          break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
          console.log(
            "Permission permanently denied to use the camera - guess we won't be using it then!"
          );
          break;
        default:
          break;
      }
    },
    (error) => {
      console.error(`The following error occurred: ${error}`);
    },
    false
  );
}
```

### iOS Camera configuration

iOs requires an additional configuration to allow the camera to be used. You need to add the following lines to the `config.xml` file.

```xml
<platform name="ios">
	<preference name="AllowInlineMediaPlayback" value="true" />
</platform>
```

### Allow Navigation - Allow Intents

For allowing the iframe to be displayed in the Cordova app, you need to add the Mobbscan Gateway URL to the `config.xml` file.

```xml
<allow-intent href="http://*/*" />
<allow-intent href="https://*/*" />
<allow-navigation href="{{ONBOARDING_URL}}/*/*" />
<allow-navigation href="about:*" />
```

### Config Security Policy (CSP)

In order to allow the iframe to be displayed in the Cordova app, you need to add the following CSP to the `index.html` file.

```html
<meta
  http-equiv="Content-Security-Policy"
  content=" ... ; frame-src 'self' {{ONBOARDING_URL}}; ... "
/>
```

---

## Example of use

### 1. Add the iframe to the `index.html` file

```html
<iframe
  allow="camera; microphone"
  id="mobbscan-iframe"
  src="{{ONBOARDING_URL}}"
></iframe>
```

### 2. When the iframe is loaded, you can listen for events from the iframe

```javascript
// Allow window to listen for a postMessage
window.addEventListener("message", (event) => {
  // Always verify the sender's identity using the origin and source properties to avoid security leaks
  if (event.origin !== onboardingUrl) return;

  const { onboarding, type, value } = event.data; // onboarding contains onboardingToken, returnUrl and scanId

  const { name } = value; // Info type

  if (type === "Info") {
    switch (name) {
      case "OnboardingStarted":
        // The onboarding process has started
        break;
      case "OnboardingFinished":
        // The onboarding process has finished
        break;
    }
  }
});
```

</br>

---

> You can find a complete basic example in the `www/index.html` and `www/js/index.js` files.
