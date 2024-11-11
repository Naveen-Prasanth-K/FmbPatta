import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import axios from 'axios';
// import { fetch } from 'react-native-ssl-pinning';

export default function App() {

  const onPressLearnMore = async () => {
    await fetch('https://collabland-tn.gov.in/rest/Collabland/FMBMapServicePDF', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-GB,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        // 'cookie': 'JSESSIONID=B5480F877984C947A124CA0020C5107D.instance6', // Uncomment if necessary
        'origin': 'https://collabland-tn.gov.in',
        'priority': 'u=1, i',
        // 'referer': 'https://collabland-tn.gov.in/FMBMapService.jsp', // Uncomment if necessary
        'sec-ch-ua': '"Chromium";v="125", "Not.A/Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',

      },
      body: JSON.stringify({
        'state': '33',
        'giscode': "10144041205",
        'plotno': '',
        'scale': '0',
        'width': '210',
        'height': '297',
        'localLang': 'false'
      }),
      // sslPinning: {
      //   certs: ["sha256//r8udi/Mxd6pLO7y7hZyUMWq8YnFnIWXCqeHsTDRqy8=",
      //     "sha256/YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg=",
      //     "sha256/Vjs8r4z+80wjNcr1YKepWQboSIRi63WsWXhIMN+eWys="
      //   ]
      // },
      timeoutInterval: 10000 // Set timeout for the request if needed
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  // const onPressLearnMore = () => {
  //   const headers = {
  //     'accept': '*/*',
  //     'accept-language': 'en-GB,en;q=0.9',
  //     //'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  //     'content-type': 'application/json',
  //     // 'cookie': 'JSESSIONID=B5480F877984C947A124CA0020C5107D.instance6', // Uncomment if necessary
  //     'origin': 'https://collabland-tn.gov.in',
  //     'priority': 'u=1, i',
  //     // 'referer': 'https://collabland-tn.gov.in/FMBMapService.jsp', // Uncomment if necessary
  //     'sec-ch-ua': '"Chromium";v="125", "Not.A/Brand";v="24"',
  //     'sec-ch-ua-mobile': '?0',
  //     'sec-ch-ua-platform': '"Windows"',
  //     'sec-fetch-dest': 'empty',
  //     'sec-fetch-mode': 'cors',
  //     'sec-fetch-site': 'same-origin',
  //     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  //     'x-requested-with': 'XMLHttpRequest',
  //   };
  //   const data = new URLSearchParams({
  //     'state': '33',
  //     'giscode': "10144041205",
  //     'plotno': '',
  //     'scale': '0',
  //     'width': '210',
  //     'height': '297',
  //     'localLang': 'false'
  //   });

  //   axios.post(
  //     'https://collabland-tn.gov.in/rest/Collabland/FMBMapServicePDF',
  //     data,
  //     {
  //       headers: headers,
  //       //httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Disable SSL verification
  //       // Axios in React Native does not directly support httpsAgent.
  //       // SSL pinning is recommended instead if SSL issues arise (see below).
  //     }
  //   )
  //     .then(response => {
  //       console.log(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  // }

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
