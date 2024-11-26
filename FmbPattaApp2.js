import { StyleSheet, Text, View, Button, Alert, Platform } from 'react-native';
import qs from 'qs';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview';

export default function App() {
    const onPressLearnMore = async () => {
        try {
            // Show loading indicator
            Alert.alert('Downloading...', 'Please wait while we download your PDF');

            const formData = {
                'state': '33',
                'giscode': 'S0809011169',
                'plotno': '',
                'scale': '0',
                'width': '210',
                'height': '297',
                'localLang': 'false'
            };

            const response = await fetch(
                'https://collabland-tn.gov.in/APIServices/rest/Collabland/FMBMapServicePDF',
                {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Connection': 'keep-alive',
                        'User-Agent': Platform.select({
                            android: 'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86)',
                            ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
                        }),

                    },
                    body: qs.stringify(formData)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const base64String = data.success;

            if (base64String) {
                // For Android, we'll use the cache directory
                const path = Platform.OS === 'android'
                    ? `${FileSystem.cacheDirectory}test1.pdf`
                    : `${FileSystem.documentDirectory}test1.pdf`;

                await FileSystem.writeAsStringAsync(path, base64String, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                Alert.alert('PDF saved!', 'The PDF has been saved successfully.');

                if (await Sharing.isAvailableAsync()) {
                    try {
                        await Sharing.shareAsync(path, {
                            mimeType: 'application/pdf',
                            UTI: 'com.adobe.pdf',
                            dialogTitle: 'Open PDF with...'
                        });
                    } catch (shareError) {
                        console.error('Sharing error:', shareError);
                        Alert.alert('Sharing failed', 'Could not share the PDF file');
                    }
                } else {
                    Alert.alert('Sharing not available', 'Sharing is not supported on this device');
                }
            } else {
                Alert.alert('Error', 'Received empty data from the server.');
            }
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });

            Alert.alert(
                'Error',
                Platform.select({
                    android: `Download failed: ${error.message}`,
                    ios: 'Failed to fetch and save the PDF.'
                })
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* <Button
        onPress={onPressLearnMore}
        title="Download Fmb"
      /> */}
            <WebView
                source={{ uri: 'https://reactnative.dev/' }}
                style={{ flex: 1 }}
                injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.1, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
});