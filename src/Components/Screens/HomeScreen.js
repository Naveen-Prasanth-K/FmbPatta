import { StyleSheet, Text, Alert, Image, View, Keyboard, BackHandler, Linking, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { Colors } from '../../Utilities/GlobalStyles/Colors';
import { Button, Icon, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import Store from '../../Utilities/Store/Store';
import { GOOGLE_API_KEY } from '../../Utilities/Constants/Environment';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps';
import { observer } from 'mobx-react';
import * as Location from 'expo-location';
import { Dropdown } from 'react-native-element-dropdown';

const HomeScreen = () => {

    const navigation = useNavigation();
    const [fmbViewStatus, setFmbViewStatus] = useState(false)
    const [isFocused, setIsFocused] = useState(false);
    const [isSatelliteView, setIsSatelliteView] = useState(true);
    const [mapLoading, setMapLoading] = useState(true);
    const [tilesLoading, setTilesLoading] = useState(true);
    const [initialRegion, setInitialRegion] = useState(0.0018)
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showCustomTiles, setShowCustomTiles] = useState(true);
    const [selectedPlace, setSelectedPlace] = useState({ data: null, details: null });
    // const [subDivisionData, setSubDivisionData] = useState([])
    const [regionCoords, setRegionCoords] = useState({
        lat: 11.1271,
        lng: 78.6569,
        latitudeDelta: 0.0018,
        longitudeDelta: 0.0018,
    });
    const [marker, setMarker] = useState({
        lat: 11.1271,
        lng: 78.6569
    });

    const [bodyData, setBodyData] = useState({
        "action": "Insert",
        "rfId": "",
        "userRfId": "",
        "name": "",
        "surveyNumber": "",
        "subDivisionNumber": "",
        "downloadDocument": "",
        "stateId": "1",
        "districtId": "",
        "districtName": "",
        "talukId": "",
        "talukName": "",
        "villageId": "",
        "villageName": "",
        "surveyStatus": "Processing",
        "address": "",
        "location": "",
        "pincode": "",
        "latitude": "",
        "longitude": "",
        "mailId": "",
        "inputSource": "Android",
        "loginUserId": "",
        "remarks": ""
    });
    const [listData, setListData] = useState({
        districtList: [],
        talukList: [],
        villageList: [],
        subDivisionList: [],
        defaultDistrictValue: '',
        defaultTalukValue: '',
        defaultVillageValue: ''
    })

    useEffect(() => {
        Store?.setEmptyDefaultDetails();
        Store?.getFmbPattaList();
        Store?.setFmbPattaSurveyNo("");
        Store?.setFmbPatta("")
        Store?.setVillageFilterData("");
    }, []);

    useEffect(() => {
        const fetchData = () => {
            if (Store?.fmbPattaDocument != "" && Store?.fmbPattaDocument?.length > 0 && fmbViewStatus === false) {
                setFmbViewStatus(true);
                navigation.navigate('FmbPattaView', { url: Store?.fmbPattaDocument })
            }
        }
        fetchData()
    }, [Store?.fmbPattaDocument]);

    useEffect(() => {
        if (!mapLoading && !tilesLoading) {
            setMapLoading(false);
        }
    }, [mapLoading, tilesLoading]);

    const handleMapReady = () => {
        setMapLoading(false);
    };

    const handleTileLoaded = () => {
        setTilesLoading(false);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            Store?.setMainLoader(true);

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error("Location permission not granted");
                Store?.setMainLoader(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            if (!location || !location.coords || !location.coords.latitude || !location.coords.longitude) {
                console.error("Location data not available");
                Store?.setMainLoader(false);
                return;
            }
            const { latitude, longitude } = location.coords;

            try {
                setRegionCoords({ lat: latitude, lng: longitude, latitudeDelta: 0.0018, longitudeDelta: 0.0018 });
                setMarker({ lat: latitude, lng: longitude });
                await Store.getVillageFilter(latitude, longitude, true);
                Store?.fmbPattaDistrict?.length === 0 && Store?.getFmbPattaDistrict();
                await onSetAddress();
            } catch (error) {
                console.error("Error fetching village filter or address data:", error);
                Store?.fmbPattaDistrict?.length === 0 && Store?.getFmbPattaDistrict();
            } finally {
                Store?.setMainLoader(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (Store?.villageFilterDataList?.data?.districtList?.length > 0) {
            setListData((prevListData) => ({
                ...prevListData,
                districtList: Store?.villageFilterDataList?.data?.districtList,
                talukList: Store?.villageFilterDataList?.data?.talukList,
                villageList: Store?.villageFilterDataList?.data?.villageList,
                defaultDistrictValue: Store?.villageFilterDataList?.data?.districtId,
                defaultTalukValue: Store?.villageFilterDataList?.data?.talukId,
                defaultVillageValue: Store?.villageFilterDataList?.data?.villageId,
                subDivisionList: typeof Store?.villageFilterDataList?.data?.subDivisionNumber === 'string'
                    ? []
                    : Store?.villageFilterDataList?.data?.subDivisionNumber?.length > 0 ? Store?.villageFilterDataList?.data?.subDivisionNumber : []

            }))
        } else {
            setListData((prevListData) => ({
                ...prevListData,
                districtList: Store?.fmbPattaDistrict?.length > 0 ? Store?.fmbPattaDistrict : [],
                talukList: [],
                villageList: [],
                defaultDistrictValue: "",
                defaultTalukValue: "",
                defaultVillageValue: "",
                subDivisionList: [],
            }))
        }

    }, [Store?.villageFilterDataList?.data?.districtList, Store?.fmbPattaDistrict])


    const handlePress = async (data, details) => {
        Store?.setMainLoader(true);
        setSelectedPlace({ data, details });
        if (details?.geometry) {
            const { lat, lng } = details.geometry.location
            setRegionCoords({ lat: lat, lng: lng, latitudeDelta: 0.0018, longitudeDelta: 0.0018 });
            setMarker(details.geometry.location);
            await Store.getVillageFilter(details.geometry.location.lat, details.geometry.location.lng, true);
            Store?.fmbPattaDistrict?.length === 0 && Store?.getFmbPattaDistrict();
            await onSetAddress();
        }
        Store?.setMainLoader(false);
    };

    const searchHandler = async (data, details) => {
        Store?.setMainLoader(true);
        if (details?.geometry) {
            const { lat, lng } = details.geometry.location
            setRegionCoords({ lat: lat, lng: lng, latitudeDelta: 0.0018, longitudeDelta: 0.0018 });
            setMarker(details.geometry.location);
            await Store.getVillageFilter(details.geometry.location.lat, details.geometry.location.lng, true);
            Store?.fmbPattaDistrict?.length === 0 && Store?.getFmbPattaDistrict();
            await onSetAddress();
        }
        Store?.setMainLoader(false);
    };

    const selectLocationHandler = async (event) => {
        Store?.setMainLoader(true);
        const lat = event.nativeEvent.coordinate.latitude;
        const lng = event.nativeEvent.coordinate.longitude;
        setMarker({ lat: lat, lng: lng });
        setRegionCoords({ lat: lat, lng: lng, latitudeDelta: 0.0018, longitudeDelta: 0.0018 });
        await Store.getVillageFilter(lat, lng, true);
        Store?.fmbPattaDistrict?.length === 0 && Store?.getFmbPattaDistrict();
        await onSetAddress();
        Store?.setMainLoader(false);
    };

    useEffect(() => {
        const getData = async () => {
            // let userRfId = await Store.getLocalDataUserDetails("rfId");
            const fileCount = (Store?.fmbPattaList?.length || 0) + 1;
            setBodyData((prevState) => ({
                ...prevState,
                userRfId: 3,
                name: `File - ${fileCount}`,
            }));
        }
        getData();
    }, []);

    useEffect(() => {
        // console.log("Store?.villageFilterDataList?.length", Store?.fmbPattaTaluk?.length)
        if (Store?.fmbPattaTaluk?.length > 0) {
            setListData((prevListData) => ({
                ...prevListData,
                talukList: Store?.fmbPattaTaluk
            }))
        }
        // console.log("Store?.fmbPattaVillage?.length", Store?.fmbPattaVillage?.length)
        if (Store?.fmbPattaVillage?.length > 0) {
            setListData((prevListData) => ({
                ...prevListData,
                villageList: Store?.fmbPattaVillage
            }))
        }

    }, [Store?.fmbPattaTaluk, Store?.fmbPattaVillage])

    const onSetAddress = async () => {
        if (Store?.villageFilterDataList?.data?.district_name !== "" || Store?.fmbPattaSurveyNo !== "") {
            setBodyData(bodyData => ({
                ...bodyData,
                address: Store?.addressData?.address,
                location: Store?.addressData?.location,
                districtId: Store?.villageFilterDataList?.data?.districtId,
                districtName: Store?.villageFilterDataList?.data?.district_name,
                talukId: Store?.villageFilterDataList?.data?.talukId,
                talukName: Store?.villageFilterDataList?.data?.taluk_name,
                villageId: Store?.villageFilterDataList?.data?.villageId,
                villageName: Store?.villageFilterDataList?.data?.revenue_village_name,
                latitude: Store?.villageFilterDataList?.data?.latitude,
                longitude: Store?.villageFilterDataList?.data?.longitude,
                surveyNumber: Store?.villageFilterDataList?.data?.surveyNumber
                // subDivisionNumber: Store?.fmbPattaSubDivisionNo == "" ? "" : Store?.fmbPattaSubDivisionNo
            }));
        }
    };

    const onlyNumbers = /^[0-9]+$/;

    const getSubDivisionNo = async () => {

        if (!bodyData?.surveyNumber) {
            handleError('Survey number is required', 'surveyNumber');
            return;
        } else if (!onlyNumbers.test(bodyData?.surveyNumber)) {
            handleError('Should contain only no', 'surveyNumber');
            return;
        }
        Store?.setMainLoader(true);
        await Store?.getFmbPattaSubDivisionNo(bodyData?.districtName, bodyData?.talukName, bodyData?.villageName, bodyData?.surveyNumber);
        Store?.setMainLoader(false);
    };

    const validate = async () => {

        Keyboard.dismiss();
        let isValid = true;

        // if (!bodyData?.districtId) {
        //     handleError('Select District', 'districtId');
        //     isValid = false;
        // }
        // if (!bodyData?.talukId) {
        //     handleError('Select Taluk', 'talukId');
        //     isValid = false;
        // }
        // if (!bodyData?.villageId) {
        //     handleError('Select Village', 'villageId');
        //     isValid = false;
        // }

        if (!bodyData?.surveyNumber) {
            handleError('SN Needed', 'surveyNumber');
            isValid = false;
        } else if (!onlyNumbers.test(bodyData?.surveyNumber)) {
            handleError('Should contain only no', 'surveyNumber');
            isValid = false;
        }

        // if (!bodyData?.subDivisionNumber) {
        //     handleError('SubDivision No needed', 'subDivisionNumber');
        //     isValid = false;
        // }

        if (isValid) {
            navigation.navigate('FMBSketch', { data: bodyData })
        }

        // console.log(`body Data = ${JSON.stringify(bodyData)}`)
    };

    const onChange = async (name, value) => {
        await Store?.setFmbPattaSubDivisionNo([])
        await setBodyData((prevState) => ({ ...prevState, [name]: value, subDivisionNumber: "" }))
        await setListData((prevListData) => ({ ...prevListData, subDivisionList: [] }))
        value?.length > 0 && handleError("", name);
    }
    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const onChangeDistrict = async (item) => {
        // console.log(`district rfid - ${JSON.stringify(item)}`)

        await Store?.setFmbPattaDistrict([]);
        await Store?.getFmbPattaDistrict();
        await Store?.setFmbPattaSubDivisionNo([])
        setListData((prevList) => ({
            ...prevList,
            talukList: [],
            villageList: [],
            subDivisionList: [],
            defaultDistrictValue: item?.rfId,
            defaultTalukValue: '',
            defaultVillageValue: '',

        }))
        await Store?.getFmbPattaTaluk(item?.rfId);
        setBodyData({
            ...bodyData,
            districtId: item?.rfId,
            districtName: item?.districtName,
            surveyNumber: "",
            subDivisionNumber: ""
        });
        setErrors(prevState => ({ ...prevState, districtId: '' }));

    }
    const onChangeTaluk = async (item) => {
        //console.log(`district rfid - ${talukId}`)
        await Store?.getFmbPattaVillage(item?.rfId);
        await Store?.setFmbPattaSubDivisionNo([])
        setListData((prevList) => ({
            ...prevList,
            // villageList:[],
            subDivisionList: [],
            defaultTalukValue: item?.rfId,
            defaultVillageValue: ''
        }))
        setBodyData({
            ...bodyData, talukId: item?.rfId, talukName: item?.talukName,
            surveyNumber: "",
            subDivisionNumber: ""
        });
        setErrors(prevState => ({ ...prevState, talukId: '' }));
    }

    const onChangeVillage = async (item) => {
        setListData((prevList) => ({
            ...prevList,
            subDivisionList: [],
            defaultVillageValue: item?.rfId
        }))
        setBodyData({
            ...bodyData, villageId: item?.rfId, villageName: item?.villageName,
            surveyNumber: "",
            subDivisionNumber: ""
        })
        await Store?.setFmbPattaSubDivisionNo([])
        setErrors(prevState => ({ ...prevState, villageId: '' }));
    }

    const customTileUrlTemplate = 'https://s3.ap-south-2.amazonaws.com/prod-assets.mypropertyqr.in/village_border/{x}/{y}.png';

    const calculateZoomLevel = (latitudeDelta) => {
        const zoomLevel = Math.log2(360 / latitudeDelta);
        return Math.round(zoomLevel);
    };

    const handleRegionChangeComplete = (region) => {
        const zoomLevel = calculateZoomLevel(region.latitudeDelta);
        if (zoomLevel === 18) {
            setShowCustomTiles(true);
        } else {
            setShowCustomTiles(false);
        }
    };
    const { districtList, talukList, villageList, subDivisionList, defaultDistrictValue, defaultTalukValue, defaultVillageValue } = listData


    const subDivisionData = subDivisionList?.length > 0 ? subDivisionList : Array.isArray(Store.fmbPattaSubDivisionNo) ? Store.fmbPattaSubDivisionNo : []
    // console.log("Store?.villageFilterDataList?.data?.subDivisionNumber", Store?.fmbPattaSubDivisionNo)
    const dropdownRef = useRef(null);
    useEffect(() => {
        if (subDivisionData?.length > 0 && dropdownRef.current) {
            dropdownRef.current.open();
        }
    }, [subDivisionData]);

    const ecAndGValuePageHandler = () => {
        navigation.navigate('EcAndGValue', { data: bodyData, villageList: villageList })
    }

    return (
        <>
            <View style={{ flex: 1 }}>
                <View style={styles.container}>
                    <MapView
                        apiKey={GOOGLE_API_KEY}
                        provider={MapView.PROVIDER_GOOGLE}
                        onMapReady={handleMapReady}
                        showsCompass={false}
                        onPress={selectLocationHandler}
                        style={styles.map}
                        mapType={isSatelliteView === true ? 'hybrid' : 'standard'}
                        showsUserLocation={true}
                        loadingEnabled={true}
                        loadingIndicatorColor={Colors.activeBlue}
                        initialRegion={{
                            latitude: regionCoords?.lat,
                            longitude: regionCoords?.lng,
                            latitudeDelta: regionCoords?.latitudeDelta,
                            longitudeDelta: regionCoords?.longitudeDelta,
                        }}
                        region={{
                            latitude: regionCoords?.lat,
                            longitude: regionCoords?.lng,
                            latitudeDelta: regionCoords?.latitudeDelta,
                            longitudeDelta: regionCoords?.longitudeDelta,
                        }}
                        onRegionChangeComplete={handleRegionChangeComplete}
                    >
                        <UrlTile
                            urlTemplate={customTileUrlTemplate}
                            maximumZ={18}
                            flipY={false}
                            onLoad={handleTileLoaded}
                        />
                        {marker && <Marker coordinate={{ latitude: marker?.lat, longitude: marker?.lng }} />}
                    </MapView>

                    {/* <GooglePlacesAutocomplete
                        styles={styles.searchbar}
                        placeholder="Search"
                        query={{
                            key: GOOGLE_API_KEY,
                            language: 'en',
                        }}
                        GooglePlacesDetailsQuery={{
                            fields: 'geometry',
                        }}
                        fetchDetails={true}
                        onPress={handlePress}
                        renderRightButton={() =>
                            <TouchableOpacity onPress={() => searchHandler(selectedPlace.data, selectedPlace.details)}>
                                <Image resizeMode="cover" source={require('../../Images/searchicon.png')} style={{ width: 20, height: 20, position: 'absolute', right: 20, top: 10, backgroundColor: 'white' }} />
                            </TouchableOpacity>
                        }
                    /> */}
                    <View style={[styles.addressContainer, { height: loading ? 200 : 'auto' }]}>
                        {loading ? (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator size={'large'} color={Colors.activeBlue} />
                            </View>
                        ) : (
                            <>
                                <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.addressHeading}>District   </Text>
                                    <Dropdown
                                        placeholder='District'
                                        style={styles.dropdown}
                                        search
                                        dropdownPosition={"top"}
                                        searchPlaceholder="Search..."
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        containerStyle={styles.containerStyle}
                                        itemContainerStyle={styles.itemContainerStyle}
                                        itemTextStyle={styles.itemTextStyle}
                                        activeColor={Colors.primary50}
                                        data={districtList}
                                        labelField="districtName"
                                        valueField="rfId"
                                        value={defaultDistrictValue}
                                        onChange={item => { onChangeDistrict(item) }}
                                    />

                                </View>
                                {/* {errors.districtId &&
                                    <Text style={CommonStyles.errorDistrict}>{errors.districtId}</Text>
                                } */}
                                <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center', }}>
                                    <Text style={styles.addressHeading}>Taluk       </Text>
                                    <Dropdown
                                        placeholder='Taluk'
                                        style={styles.dropdown}
                                        search
                                        dropdownPosition={"top"}
                                        disable={!bodyData?.districtId}
                                        searchPlaceholder="Search..."
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        containerStyle={styles.containerStyle}
                                        itemContainerStyle={styles.itemContainerStyle}
                                        itemTextStyle={styles.itemTextStyle}
                                        activeColor={Colors.primary50}
                                        data={talukList}
                                        labelField="talukName"
                                        valueField="rfId"
                                        value={defaultTalukValue}
                                        onChange={item => { onChangeTaluk(item) }}
                                    />

                                </View>
                                {/* {errors.talukId &&
                                    <Text style={CommonStyles.errorDistrict}>{errors.talukId}</Text>
                                } */}
                                <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.addressHeading}>Village    </Text>
                                    <Dropdown
                                        placeholder='Village'
                                        style={styles.dropdown}
                                        search
                                        disable={!bodyData?.talukId}
                                        dropdownPosition={"top"}
                                        searchPlaceholder="Search..."
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        containerStyle={styles.containerStyle}
                                        itemContainerStyle={styles.itemContainerStyle}
                                        itemTextStyle={styles.itemTextStyle}
                                        activeColor={Colors.primary50}
                                        data={villageList}
                                        labelField="villageName"
                                        valueField="rfId"
                                        value={defaultVillageValue}
                                        onChange={item => { onChangeVillage(item) }}
                                    />
                                    {/* {errors.villageId &&
                                        <Text style={CommonStyles.errorDistrict}>{errors.villageId}</Text>
                                    } */}
                                </View>
                                <View style={styles.surveyContainer}>
                                    <View style={{ flex: 1 }}>
                                        <Input
                                            placeholder='Survey No'
                                            inputContainerStyle={styles.inputContainerStyle}
                                            inputStyle={styles.inputStyle}
                                            placeholderTextColor={Colors.primary75}
                                            labelStyle={styles.labelStyle}
                                            keyboardType="number-pad"
                                            maxLength={4}
                                            value={bodyData?.surveyNumber?.toString()}
                                            onChangeText={(value) => { onChange("surveyNumber", value) }}
                                            errorStyle={errors.surveyNumber ? styles.errorStyle : styles.baseErrorStyle}
                                            errorMessage={errors.surveyNumber}
                                            onFocus={() => { handleError(null, 'surveyNumber') }}
                                            onBlur={() => setIsFocused(false)}
                                            disabled={loading ? true : false}
                                        />
                                    </View>
                                    <Text style={{ fontSize: 20, marginTop: 2 }}>/</Text>
                                    {
                                        subDivisionData?.length == 0 ?
                                            <>
                                                <Button
                                                    title="Get Sub Div No"
                                                    titleStyle={{ fontSize: 13, marginTop: -2 }}
                                                    buttonStyle={styles.buttonStyle2}
                                                    containerStyle={styles.buttonContainer2}
                                                    onPress={getSubDivisionNo}
                                                    disabled={bodyData?.surveyNumber?.length == 0 ? true : false}
                                                />
                                            </> :
                                            <Dropdown
                                                ref={dropdownRef}
                                                placeholder='Sub Divison No'
                                                style={[styles.dropdown, { height: 33 }]}
                                                dropdownPosition={"top"}
                                                searchPlaceholder="Search..."
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                containerStyle={styles.containerStyle}
                                                itemContainerStyle={styles.itemContainerStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                activeColor={Colors.primary50}
                                                data={subDivisionData?.map((item) => ({
                                                    label: item,
                                                    value: item,
                                                }))}
                                                labelField="label"
                                                valueField="value"
                                                value={bodyData?.subDivisionNumber}
                                                onChange={(item) => {
                                                    setBodyData((prevState) => ({
                                                        ...prevState,
                                                        subDivisionNumber: item.value,
                                                    }));
                                                    setErrors(prevState => ({ ...prevState, subDivisionNumber: '' }));
                                                }}
                                            />

                                    }
                                </View>
                                {errors.subDivisionNumber &&
                                    <Text style={styles.errorDistrict}>{errors.subDivisionNumber}</Text>
                                }
                                {
                                    Store?.villageFilterDataList?.data?.district_name !== "" &&
                                    <View style={styles.btnContainer}>
                                        <Button
                                            title="FMB Sketch"
                                            titleStyle={{ fontSize: 13 }}
                                            buttonStyle={styles.buttonStyle}
                                            containerStyle={styles.buttonContainer}
                                            onPress={validate}
                                        //disabled={bodyData?.districtId || bodyData?.villageId || bodyData?.talukId ? false : true}
                                        // iconRight
                                        // icon={{
                                        //     name: 'download',
                                        //     type: 'entypo',
                                        //     size: 15,
                                        //     color: 'white',
                                        //     style: { marginLeft: 5 }
                                        // }}
                                        />
                                        {/* <Button
                                            title="EC & G Value"
                                            titleStyle={{ fontSize: 13 }}
                                            buttonStyle={styles.buttonStyle}
                                            containerStyle={styles.buttonContainer}
                                            onPress={ecAndGValuePageHandler}
                                            iconRight
                                            icon={{
                                                name: 'download',
                                                type: 'entypo',
                                                size: 15,
                                                color: 'white',
                                                style: { marginLeft: 5 }
                                            }}
                                        /> */}
                                    </View>
                                }
                            </>
                        )
                        }
                    </View>
                    {!mapLoading && (
                        <TouchableOpacity style={styles.iconContainer} onPress={() => setIsSatelliteView(!isSatelliteView)}>
                            <Icon name='satellite'
                                type='font-awesome-5'
                                size={30}
                                color={Colors.blue200}
                            />
                        </TouchableOpacity>
                    )}
                </View>

            </View>
        </>
    );
}

export default observer(HomeScreen);

const styles = StyleSheet.create({
    headingTxt: {
        // fontSize: w,
        fontWeight: '500',
        marginLeft: 15,
    },
    container1: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 25,
        marginTop: 0,
    },
    btnContainer: {
        flex: 1,
        // justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        // flexDirection: 'row',
    },
    imgError: {
        textAlign: 'center',
        color: 'red',
        fontSize: 12
    },
    addressTxt: {
        textAlign: 'center',
        fontSize: 12,
        color: Colors.green300
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        height: '100%'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    searchbar: {
        description: {
            //fontWeight: 'bold',
        },
        predefinedPlacesDescription: {
            color: '#1faadb',
        },
        textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            top: 12,
            right: 15,
            width: '80%',
            borderWidth: 0,
            alignSelf: 'center',

        },
        textInput: {
            height: 38,
            paddingRight: 50,
            color: '#5d5d5d',
            fontSize: 16,
            elevation: 2,
            borderRadius: 1
        },
        listView: {
            top: 30,
            marginHorizontal: 20,

        },
    },
    addressContainer: {
        width: '90%',
        backgroundColor: Colors.blue35,
        position: 'absolute',
        bottom: 30,
        padding: 10,
        borderRadius: 10,
        elevation: 8,
    },
    addressText: {
        fontSize: 13,
        fontWeight: '400',
        textAlign: 'center'
    },
    addressHeading: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '46%',
        height: 35,
        marginHorizontal: 0,
        alignSelf: 'center',
        marginTop: -10

    },
    buttonContainer2: {
        width: '45%',
        height: 32,
        marginHorizontal: 10,
        alignSelf: 'center',
        marginTop: -25

    },
    buttonStyle2: {
        backgroundColor: Colors.yellow100,
        borderRadius: 4,
    },
    buttonStyle: {
        backgroundColor: Colors.activeBlue,
        borderRadius: 5,
    },
    buttonTxtStyle: {
        fontSize: 10,
        fontWeight: '500',
        color: Colors.primary50
    },
    input: {
        height: 30,
    },
    searchContainer: {
        position: "absolute",
        width: "90%",
        backgroundColor: Colors.primary50,
        elevation: 10,
        padding: 8,
        paddingBottom: 6,
        borderRadius: 8,
        top: 100,
        alignSelf: 'center',
        flex: 1
    },
    iconContainer: {
        position: "absolute",
        backgroundColor: 'white',
        top: '58%',
        right: '3%',
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    inputContainerStyle: {
        borderColor: '#CCCDD0',
        borderWidth: 1,
        height: 33,
        width: '100%',
        borderRadius: 5,
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    inputStyle: {
        marginHorizontal: 10,
        fontSize: 12,
    },
    labelStyle: {
        fontSize: 15,
        color: '#021328',
        fontWeight: '300',
    },
    requiredSymbol: {
        color: 'red',
    },
    errorStyle: {
        color: 'red',
        position: 'relative',
        top: -5,
    },
    surveyContainer: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 10
    },

    //Dropdown Input Box Style
    dtcptext: {
        marginHorizontal: 10,
        marginTop: -5,
        marginBottom: 3,
        fontSize: 15,
        color: '#021328',
        fontWeight: '400',
    },
    dropdown: {
        borderColor: '#CCCDD0',
        borderWidth: 1,
        width: '50%',
        height: 32,
        borderRadius: 5,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
    },
    placeholderStyle: {
        fontSize: 12,
        color: '#CCCDD0',
    },
    selectedTextStyle: {
        fontSize: 12,
    },
    containerStyle: {
        marginTop: -40,
        backgroundColor: '#FFFFFF',
    },
    itemContainerStyle: {
        padding: 0,
        margin: -8,
        backgroundColor: '#FFFFFF',
    },
    errorDistrict: {
        color: 'red',
        fontSize: 12,
        position: 'relative',
        top: -27,
        left: 160,
        marginHorizontal: 15
    },

});
