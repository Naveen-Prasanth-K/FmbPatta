import { View, Text } from 'react-native'
import React from 'react'

export default function FMBSketchScript(data) {

  console.log(`data = ${JSON.stringify(data)}`);

  return `
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
    if (districtDropdown) {
        districtDropdown.value = '${data.districtId}';
        const changeEvent = new Event("change", { bubbles: true });
        districtDropdown.dispatchEvent(changeEvent);
        sendMessageToReactNative("District selected: ${data.districtName}");
    } else {
        sendMessageToReactNative('District dropdown not found');
    }
  }

  function selectTaluk() {
    const talukDropdown = document.querySelector("#talukCode");
    if (talukDropdown) {
      talukDropdown.value = '${data.talukId}';
      const changeEvent = new Event("change", { bubbles: true });
      talukDropdown.dispatchEvent(changeEvent);
      sendMessageToReactNative("Taluk selected: ${data.talukName}");
    } else {
      sendMessageToReactNative("Taluk dropdown not found"); 
    }
  }

  function selectVillage() {
    const villageDropdown = document.querySelector("#villageCode");
    if (villageDropdown) {
      villageDropdown.value = '${data.villageId}';
      const changeEvent = new Event("change", { bubbles: true });
      villageDropdown.dispatchEvent(changeEvent);
      sendMessageToReactNative("Village selected: ${data.villageName}");
    } else {
      sendMessageToReactNative("Village dropdown not found");
    }
  }

  function checkLandTypeCheckbox() {
    const landTypeCheckbox = document.querySelector("#landtype");
    if (landTypeCheckbox) {
      landTypeCheckbox.checked = true;
      sendMessageToReactNative("Land Type checkbox checked.");
    } else {
      sendMessageToReactNative("Land Type checkbox not found");
    }
  }

  function inputSurveyNo() {
    const surveyNoInput = document.querySelector("#surveyNo");
    if (surveyNoInput) {
      surveyNoInput.value = '24';
      sendMessageToReactNative("Survey Number inputted: 24");
      const event = new Event('change', { bubbles: true });
      surveyNoInput.dispatchEvent(event);
    } else {
      sendMessageToReactNative("Survey Number input not found");
    }
  }

  function selectSubDivision() {
    const subDivisionDropdown = document.querySelector("#subdivNo");
    if (subDivisionDropdown) {
      subDivisionDropdown.value = '1';
      const event = new Event('change', { bubbles: true });
      subDivisionDropdown.dispatchEvent(event);
      sendMessageToReactNative("Sub Division selected: 1");
    } else {
      sendMessageToReactNative("Sub Division dropdown not found");
    }
  }

  function inputMobileNumber() {
    const mobileInput = document.querySelector("#mobileno");
    if (mobileInput) {
      mobileInput.value = '8940352877';
      sendMessageToReactNative("Mobile number inputted: 1234567890");
      const event = new Event('change', { bubbles: true });
      mobileInput.dispatchEvent(event);
    } else {
      sendMessageToReactNative("Mobile number input not found");
    }
  }

  function clickGetOTPButton() {
    const otpButton = document.getElementById("sendtpid");
    if (otpButton) {
      otpButton.click();
      sendMessageToReactNative("Get OTP button clicked");
    } else {
      sendMessageToReactNative("Get OTP button not found");
    }
  }

  // Flow of operations
  closeModal();
  setTimeout(() => {
    // clickEnglishButton();
    setTimeout(() => {
      clickFmbLink();
      setTimeout(() => {
        selectDistrict();
        setTimeout(() => {
          selectTaluk();
          setTimeout(() => {
            selectVillage();
            // checkLandTypeCheckbox();
            setTimeout(() => {
              inputSurveyNo();
              setTimeout(() => {
                selectSubDivision();
                inputMobileNumber();
                clickGetOTPButton();
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000); // Wait for the FMB page to load
    }, 1000); // Wait for the English page to load5
  }, 1000); // Initial delay for modal close2
})();
true;`;
}
