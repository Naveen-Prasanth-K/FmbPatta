import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react';
import FMBSketchScript from './FMBSketchScript';
import { WebView } from 'react-native-webview';

export default function FMBSketch({ route }) {

  const { data } = route.params;
  const webviewRef = useRef(null);
  const dynamicScript = FMBSketchScript(data);

  const handleWebViewMessage = (event) => {
    console.log('Message from WebView:', event.nativeEvent.data);
  };

  //   const script = `
  //   (function() {
  //     function sendMessageToReactNative(message) {
  //       window.ReactNativeWebView.postMessage(message);
  //     }

  //     function closeModal() {
  //       const closeButton = document.querySelector('button[data-dismiss="modal"]');
  //       if (closeButton) {
  //         closeButton.click();
  //         sendMessageToReactNative('Modal closed');
  //       }
  //     }

  //     function clickEnglishButton() {
  //       const englishButton = document.querySelector('a.dropbtn[href="index.html"]');
  //       if (englishButton) {
  //         englishButton.click();
  //         sendMessageToReactNative('English button clicked');
  //       }
  //     }

  //     function clickFmbLink() {
  //       const fmbLink = document.querySelector('a[href*="land/chittaCheckNewRuralFMB_en.html"]');
  //       if (fmbLink) {
  //         fmbLink.click();
  //         sendMessageToReactNative('FMB Sketch link clicked');
  //       }
  //     }

  //     function selectDistrict() {
  //         const districtDropdown = document.querySelector("#districtCode");
  //         if (districtDropdown) {
  //             districtDropdown.value = '${data.districtId}';
  //             const changeEvent = new Event("change", { bubbles: true });
  //             districtDropdown.dispatchEvent(changeEvent);
  //           sendMessageToReactNative("District selected: ${data.districtName}");
  //         } else {
  //             sendMessageToReactNative('District dropdown not found');
  //         }
  //     }

  //     function selectTaluk() {
  //       const talukDropdown = document.querySelector("#talukCode");
  //       if (talukDropdown) {
  //         talukDropdown.value = '${data.talukId}/Y';
  //         const changeEvent = new Event("change", { bubbles: true });
  //         talukDropdown.dispatchEvent(changeEvent);
  //       // sendMessageToReactNative("Taluk selected: 33/Y");
  //          sendMessageToReactNative("Taluk selected: ${data.talukName}/Y");
  //       } else {
  //         sendMessageToReactNative("Taluk dropdown not found"); 
  //       }
  //     }

  //     function selectVillage() {
  //       const villageDropdown = document.querySelector("#villageCode");
  //       if (villageDropdown) {
  //         villageDropdown.value = '${data.villageId}';
  //         const changeEvent = new Event("change", { bubbles: true });
  //         villageDropdown.dispatchEvent(changeEvent);
  //        sendMessageToReactNative("Village selected: ${data.villageName}");
  //       } else {
  //         sendMessageToReactNative("Village dropdown not found");
  //       }
  //     }

  //     function checkLandTypeCheckbox() {
  //       const landTypeCheckbox = document.querySelector("#landtype");
  //       if (landTypeCheckbox) {
  //         landTypeCheckbox.checked = true;
  //         sendMessageToReactNative("Land Type checkbox checked.");
  //       } else {
  //         sendMessageToReactNative("Land Type checkbox not found");
  //       }
  //     }

  //     function inputSurveyNo() {
  //       const surveyNoInput = document.querySelector("#surveyNo");
  //       if (surveyNoInput) {
  //         surveyNoInput.value = '24';
  //         sendMessageToReactNative("Survey Number inputted: 24");
  //         const event = new Event('change', { bubbles: true });
  //         surveyNoInput.dispatchEvent(event);
  //       } else {
  //         sendMessageToReactNative("Survey Number input not found");
  //       }
  //     }

  //     function selectSubDivision() {
  //       const subDivisionDropdown = document.querySelector("#subdivNo");
  //       if (subDivisionDropdown) {
  //         subDivisionDropdown.value = '1';
  //         const event = new Event('change', { bubbles: true });
  //         subDivisionDropdown.dispatchEvent(event);
  //         sendMessageToReactNative("Sub Division selected: 1");
  //       } else {
  //         sendMessageToReactNative("Sub Division dropdown not found");
  //       }
  //     }

  //     function inputMobileNumber() {
  //       const mobileInput = document.querySelector("#mobileno");
  //       if (mobileInput) {
  //         mobileInput.value = '8940352877';
  //         sendMessageToReactNative("Mobile number inputted: 1234567890");
  //         const event = new Event('change', { bubbles: true });
  //         mobileInput.dispatchEvent(event);
  //       } else {
  //         sendMessageToReactNative("Mobile number input not found");
  //       }
  //     }

  //     function clickGetOTPButton() {
  //       const otpButton = document.getElementById("sendtpid");
  //       if (otpButton) {
  //         otpButton.click();
  //         sendMessageToReactNative("Get OTP button clicked");
  //       } else {
  //         sendMessageToReactNative("Get OTP button not found");
  //       }
  //     }

  //     // Flow of operations
  //     closeModal();
  //     setTimeout(() => {
  //       clickEnglishButton();
  //       setTimeout(() => {
  //         clickFmbLink();
  //         setTimeout(() => {
  //           selectDistrict();
  //           setTimeout(() => {
  //             selectTaluk();
  //             setTimeout(() => {
  //               selectVillage();
  //               // checkLandTypeCheckbox();
  //               setTimeout(() => {
  //                 inputSurveyNo();
  //                 setTimeout(() => {
  //                   selectSubDivision();
  //                   inputMobileNumber();
  //                  // clickGetOTPButton();
  //                 }, 1000);
  //               }, 1000);
  //             }, 1000);
  //           }, 1000);
  //         }, 1000); // Wait for the FMB page to load
  //       }, 1000); // Wait for the English page to load5
  //     }, 1000); // Initial delay for modal close2
  //   })();
  //   true;
  // `;
  const script = `
  (function() {
    function sendMessageToReactNative(message) {
      window.ReactNativeWebView.postMessage(message);
    }

    function closeModal() {
      const closeButton = document.querySelector('button[data-dismiss="modal"]');
      if (closeButton) {
        closeButton.click();
        sendMessageToReactNative('Modal closed');
      }
    }

    function clickEnglishButton() {
      const englishButton = document.querySelector('a.dropbtn[href="index.html"]');
      if (englishButton) {
        englishButton.click();
        sendMessageToReactNative('English button clicked');
      } else {
        // Retry logic if the button is not available yet
        waitForElement('.dropbtn[href="index.html"]', clickEnglishButton);
      }
    }

    function clickFmbLink() {
      const fmbLink = document.querySelector('a[href*="land/chittaCheckNewRuralFMB_en.html"]');
      if (fmbLink) {
        fmbLink.click();
        sendMessageToReactNative('FMB Sketch link clicked');
      }
    }

    function selectDistrict() {
      const districtDropdown = document.querySelector("#districtCode");

      // Check if the dropdown exists
      if (districtDropdown) {
        // Wait for options to be populated
        const waitForOptions = setInterval(() => {
          const options = districtDropdown.querySelectorAll('option');
          
          if (options.length > 1) { // If options are rendered (exclude default "Please Select")
            // Set the value to '10' to select Erode
            districtDropdown.value = '10';

            // Trigger the 'change' event programmatically to notify the system
            const changeEvent = new Event("change", { bubbles: true });
            districtDropdown.dispatchEvent(changeEvent);

            // Disable the dropdown to prevent user modification
            districtDropdown.disabled = true;

            sendMessageToReactNative("District selected: Erode");

            // Clear the interval once the selection is made
            clearInterval(waitForOptions);
          }
        }, 100); // Check every 100ms if the options are available
      } else {
        sendMessageToReactNative('District dropdown not found');
      }
    }

    function selectTaluk() {
      const talukDropdown = document.querySelector("#talukCode");

      // Check if the dropdown exists
      if (talukDropdown) {
        // Wait for options to be populated
        const waitForOptions = setInterval(() => {
          const options = talukDropdown.querySelectorAll('option');
          
          if (options.length > 1) { // If options are rendered (exclude default "Please Select..." option)
            // Set the value to '33/Y' to select the desired taluk
            talukDropdown.value = '33/Y';

            // Trigger the 'change' event programmatically to notify the system
            const changeEvent = new Event("change", { bubbles: true });
            talukDropdown.dispatchEvent(changeEvent);

            sendMessageToReactNative("Taluk selected: 33/Y");

            // Clear the interval once the selection is made
            clearInterval(waitForOptions);
          }
        }, 100); // Check every 100ms if the options are available
      } else {
        sendMessageToReactNative("Taluk dropdown not found"); 
      }
    }

    function selectVillage() {
      const villageDropdown = document.querySelector("#villageCode");

      // Check if the dropdown exists
      if (villageDropdown) {
        // Wait for options to be populated
        const waitForOptions = setInterval(() => {
          const options = villageDropdown.querySelectorAll('option');
          
          if (options.length > 1) { // If options are rendered (exclude default "Please Select..." option)
            // Set the value for the desired village (replace '028' with the actual village value)
            villageDropdown.value = '028';

            // Trigger the 'change' event programmatically to notify any action
            const changeEvent = new Event("change", { bubbles: true });
            villageDropdown.dispatchEvent(changeEvent);

            sendMessageToReactNative("Village selected: 028");

            // Clear the interval once the selection is made
            clearInterval(waitForOptions);

            // After selecting Village, input Survey No.
            inputSurveyNo();

            selectSubDivision();

          }
        }, 100); // Check every 100ms if the options are available
      } else {
        sendMessageToReactNative("Village dropdown not found");
      }
    }
    
    function inputSurveyNo() {
      const surveyNoInput = document.querySelector("#surveyNo");
      if (surveyNoInput) {
        surveyNoInput.value = '24'; // Survey number to input
        sendMessageToReactNative("Survey Number inputted: 24");

        // Trigger the 'change' event if necessary
        const event = new Event('change', { bubbles: true });
        surveyNoInput.dispatchEvent(event);
      } else {
        sendMessageToReactNative("Survey Number input not found");
      }
    }

    function selectSubDivision() {
      // Get the Sub Division dropdown element by its ID (assuming ID is 'subdivNo')
      const subDivisionDropdown = document.querySelector("#subdivNo");

      // Check if the dropdown exists
      if (subDivisionDropdown) {
        const waitForOptions = setInterval(() => {
          const options = subDivisionDropdown.querySelectorAll('option');
          if (options.length > 1) {
            // Set the value to '-' (or the desired value)
            subDivisionDropdown.value = '-';

            // Trigger the 'change' event programmatically to call any onchange handlers
            const changeEvent = new Event('change', { bubbles: true });
            subDivisionDropdown.dispatchEvent(changeEvent);

            sendMessageToReactNative("Sub Division selected: -");
            clearInterval(waitForOptions); // Stop the interval after successful selection

            inputMobileNumber();

            // clickGetOTPButton();
          }
        }, 100);
      } else {
        sendMessageToReactNative("Sub Division dropdown not found");
      }
    }

    function inputMobileNumber() {
      // Get the input element by its ID (assuming ID is 'mobileNumber')
      const mobileInput = document.querySelector("#mobileno");

      // Check if the input element exists
      if (mobileInput) {
        // Set the value to a sample mobile number
        mobileInput.value = '8248184368';  // Change this to the desired mobile number

        sendMessageToReactNative("Mobile number inputted: 8248184368");

        // Trigger the 'change' event to ensure any onchange function is executed
        const event = new Event('change', { bubbles: true });
        mobileInput.dispatchEvent(event);
      } else {
        sendMessageToReactNative("Mobile number input not found");
      }
    }

    function clickGetOTPButton() {
      // Get the button element by its ID
      const otpButton = document.getElementById("sendtpid");

      // Check if the button exists
      if (otpButton) {
        // Trigger the 'click' event
        otpButton.click();
        sendMessageToReactNative("Get OTP button clicked");
      } else {
        sendMessageToReactNative("Get OTP button not found");
      }
    }

    function waitForElement(selector, callback) {
      const observer = new MutationObserver(function(mutationsList, observer) {
        if (document.querySelector(selector)) {
          callback();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // Flow of operations
    closeModal();

    // Wait for the "English" button to be available and then click it
    waitForElement('a.dropbtn[href="index.html"]', clickEnglishButton);

    // After clicking the English button, wait for the FMB link to be available and then click it
    waitForElement('a[href*="land/chittaCheckNewRuralFMB_en.html"]', clickFmbLink);

    // After clicking the FMB link, wait for the district dropdown to be available and select 'Erode'
    waitForElement('#districtCode', selectDistrict);

    // After clicking the FMB link, wait for the taluk dropdown to be available and select 'Bhavani'
    waitForElement('#talukCode', selectTaluk);

    // After clicking the FMB link, wait for the village dropdown to be available and select 'Alanthur'
    waitForElement('#villageCode', selectVillage);

  })();
  true;
`;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://eservices.tn.gov.in/eservicesnew/home.html' }}
        style={{ flex: 1 }}
        injectedJavaScript={script}
        onMessage={handleWebViewMessage}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});