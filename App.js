import { StyleSheet, Text, View, Button, Alert, Platform } from 'react-native';
import qs from 'qs';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview';

export default function App() {

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