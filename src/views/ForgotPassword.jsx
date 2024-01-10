import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, StatusBar, Keyboard, } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import {regular, bold, forget_password, api_url } from '../config/Constants';
import PhoneInput from "react-native-phone-number-input";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';

const ForgotPassword = () => {

  const navigation = useNavigation();
  const [validation,setValidation] = useState(false); 
  const phone_ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formattedValue, setFormattedValue] = useState("");
  const [value, setValue] = useState("");

  // useEffect(() => {
  //   setTimeout(() => {
  //     phone_ref.current.focus();
  //   }, 5000);
  // },[]);

  const phone_validation = async() => {
    Keyboard.dismiss();
    if(phone_ref.current?.isValidNumber(value)){
      console.log("1")
      await setValidation(true);
      get_forgot_password( )
    }else if(!phone_ref.current.isValidNumber()){
      console.log("2")
      await setValidation(false);
      alert('Please enter valid phone number')
    }else{
      console.log("3")
      await setValidation(true);
      get_forgot_password( )
    }
  }

  const get_forgot_password = async() =>{
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + forget_password,
      data:{ phone_with_code:formattedValue }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        navigation.navigate('Otp',{ data : response.data.result })
      }else{
        alert(response.data.result)
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }
  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const keyExtractor = (item) => item.title;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView style={{ padding:20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
      <Loader visible={loading} />
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:100 , justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Enter your phone number</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>We will send you an one time password on this mobile number</Text>
        <View style={{ margin:10 }}/>
        <PhoneInput
          ref={phone_ref}
          defaultValue={value}
          defaultCode="IN"
          onChangeText={(text) => {
              setValue(text);
          }}
          onChangeFormattedText={(text) => {
              setFormattedValue(text);
          }}
          withDarkTheme
          autoFocus
        />
        <View style={{ margin:20 }}/>
        <TouchableOpacity  onPress={phone_validation.bind(this)}  style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Submit</Text>
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
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
    backgroundColor:colors.theme_bg_three
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
  flag_style:{
    width: 38, 
    height: 24
  },
  country_text:{
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    color:colors.theme_fg_two,
    fontSize:14
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
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 96, 
  },
  image: {
    width: 320,
    height: 320,
    marginTop: 32,
  },
  title: {
    fontSize: 25,
    color:colors.theme_fg_two,
    fontFamily:bold,
    textAlign: 'center',
  },
  text:{
    fontSize:14,
    fontFamily:regular,
    color:colors.grey,
    marginTop:20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'justify',
    padding:10,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: colors.theme_bg,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ForgotPassword;