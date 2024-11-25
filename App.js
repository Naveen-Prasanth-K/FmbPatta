import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';

export default function App() {

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <link rel="stylesheet" href="https://pyscript.net/latest/pyscript.css" />
      <script defer src="https://pyscript.net/latest/pyscript.js"></script>
  </head>
  <body>
      <h1>PyScript in React Native</h1>
      <py-script>
          def greet(name):
              return f"Hello, {name}!"

          name = "React Native"
          result = greet(name)
          print(result)
      </py-script>
  </body>
  </html>
`;



  return (
    <WebView
      style={styles.container}
      // source={{ uri: 'https://expo.dev' }}
      originWhitelist={['*']}
      source={{ html: htmlContent }}
    // style={{ flex: 1 }}

    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
