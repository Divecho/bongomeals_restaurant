import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Keyboard ,StatusBar} from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, restaurant_login, api_url, forget_password, regular } from '../config/Constants';
import { useNavigation, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux'; 
import { addRestaurantPhoneWithCode, addRestaurantLat, addRestaurantLng, addRestaurantGoogleAddress, addRestaurantName, addRestaurantContactPerson, addRestaurantProfilePicture  } from '../actions/RestaurantRegisterActions';

const Login = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [validation,setValidation] = useState(false);
  const [user_name,setUserName] = useState(''); 
  const [password,setPassword] = useState(''); 

  const register_restaurant = () => {
    navigation.navigate("RestaurantInfo")
  }

  const login_validation = async() =>{
    if(!user_name || !password){
      alert('Please fill your details.')
      setValidation(false);
    }else{
      await setValidation(true);
      await login_restaurant();
    }
  }

  const login_restaurant = async() => {
    Keyboard.dismiss();
    //setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + restaurant_login,
      data:{ username: user_name, password: password, fcm_token:fcm_token }
    })
    .then(async response => {
      //alert(JSON.stringify(response.data.result))
      setLoading(false);
      if(response.data.status == 0){
        alert(response.data.message)
      }else{
        saveData(response.data)
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Something went wrong')
    });
  }

  const saveData = async(data) =>{
    try{
        await AsyncStorage.setItem('id', data.result.id.toString());
        await AsyncStorage.setItem('phone_with_code', data.result.phone_with_code.toString());
        await AsyncStorage.setItem('lat', data.result.lat.toString());
        await AsyncStorage.setItem('lng', data.result.lng.toString());
        await AsyncStorage.setItem('google_address', data.result.google_address.toString());
        await AsyncStorage.setItem('restaurant_name', data.result.restaurant_name.toString());
        await AsyncStorage.setItem('contact_person_name', data.result.contact_person_name.toString());
        await AsyncStorage.setItem('profile_picture', data.result.restaurant_image.toString());
        
        global.id = await data.result.id.toString();
        await props.addRestaurantPhoneWithCode(data.result.phone_with_code.toString());
        await props.addRestaurantLat(data.result.lat.toString());
        await props.addRestaurantLng(data.result.lng.toString());
        await props.addRestaurantGoogleAddress(data.result.google_address.toString());
        await props.addRestaurantName(data.result.restaurant_name.toString());
        await props.addRestaurantContactPerson(data.result.contact_person_name.toString());
        await props.addRestaurantProfilePicture(data.result.restaurant_image.toString());

        await navigate();
      }catch (e) {
        alert(e);
    }
  }

  const navigate = async() => {
    navigation.dispatch(
         CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }

  const forgot_password = () =>{
    navigation.navigate("ForgotPassword")
  }

return (
  <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor={colors.theme_bg}/>
    <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
    <Loader visible={loading} />
      <View>
        <TouchableOpacity style={{ width:100 , justifyContent:'center', alignItems:'flex-start' }}>
         
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Enter your Login Details</Text>
        <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Username"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            onChangeText={text => setUserName(text)}
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
            onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={{ margin:10 }}/>
        <TouchableOpacity style={{ alignItems:'flex-end' }} onPress={forgot_password}>
          <Text style={{fontFamily:regular, fontSize:14, color:colors.theme_fg_two}}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <TouchableOpacity  onPress={login_validation}  style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize: 14}}>Submit</Text>
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <TouchableOpacity  onPress={register_restaurant}  style={styles.join_button}>
          <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:14}}>Join with us</Text>
        </TouchableOpacity>
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
    color:colors.theme_fg_two,
    fontFamily:regular
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
  join_button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:colors.theme_fg,
    borderWidth:1
  },
  flag_style:{
    width: 38, 
    height: 24
  },
  country_text:{
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three
  },
});

function mapStateToProps(state){
  return{
    restaurant_phone_with_code : state.restaurant_register.restaurant_phone_with_code,
    restaurant_google_address : state.restaurant_register.restaurant_google_address,
    restaurant_lat : state.restaurant_register.restaurant_lat,
    restaurant_lng : state.restaurant_register.restaurant_lng,
    restaurant_name : state.restaurant_register.restaurant_name,
    restaurant_contact_person : state.restaurant_register.restaurant_contact_person,
    restaurant_profile_picture : state.restaurant_register.restaurant_profile_picture,

  };
}

const mapDispatchToProps = (dispatch) => ({
  addRestaurantPhoneWithCode: (data) => dispatch(addRestaurantPhoneWithCode(data)),
  addRestaurantLat: () => dispatch(addRestaurantLat()),
  addRestaurantLng: () => dispatch(addRestaurantLng()),
  addRestaurantGoogleAddress: () => dispatch(addRestaurantGoogleAddress()),
  addRestaurantName: (data) => dispatch(addRestaurantName(data)),
  addRestaurantContactPerson: (data) => dispatch(addRestaurantContactPerson(data)),
  addRestaurantProfilePicture: (data) => dispatch(addRestaurantProfilePicture(data)),

});

export default connect(mapStateToProps,mapDispatchToProps)(Login);
