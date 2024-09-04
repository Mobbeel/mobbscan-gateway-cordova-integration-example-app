/* eslint-disable no-console, no-undef */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

document.addEventListener("deviceready", onDeviceReady, false);

// Allow window to listen for a postMessage
window.addEventListener("message", onGatewayMessage);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!
  document.getElementById("deviceready").classList.add("ready");

  checkCameraPermission();
}

function onGatewayMessage(event) {
  // Always verify the sender's identity using the origin and source properties to avoid security leaks

  if (event.origin !== "{{{{ONBOARDING_URL}}}}") return;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onboarding, type, value } = event.data; // onboarding contains onboardingToken, returnUrl and scanId

  const { name } = value; // Info type

  const onboardingStatus = document.getElementById("onboarding-status");
  const onboardingError = document.getElementById("onboarding-error");

  if (type === "Info") {
    switch (name) {
      case "OnboardingStarted":
        // The onboarding process has started
        onboardingStatus.innerText = "Onboarding Started";

        break;
      case "OnboardingFinished":
        // The onboarding process has finished
        onboardingStatus.innerText = "Onboarding Finished";
        break;
      default:
        break;
    }
    onboardingStatus.classList.add("blink");
  }

  if (type === "Error") {
    onboardingError.innerText = `${value.message}${
      value.extrainfo ? `: ${JSON.stringify(value.extrainfo)}` : ""
    }`;
    onboardingError.classList.add("blink");
  }
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
