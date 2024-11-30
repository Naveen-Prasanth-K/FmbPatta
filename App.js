import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NativeStackNav from './src/Navigation/NativeStackNav';
import Loader from './src/Utilities/Constants/Loader';
import Store from './src/Utilities/Store/Store';
import { observer } from 'mobx-react';
import React, { useRef } from 'react';

const App = () => {

  return (
    <>
      <View style={styles.container} >
        <StatusBar style='dark' />
        <Loader visible={Store?.mainLoader} />
        <NativeStackNav />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default observer(App)


