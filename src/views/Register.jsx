import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Keyboard,StatusBar} from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, api_url, register } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Loader } from '../components/Loader';
import { addRestaurantUserName, addRestaurantPassword, addRestaurantPhoneWithCode, addRestaurantGoogleAddress, addRestaurantLat, addRestaurantLng, addRestaurantProfilePicture   } from '../actions/RestaurantRegisterActions';

const Register = (props) => {
//console.log("props ", props);
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validation,setValidation] = useState(false); 
  const [confirm_password, setConfirmPassword] = useState("");

  const handleBackButtonClick= () => {
    navigation.goBack()
  }
  
  const user_details_validation = async() =>{
    if(!props.restaurant_user_name || !props.restaurant_password || !confirm_password){
      alert('Please enter user details.')
      await setValidation(false);
    }else if(!props.restaurant_password != !confirm_password){
      alert('Password mismatch.')
      await setValidation(false);
    }else{
      await setValidation(true);
      await save_restaurant();
    }
  }

  const save_restaurant = async() => {
    console.log({ restaurant_name: props.restaurant_user_name, phone_with_code: props.restaurant_phone_with_code, contact_person_name: props.restaurant_contact_person, manual_address: props.restaurant_address, restaurant_phone_number: props.restaurant_phone_number, google_address: props.restaurant_google_address, username: props.restaurant_user_name, lat: props.restaurant_lat, lng: props.restaurant_lng, zip_code: props.restaurant_pin_code, password: props.restaurant_password, fcm_token:global.fcm_token })
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + register,
      data:{ restaurant_name: props.restaurant_name, phone_with_code: props.restaurant_phone_with_code, contact_person_name: props.restaurant_contact_person, manual_address: props.restaurant_address, restaurant_phone_number: props.restaurant_phone_number, google_address: props.restaurant_google_address, username: props.restaurant_user_name, lat: props.restaurant_lat, lng: props.restaurant_lng, zip_code: props.restaurant_pin_code, password: props.restaurant_password, fcm_token:global.fcm_token }
    })
    .then(async response => {
      console.log("response register ", JSON.stringify(response))
      setLoading(false);
      if(response.data.status == 0){
        alert(response.data.message)
      }else{
        saveData(response.data)
      }
      
    })
    .catch(error => {
      console.log("Error ", error);
      setLoading(false);
      alert('Something went wrong 1')
    });
  }

  const saveData = async(data) =>{
    try{
        await AsyncStorage.setItem('id', data.result.id.toString());
        await AsyncStorage.setItem('phone_with_code', data.result.phone_with_code.toString());
        await AsyncStorage.setItem('lat', data.result.lat.toString());
        await AsyncStorage.setItem('lng', data.result.lng.toString());
        await AsyncStorage.setItem('google_address', data.result.google_address.toString());
        await AsyncStorage.setItem('restaurant_image', data.result.restaurant_image.toString());

        global.id = await data.result.id.toString();
        await props.addRestaurantPhoneWithCode(data.result.phone_with_code.toString());
        await props.addRestaurantGoogleAddress(data.result.google_address.toString());
        await props.addRestaurantLat(data.result.phone_with_code.toString());
        await props.addRestaurantLng(data.result.phone_with_code.toString());
        await props.addRestaurantProfilePicture(data.result.restaurant_image.toString());
        navigation.navigate('Success');
      }catch (e) {
        alert(e);
    }
  }

return( 
  <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor={colors.theme_bg}/>
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
    <Loader visible={loading} />
      <View style={{ padding:20}}>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:100 , justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>User Details</Text>
        <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Username"
            placeholderTextColor={colors.theme_fg_two}
            underlineColorAndroid="transparent"
            onChangeText={text => props.addRestaurantUserName(text)}
            value={props.restaurant_user_name}
          />
        </View>
         <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Password"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => props.addRestaurantPassword(text)}
            value={props.restaurant_password}
          />
        </View>
        <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Confirm password"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => setConfirmPassword(text)}
          />
        </View>
        <View style={{ margin:20 }}/>
        <View style={{ left:0, right:0, alignItems:'center', justifyContent:'center'}}>
          <TouchableOpacity onPress={user_details_validation.bind(this)} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
  },
  textFieldIcon: {
    padding:5
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    fontSize:14,
    color:colors.theme_fg_two
  },
  button: {
    padding:10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'100%'
  },
});

function mapStateToProps(state){
  return{
    restaurant_user_name : state.restaurant_register.restaurant_user_name,
    restaurant_password : state.restaurant_register.restaurant_password,
    restaurant_google_address : state.restaurant_register.restaurant_google_address,
    restaurant_lat : state.restaurant_register.restaurant_lat,
    restaurant_lng : state.restaurant_register.restaurant_lng,
    restaurant_pin_code : state.restaurant_register.restaurant_pin_code,
    restaurant_phone_number : state.restaurant_register.restaurant_phone_number,
    restaurant_name : state.restaurant_register.restaurant_name,
    restaurant_address : state.restaurant_register.restaurant_address,
    restaurant_contact_person : state.restaurant_register.restaurant_contact_person,
    restaurant_phone_with_code : state.restaurant_register.restaurant_phone_with_code,
    restaurant_phone_number : state.restaurant_register.restaurant_phone_number,

  };
}

const mapDispatchToProps = (dispatch) => ({
  addRestaurantUserName: (data) => dispatch(addRestaurantUserName(data)),
  addRestaurantPassword: (data) => dispatch(addRestaurantPassword(data)),
  addRestaurantGoogleAddress: () => dispatch(addRestaurantGoogleAddress()),
  addRestaurantLat: () => dispatch(addRestaurantLat()),
  addRestaurantLng: () => dispatch(addRestaurantLng()),
  addRestaurantPincode: () => dispatch(addRestaurantPincode()),
  addRestaurantName: (data) => dispatch(addRestaurantName(data)),
  addRestaurantAddress: (data) => dispatch(addRestaurantAddress(data)),
  addRestaurantContactPerson: (data) => dispatch(addRestaurantContactPerson(data)),
  addRestaurantPhoneWithCode: (data) => dispatch(addRestaurantPhoneWithCode(data)),
  addRestaurantProfilePicture: (data) => dispatch(addRestaurantProfilePicture(data)),

});


export default connect(mapStateToProps,mapDispatchToProps)(Register);

