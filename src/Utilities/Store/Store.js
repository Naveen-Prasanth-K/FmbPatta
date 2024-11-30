import axios from "axios";
import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import { ToastAndroid, Alert, Linking } from 'react-native';
import { GOOGLE_API_KEY } from "../Constants/Environment";
import { localStorageDelete, localStorageGetSingleItem, localStorageStoreItem } from "../Storage/Storage";
import { URL } from "../Constants/Environment";

class Store {

    mainLoader = false;
    addressData = {
        address: "",
        district: "",
        state: "",
        country: "",
        pincode: "",
        districtId: "",
        latitude: "",
        longitude: "",
        location: ""
    };
    villageFilterDataList = []
    fmbPattaList = [];
    fmbPattaSurveyNo = "";
    fmbPattaSubDivisionNo = "";
    fmbPattaDocument = [];
    fmbPattaDistrict = [];
    fmbPattaTaluk = [];
    fmbPattaVillage = [];


    constructor() {
        makeObservable(
            this, {
            increment: action,
            decrement: action,
            setMainLoader: action,
            getLocalDataUserDetails: action,
            getFmbPattaList: action,
            getFmbPattaDistrict: action,
            setFmbPattaDistrict: action,
            getFmbPattaTaluk: action,
            setFmbPattaTaluk: action,
            getFmbPattaVillage: action,
            setFmbPattaVillage: action,
            getFmbPattaSubDivisionNo: action,
            setFmbPattaSubDivisionNo: action,
            getFmbPattaList: action,
            fmbPattaInsert: action,
            setFmbPattaList: action,
            getFmbPattaSurveyNo: action,
            setFmbPattaSurveyNo: action,
            downloadFmbPatta: action,
            setFmbPatta: action,
            setFmbPattaSurveyNo: action,
            setVillageFilterData: action,


            mainLoader: observable,
            addressData: observable,
            fmbPattaList: observable,
            fmbPattaSurveyNo: observable,
            fmbPattaSubDivisionNo: observable,
            villageFilterDataList: observable,
            downloadFmbPatta: observable,
            fmbPattaDistrict: observable,
            fmbPattaTaluk: observable,
            fmbPattaVillage: observable,

        }, { autoBind: true }
        )
    }

    increment() {
        this.count += 1;
    }

    decrement() {
        this.count -= 1;
    }


    getLocalDataUserDetails = async (key, tableName = "memberData") => {
        let data = await localStorageGetSingleItem(tableName);
        return data == null ? "null" : data[0][key];
    }

    deleteLocalStorageData = async (key) => {

        let memberData = await localStorageDelete("memberData");
        let toten = await localStorageDelete("ownerToken");

        let data = await localStorageGetSingleItem("memberData");
        return "key deleted";
    }

    setEmptyDefaultDetails = async () => {
        this.addressData.address = "";
        this.addressData.district = "";
        this.addressData.state = "";
        this.addressData.country = "";
        this.addressData.pincode = "";
        this.addressData.location = "";
        this.addressData.latitude = "";
        this.addressData.longitude = "";
    }

    setAddressDetails = async (data, lat, lng) => {
        //  console.log(`data - ${JSON.stringify(data)}`)
        this.addressData.address = "";
        this.addressData.district = "";
        this.addressData.state = "";
        this.addressData.country = "";
        this.addressData.pincode = "";
        this.addressData.location = "";
        this.addressData.latitude = "";
        this.addressData.longitude = "";
        this.addressData.latitude = lat;
        this.addressData.longitude = lng;

        await data?.address_components?.length > 0 && data?.address_components?.map((details, index) => {

            if (details?.types[0] == "postal_code") {
                this.addressData.pincode = details?.long_name
            } else if (details?.types[0] == "country") {
                this.addressData.country = details?.long_name;
            } else if (details?.types[0] == "administrative_area_level_1") {
                this.addressData.state = details?.long_name;
            } else if (details?.types[0] == "administrative_area_level_3") {
                this.addressData.district = details?.long_name;
            } else if (details?.types[0] == "political") {
                this.addressData.location = details?.long_name;
            } else {
                this.addressData.address = this.addressData.address.concat(details?.long_name + " , ")
            }
        });

        if (this.districtData.length > 0) {
            let districtRfId = this.districtData.filter((filterData) => {
                if (filterData.districtName == this.addressData.district.toUpperCase()) {
                    return filterData.rfId
                }
            })
            if (districtRfId?.length > 0) {
                this.addressData.districtId = districtRfId[0]?.rfId
            }
        }
    }
    setDistrictData = (data) => {
        this.districtData = [];
        this.districtData = data;
    }


    getFmbPattaList = async () => {

        let token = await localStorageGetSingleItem("ownerToken");
        // let userRfId = await this.getLocalDataUserDetails("rfId");
        const headers = { "x-auth-header": `${token}` }

        let formData = {
            "action": "View",
            "rfId": "",
            "userRfId": 3,
            "order": "desc",
            "fromDate": "",
            "toDate": "",
            "search": ""
        }
        await axios.post(`${URL}survey-download`, formData, { headers }).then(async (response) => {
            // console.log(`getFmbPattaList - ${JSON.stringify(response?.data)}`)
            if (response?.data?.message == "Success") {
                await this.setFmbPattaList(response?.data?.data)
            }
        }).catch((err) => {
            console.log(err);
            this.setFmbPattaList([])
        })
    }

    getVillageFilter = async (latitude, longitude, fmbPatta = false) => {
        // console.log(`getVillageFilter latitude = ${latitude}`);
        // console.log(`getVillageFilter longitude = ${longitude}`);
        this.setVillageFilterData([])
        let token = await localStorageGetSingleItem("ownerToken");
        let formData = {
            "action": fmbPatta ? "View" : "Village",
            "latitude": latitude,
            "longitude": longitude
        }
        const headers = { "x-auth-header": `${token}` }
        //console.log(`getVillageFilter formData = ${JSON.stringify(formData)}`);
        await axios.post(`${URL}whatsApp`, formData, { headers }).then(async (response) => {
            // console.log(`getVillageFilter response= ${JSON.stringify(response?.data)}`)
            if (response?.data?.message == "Success") {
                this.setVillageFilterData(response?.data?.data);
                // this.setMainLoader(false)
            } else {

                Alert.alert(
                    'Error',
                    response?.data?.alert,
                    [{ text: 'OK' }]
                );
            }
            // console.log(`getLandSurveyList - ${JSON.stringify(response?.data)}`)
        }).catch((err) => {
            console.log(err);
            this.setVillageFilterData([])
        })
    }

    setVillageFilterData = async (data) => {
        this.villageFilterDataList = [];
        this.villageFilterDataList = data != "null" ? data : [];
    }


    fmbPattaInsert = async (formData) => {

        // console.log(`fmbPattaInsert formData ${JSON.stringify(formData)}`)

        formData.surveyNumber = `${formData.subDivisionNumber != "" ? `${formData?.surveyNumber?.toString()}/${formData?.subDivisionNumber?.toString()}` : formData?.surveyNumber?.toString()}`

        let token = await localStorageGetSingleItem("ownerToken");
        const headers = { "x-auth-header": `${token}` }
        //console.log(`fmbPattaInsert formData ${JSON.stringify(formData)}`)
        await axios.post(`${URL}survey-download`, formData, { headers }).then(async (response) => {
            //console.log(`fmbPattaInsert - ${JSON.stringify(response?.data)}`)
            if (response?.data?.message == "Success") {
                await this.downloadFmbPatta(response?.data?.data[0].rfId, 3, formData?.surveyNumber)
                // this.setMainLoader(false)
            } else {
                Alert.alert(
                    'Error',
                    response?.data?.alert,
                    [{ text: 'OK' }]
                );
            }
        }).catch((err) => {
            console.log(err);
            // this.setMainLoader(false)
        })
    }
    setFmbPattaList = (data) => {
        this.fmbPattaList = [];
        this.fmbPattaList = data != null ? data : []
    }

    getFmbPattaSurveyNo = async (latitude, longitude) => {
        // console.log(`getFmbPattaSurveyNo latitude- ${latitude}`);
        // console.log(`getFmbPattaSurveyNo longitude- ${longitude}`);
        let token = await localStorageGetSingleItem("ownerToken");
        const headers = { "x-auth-header": `${token}` };

        const formData = {
            "action": "Survey Number",
            "latitude": latitude,
            "longitude": longitude
        };

        await axios.post(`${URL}survey-download`, formData, { headers }).then(async (response) => {
            // console.log(`getFmbPattaSurveyNo - ${JSON.stringify(response)}`);
            // console.log(`getFmbPattaSurveyNo - ${JSON.stringify(response?.data?.data?.processedNumber)}`);

            if (response?.data?.message === "Success") {
                if (response?.data?.data?.processedNumber) {
                    await this.setFmbPattaSurveyNo(response?.data?.data?.processedNumber, response?.data?.data?.subDivisionNumber);
                } else {
                    Alert.alert(
                        'Message',
                        response?.data?.alert,
                        [{ text: 'OK' }]
                    );
                    this.setFmbPattaSurveyNo("");
                }
            } else {
                Alert.alert(
                    'Message',
                    response?.data?.alert,
                    [{ text: 'OK' }]
                );
                this.setFmbPattaSurveyNo("");
            }
        }).catch((err) => {
            console.log(err);
            this.setFmbPattaSurveyNo("");
        });
    };

    getFmbPattaSubDivisionNo = async (districtName, talukName, villageName, surveyNumber) => {

        let token = await localStorageGetSingleItem("ownerToken");
        const headers = { "x-auth-header": `${token}` };

        const formData = {
            "action": "Sub Division Number",
            "districtName": districtName,
            "talukName": talukName,
            "villageName": villageName,
            "surveyNumber": surveyNumber
        }

        await axios.post(`${URL}survey-download`, formData, { headers }).then(async (response) => {
            // console.log(`getFmbPattaSubDivisionNo - ${JSON.stringify(response?.data)}`);
            if (response?.data?.message === "Success") {
                await this.setFmbPattaSubDivisionNo(response?.data?.data)
            } else {
                Alert.alert(
                    'Message',
                    response?.data?.alert,
                    [{ text: 'OK' }]
                );
            }
        }).catch((err) => {
            console.log(err);
            this.setFmbPattaSubDivisionNo("");
        });
    };

    setFmbPattaSurveyNo = (surveyNumber, subDivisionNumber) => {
        this.fmbPattaSurveyNo = "";
        this.fmbPattaSubDivisionNo = "";
        this.fmbPattaSurveyNo = surveyNumber != null ? surveyNumber : "",
            this.fmbPattaSubDivisionNo = subDivisionNumber != null ? subDivisionNumber : ""
    }

    setFmbPattaSubDivisionNo = (data) => {
        this.fmbPattaSubDivisionNo = [];
        this.fmbPattaSubDivisionNo = data != null ? data : []
    }

    getFmbPattaDistrict = async () => {

        // console.log(`getFmbPattaDistrict = triggred`)
        let token = await localStorageGetSingleItem("ownerToken");
        const headers = { "x-auth-header": `${token}` }
        let userRfId = await this.getLocalDataUserDetails("rfId");
        // console.log(`userRfId = ${userRfId}`)
        let formData = {
            "action": "View",
            "type": "Finder District",
            "stateId": 1,
            "orderName": "districtName",
            "order": "asc",
            "zone": ""
        }
        await axios.post(`${URL}bind`, formData, { headers }).then(async (response) => {
            // console.log(`getFmbPattaDistrict - ${JSON.stringify(response?.data)}`)
            if (response?.data?.message == "Success") {
                await this.setFmbPattaDistrict(response?.data?.data)
            }
        }).catch((err) => {
            console.log(err);
            this.setFmbPattaDistrict([])
        })
    }

    setFmbPattaDistrict = (data) => {
        this.fmbPattaDistrict = [];
        this.fmbPattaDistrict = data != null ? data : []
    }

    getFmbPattaTaluk = async (districtId) => {
        let token = await localStorageGetSingleItem("ownerToken");
        const headers = { "x-auth-header": `${token}` }
        let userRfId = await this.getLocalDataUserDetails("rfId");
        // console.log(`districtId = ${districtId}`)
        let formData = {
            "action": "View",
            "type": "Finder Taluk",
            "districtId": districtId
        }
        await axios.post(`${URL}bind`, formData, { headers }).then(async (response) => {
            //   console.log(`getFmbPattaTaluk - ${JSON.stringify(response?.data)}`)
            if (response?.data?.message == "Success") {
                await this.setFmbPattaTaluk(response?.data?.data)
            }
        }).catch((err) => {
            console.log(err);
            this.setFmbPattaTaluk([])
        })
    }

    setFmbPattaTaluk = (data) => {
        this.fmbPattaTaluk = [];
        this.fmbPattaTaluk = data != null ? data : []
    }

    getFmbPattaVillage = async (talukId) => {
        //console.log(`getFmbPattaVillage talukId = ${talukId}`)
        let token = await localStorageGetSingleItem("ownerToken");
        const headers = { "x-auth-header": `${token}` }
        let userRfId = await this.getLocalDataUserDetails("rfId");

        let formData = {
            "action": "View",
            "type": "Finder Village",
            "talukId": talukId
        }
        await axios.post(`${URL}bind`, formData, { headers }).then(async (response) => {
            // console.log(`getFmbPattaVillage - ${JSON.stringify(response?.data?.data)}`)
            if (response?.data?.message == "Success") {
                await this.setFmbPattaVillage(response?.data?.data)
            }
        }).catch((err) => {
            console.log(err);
            this.setFmbPattaVillage([]);
        })
    }

    setFmbPattaVillage = (data) => {
        this.fmbPattaVillage = [];
        this.fmbPattaVillage = data != null ? data : []
    }

    downloadFmbPatta = async (rfId, userRfId, surveyNumber) => {

        let token = await localStorageGetSingleItem("ownerToken");
        let loginUserId = await this.getLocalDataUserDetails("rfId");

        const headers = { "x-auth-header": `${token}` }
        let formData = {
            "action": "Download",
            "rfId": rfId,
            "userRfId": 3,
            "loginUserId": loginUserId,
            "surveyNumber": surveyNumber
        }
        // console.log(`downloadFmbPatta formData ${JSON.stringify(formData)}`);
        await axios.post(`${URL}survey-download`, formData, { headers }).then(async (response) => {
            // console.log(`downloadFmbPatta response - ${JSON.stringify(response?.data)}`)
            if (response?.data?.message == "Success") {
                await this.setFmbPatta(response?.data?.data);
                this.getFmbPattaList();
                Alert.alert(
                    'Success',
                    'The requested FMB & Patta are downloaded successfully.',
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert(
                    'Error',
                    response?.data?.alert,
                    [{ text: 'OK' }]
                );
            }
        }).catch((err) => {
            console.log(err);
            this.setFmbPatta([]);
        })
    }

    setFmbPatta = (data) => {
        this.fmbPattaDocument = "";
        this.fmbPattaDocument = data != null ? data : ""
    }

    setFmbPattaSurveyNo = (surveyNumber, subDivisionNumber) => {
        this.fmbPattaSurveyNo = "";
        this.fmbPattaSubDivisionNo = "";
        this.fmbPattaSurveyNo = surveyNumber != null ? surveyNumber : "",
            this.fmbPattaSubDivisionNo = subDivisionNumber != null ? subDivisionNumber : ""
    }

    setMainLoader = (data) => {
        this.mainLoader = data;
    }

}

export default Store = new Store();
