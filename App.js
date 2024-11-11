import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import axios from 'axios';
import qs from 'qs'
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// import { fetch } from 'react-native-ssl-pinning';
// Optional if you want to share the file


export default function App() {


  const onPressLearnMore = async () => {

    let data = qs.stringify({
      'state': '33',
      'giscode': 'S0809011169',
      'plotno': '',
      'scale': '0',
      'width': '210',
      'height': '297',
      'localLang': 'false'
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://collabland-tn.gov.in/APIServices/rest/Collabland/FMBMapServicePDF',
      headers: {
        'Host': 'collabland-tn.gov.in',
        'Content-Length': '81',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Ch-Ua': '"Not?A_Brand";v="99", "Chromium";v="130"',
        'Sec-Ch-Ua-Mobile': '?0',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.70 Safari/537.36',
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://collabland-tn.gov.in',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://collabland-tn.gov.in/APIServices/FMBMapService.jsp',
        'Accept-Encoding': 'gzip, deflate, br',
        'Priority': 'u=1, i',
        // 'Cookie': 'JSESSIONID=75868EF473D135614A8F54414E45377D'
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      const base64String = response.data.success; // Assuming this is the base64 string

      if (base64String) {
        // Define the file path
        const path = FileSystem.documentDirectory + "test1.pdf";

        // Write the base64 string to a PDF file
        await FileSystem.writeAsStringAsync(path, base64String, {
          encoding: FileSystem.EncodingType.Base64,
        });

        Alert.alert('PDF saved!', 'The PDF has been saved successfully.');

        // Optional: Share the PDF if supported
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(path, { mimeType: 'application/pdf' });
        } else {
          Alert.alert('Sharing not available', 'Sharing is not supported on this device');
        }
      } else {
        Alert.alert('Error', 'Received empty data from the server.');
      }

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to fetch and save the PDF.');
    }

  }

  return (
    <View style={styles.container}>
      <Button
        onPress={onPressLearnMore}
        title="Download Fmb"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
