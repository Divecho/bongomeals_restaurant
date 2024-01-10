import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, PermissionsAndroid, Platform ,StatusBar} from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, bold, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, location} from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { connect } from 'react-redux'; 
import { addRestaurantGoogleAddress, addRestaurantLat, addRestaurantLng, addRestaurantPincode } from '../actions/RestaurantRegisterActions';

const RestaurantLocation = (props) => {
  const navigation = useNavigation();
  const [mapRegion, setmapRegion] = useState(null);
  const mapRef = useRef(null);

  const handleBackButtonClick= () => {
    navigation.goBack()
  } 

  const map_ref = async() =>{
    await setTimeout(() => {
      mapRef.current.focus();
    }, 200);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await findType();
    });
    return unsubscribe;
  },[]);

  const requestCameraPermission = async() =>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
          'title': 'Location Access Required',
          'message': app_name+' needs to Access your location for tracking'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await getInitialLocation();
      } else {
        await handleBackButtonClick();
      }
    }catch (err) {
      await handleBackButtonClick();
    }
  }

  const findType = async() =>{
    if(Platform.os === "android"){
      requestCameraPermission();
    }else{
      getInitialLocation();
    }
    
  }

  const getInitialLocation = async() =>{
    //await Geolocation.getCurrentPosition(info => console.log("info ", info));
    await Geolocation.getCurrentPosition( async(position) => {
      let region = {
        latitude:       await position.coords.latitude,
        longitude:      await position.coords.longitude,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      console.log(region);
      setmapRegion( region )
      
    }, error => console.log(error) , 
    {enableHighAccuracy: false, timeout: 10000 });
  }

  const onRegionChange = async(value) => {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
        .then((response) => response.json())
        .then(async(responseJson) => {
           if(responseJson.results[0].formatted_address != undefined){
              let address = await responseJson.results[0].address_components;
              let pin_code = await address[address.length - 1].long_name;
              await props.addRestaurantPincode(pin_code);
              await props.addRestaurantGoogleAddress(responseJson.results[0].formatted_address);
              await props.addRestaurantLat(value.latitude);
              await props.addRestaurantLng(value.longitude);
           }else{
            alert( 'Sorry something went wrong' );
           }
    }) 
  }

  const register = async() =>{
    navigation.navigate('Register');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <View style={{alignItems:'center', justifyContent:'center', height:'100%'}} >
        <MapView
          provider={PROVIDER_GOOGLE} 
          ref={mapRef}
          style={{width: '100%',height: '100%'}}
          initialRegion={ mapRegion }
          onRegionChangeComplete={region => onRegionChange(region)}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
        </MapView>
        <View style={{position: 'absolute',}}>
          <View style={{height:30, width:25, top:-15 }} >
            <Image
              style= {{flex:1 , width: undefined, height: undefined}}
              source={location}
            />
          </View>
        </View>
        <View style={{position: 'absolute', backgroundColor:colors.theme_fg_three, borderRadius:10, width:'100%', height:50, top:0, flexDirection:'row', padding:10  }}>
          <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:30 }} />
          </TouchableOpacity>
          <View style={{ width:'85%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Select Restaurant Location</Text>
          </View>
        </View>
        <View style={{ left:0, right:0, bottom:0,alignItems:'center', height:50, position:'absolute', justifyContent:'center'}}>
          <TouchableOpacity onPress={register} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
  header: {
    
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor:'#ccc',
    padding:10,
  },
   button: {
    padding:10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'94%',
    marginLeft:'3%',
    marginRight:'3%',
  },
});

function mapStateToProps(state){
  return{
    restaurant_google_address : state.restaurant_register.restaurant_google_address,
    restaurant_lat : state.restaurant_register.restaurant_lat,
    restaurant_lng : state.restaurant_register.restaurant_lng,
    restaurant_pin_code : state.restaurant_register.restaurant_pin_code,
    restaurant_phone_number : state.restaurant_register.restaurant_phone_number,

  };
}

const mapDispatchToProps = (dispatch) => ({
    addRestaurantGoogleAddress: (data) => dispatch(addRestaurantGoogleAddress(data)),
    addRestaurantLat: (data) => dispatch(addRestaurantLat(data)),
    addRestaurantLng: (data) => dispatch(addRestaurantLng(data)),
    addRestaurantPincode: (data) => dispatch(addRestaurantPincode(data))

});

export default connect(mapStateToProps,mapDispatchToProps)(RestaurantLocation);

