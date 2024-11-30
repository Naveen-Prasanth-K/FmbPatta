import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet, BackHandler, Text, useWindowDimensions,
    View
} from 'react-native';
import { Colors } from '../GlobalStyles/Colors';

export default function Loader({ visible = false }) {

    const { width, height } = useWindowDimensions();

    useEffect(() => {
        const handleBackPress = () => true;
        if (visible) {
            BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        }
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [visible]);

    return (
        visible && (
            <View style={[styles.container]}>
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={Colors.activeBlue} />
                    <Text style={{ marginLeft: 10, fontSize: 16 }}>Loading...</Text>
                </View>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    loader: {
        height: 70,
        backgroundColor: Colors.primary50,
        marginHorizontal: 50,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        height: '100%'
    },
});

