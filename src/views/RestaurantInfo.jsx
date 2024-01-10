import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Keyboard,StatusBar } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import PhoneInput from "react-native-phone-number-input";
import { connect } from 'react-redux'; 
import { addRestaurantName, addRestaurantAddress, addRestaurantContactPerson, addRestaurantPhoneWithCode, addRestaurantPhoneNumber} from '../actions/RestaurantRegisterActions';
import { Loader } from '../components/Loader';

const RestaurantInfo = (props) => {
  const navigation = useNavigation();
  const phone_ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [validation,setValidation] = useState(false); 
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const phone_reference = () =>{
    setTimeout(() => {
      phone_ref.current.focus();
    }, 200);
  }

  const check_validation = async() => {
    Keyboard.dismiss();
    if(!props.restaurant_name || !props.restaurant_address || !props.restaurant_contact_person ){
      await setValidation(false);
      alert('Please fill all the details.')
    }else if(value == ""){
      await setValidation(false);
      alert('Please enter your phone number')
    }else if(!phone_ref.current?.isValidNumber(value)){
      await setValidation(false);
      alert('Please enter valid phone number')
    }else{
      await setValidation(true);
      props.addRestaurantPhoneWithCode(formattedValue)
      props.addRestaurantPhoneNumber(value)
      restaurant_google_address();
    }
  }

  const restaurant_google_address = async() =>{
    navigation.navigate('RestaurantLocation');
  }

   useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
          <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Restaurant Info</Text>
          <View style={{ margin:10 }}/>
          <View
            style={styles.textFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Restaurant Name"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              onChangeText={text => props.addRestaurantName(text)}
            />
          </View>
          <View style={{ margin:10 }}/>
          <View style={{ alignItems:'center', justifyContent:'center' }}>
            <PhoneInput
              ref={phone_ref}
              defaultValue={value}
              defaultCode="IN"
              onChangeText={(text) => {
                  setValue(text);
              }}

              codeTextStyle={{ placeholderTextColor: colors.theme_fg_two }}
              onChangeFormattedText={(text) => {
                  setFormattedValue(text);
              }}
              withDarkTheme
              autoFocus
            />
          </View>
          <View style={{ margin:10 }}/>
          <View
            style={styles.phoneFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Contact Person Name"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              onChangeText={text => props.addRestaurantContactPerson(text)}
            />
          </View>
          <View style={{ margin:22 }}/>
          <View
            style={styles.textFieldcontainer}>
            <TextInput
              style={styles.input}
              placeholder="Restaurant Address"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              onChangeText={text => props.addRestaurantAddress(text)}
              multiline={true}
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          <View style={{ margin:30 }}/>
          <View style={{ left:0, right:0, alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity  onPress={check_validation}  style={styles.button}>
              <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Select Restaurant Location</Text>
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
  phoneFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
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
  input: {
    width:'100%',
    height:100,
    borderColor:colors.light_grey,
    borderWidth:1,
    backgroundColor:colors.theme_bg_three,
    borderRadius:10,
    padding:10,
    marginTop: 5,
    color:colors.theme_fg_two
  },
});

function mapStateToProps(state){
  return{
    restaurant_name : state.restaurant_register.restaurant_name,
    restaurant_address : state.restaurant_register.restaurant_address,
    restaurant_contact_person : state.restaurant_register.restaurant_contact_person,
    restaurant_phone_with_code : state.restaurant_register.restaurant_phone_with_code,
    restaurant_phone_number : state.restaurant_register.restaurant_phone_number,
    
  };
}

const mapDispatchToProps = (dispatch) => ({
    addRestaurantName: (data) => dispatch(addRestaurantName(data)),
    addRestaurantAddress: (data) => dispatch(addRestaurantAddress(data)),
    addRestaurantContactPerson: (data) => dispatch(addRestaurantContactPerson(data)),
    addRestaurantPhoneWithCode: (data) => dispatch(addRestaurantPhoneWithCode(data)),
    addRestaurantPhoneNumber: (data) => dispatch(addRestaurantPhoneNumber(data)),
    
});

export default connect(mapStateToProps,mapDispatchToProps)(RestaurantInfo);
