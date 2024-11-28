import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {

  const webviewRef = useRef(null);

  // JavaScript to close the modal, click the "English" button, click the specified link, and select the district
  const script = `
  (function() {
    function closeModal() {
      const closeButton = document.querySelector('button[data-dismiss="modal"]');
      if (closeButton) {
        closeButton.click();
        console.log('Modal closed');
      }
    }

    function clickEnglishButton() {
      const englishButton = document.querySelector('a.dropbtn[href="index.html"]');
      if (englishButton) {
        englishButton.click();
        console.log('English button clicked');
      }
    }

    function clickFmbLink() {
      const fmbLink = document.querySelector('a[href*="land/chittaCheckNewRuralFMB_en.html"]');
      if (fmbLink) {
        fmbLink.click();
        console.log('FMB Sketch link clicked');
      }
    }

    function selectDistrict() {
      const districtDropdown = document.getElementById('districtCode');
      if (districtDropdown) {
        districtDropdown.value = '10'; // Select Erode (value 10)
        const event = new Event('change', { bubbles: true });
        districtDropdown.dispatchEvent(event);
        console.log('District selected: Erode');
      } else {
        console.log('District dropdown not found');
      }
    }

    // Close the modal
    closeModal();

    // Click the English button after a delay
    setTimeout(function() {
      clickEnglishButton();

      // Click the FMB Sketch link after ensuring the English page has loaded
      setTimeout(function() {
        const checkAndClickFmbLink = setInterval(function() {
          const fmbLink = document.querySelector('a[href*="land/chittaCheckNewRuralFMB_en.html"]');
          if (fmbLink) {
            fmbLink.click();
            console.log('FMB Sketch link clicked');
            clearInterval(checkAndClickFmbLink); // Stop the interval once the link is clicked

            // Select the district after ensuring the FMB page has loaded
            setTimeout(function() {
              selectDistrict();
            }, 5000); // Adjust the delay to ensure the FMB page has loaded
          }
        }, 1000); // Check every 1 second
      }, 5000); // Adjust the delay to ensure the English page has loaded
    }, 2000); // Delay for the English button
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
