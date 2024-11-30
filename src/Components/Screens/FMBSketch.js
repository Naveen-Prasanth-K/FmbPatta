import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react';
import FMBSketchScript from './FMBSketchScript';
import { WebView } from 'react-native-webview';

export default function FMBSketch({ route }) {

    const { data } = route.params;
    console.log(`data = ${JSON.stringify(data)}`);
    const webviewRef = useRef(null);

    console.log('Message from WebView:', data);

    const handleWebViewMessage = (event) => {
        console.log('Message from WebView:', event.nativeEvent.data);
    };

    return (
        <View style={styles.container}>
            <WebView
                //ref={webviewRef}
                source={{ uri: 'https://eservices.tn.gov.in/eservicesnew/home.html' }}
                style={{ flex: 1 }}
                //  injectedJavaScript={FMBSketchScript}
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