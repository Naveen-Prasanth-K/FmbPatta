import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {

  const webviewRef = useRef(null);

  // JavaScript to first close the modal and then click the "English" button
  const script = `
    (function() {
      // First, try to close the modal
      const closeButton = document.querySelector('button[data-dismiss="modal"]');
      if (closeButton) {
        closeButton.click();
        console.log('Modal closed');
      }
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
