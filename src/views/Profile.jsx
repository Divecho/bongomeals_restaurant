import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, Dimensions ,StatusBar} from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, regular, bold, customer_profile_update, api_url, profile_img, get_profile, profile_update, save_profile_picture, profile_picture_update, img_url } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import ImgToBase64 from 'react-native-image-base64';
import { connect } from 'react-redux'; 
import { addRestaurantName, addRestaurantEmail, addRestaurantProfilePicture} from '../actions/RestaurantRegisterActions';

const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery',
  base64: true,
  quality:1, 
  maxWidth: 500, 
  maxHeight: 500,
};

const Profile = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [validation,setValidation] = useState(false);
  const phone_ref = useRef(null); 
  const [restaurant_name, setRestaurantName] = useState("");
  const [email, setEmail] = useState(""); 
  const [img_data,setImgData] = useState(""); 
  const [profile_image,setProfileImage] = useState(""); 
  const [profile_timer,setProfileTimer] = useState(true);

  const handleBackButtonClick= () => {
    navigation.goBack()
  } 

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      view_profile();
    });
    return unsubscribe;
  },[]);

  const profile_validation = async() =>{
    if(!props.restaurant_name || !props.restaurant_email){
      alert('Please enter profile details.')
      await setValidation(false);
    }else{
      await setValidation(true);
      get_profile_update();
    }
  }

  const get_profile_update = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + profile_update,
      data:{ id: global.id, email:props.restaurant_email, restaurant_name:props.restaurant_name }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        saveData(response.data)
      }else{
        alert(response.data.message)
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const saveData = async(data) =>{
    try{
        await AsyncStorage.setItem('restaurant_name', data.result.restaurant_name.toString());
        await AsyncStorage.setItem('email', data.result.email.toString());

        await props.addRestaurantName(data.result.restaurant_name.toString());
        await props.addRestaurantEmail(data.result.email.toString());
        //await view_profile();
        await handleBackButtonClick();
      }catch (e) {
        alert(e);
    }
  }

  const select_photo = async () => {
    if(profile_timer){
      ImagePicker.launchImageLibrary(options, async(response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          const source =  await response.assets[0].uri;
            await setImgData(response.data)
            await ImgToBase64.getBase64String(response.assets[0].uri)
          .then(async base64String => {
            await profileimageupdate(base64String);
            await setProfileImage(response.assets[0].uri);
          }
            )
          .catch(err => console.log(err));
          
          await profileimageupdate();
        }
      });
    }else{
      alert('Please try after 20 seconds');
    }
  }

  const profileimageupdate = async(img_data) =>{
    console.log("img_data ", img_data);
    await setLoading(true);
    RNFetchBlob.fetch('POST', api_url + save_profile_picture, {
      'Content-Type' : 'multipart/form-data',
    }, [
      {  
        name : 'image',
        filename : 'image.png', 
        type:'image/png', 
        data: img_data
      }
    ]).then(async (resp) => { 
      console.log("resp ", resp);
      await setLoading(false);
      let data = await JSON.parse(resp.data);
      if(data.result){
        await profile_image_update(data.result);
        await setProfileTimer(false);
        await setTimeout(function(){setProfileTimer(true)}, 20000)
      }
    }).catch((err) => {
        setLoading(false);
        alert('Error on while upload try again later.')
    })
  }

  const profile_image_update = async (data) => {
    setLoading(true);
      await axios({
        method: 'post', 
        url: api_url+profile_picture_update,
        data: {id:global.id, restaurant_image:data}
      })
      .then(async response => {
        setLoading(false);
        console.log(response)
        if(response.data.status == 1){
          alert("Update Successfully")
          saveProfilePicture(data);
        }else{
          alert(response.data.message)
        }
      })
      .catch(error => {
          setLoading(false);
          alert("Sorry something went wrong")
      });
  }

  const saveProfilePicture = async(data) =>{
    try{
        await AsyncStorage.setItem('profile_picture', data.toString());
        view_profile();
        await props.addRestaurantProfilePicture(data.toString());
      }catch (e) {
        alert(e);
    }
  }

  const view_profile = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + get_profile,
      data:{ id: global.id }
    })
    .then(async response => {
      setLoading(false);
      props.addRestaurantName(response.data.result.restaurant_name);
      props.addRestaurantEmail(response.data.result.email);
      props.addRestaurantProfilePicture(response.data.result.restaurant_image);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const change_password = () =>{
    navigation.navigate("ResetPassword", {from:"profile", id:global.id})
  }

  return( 
  <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor={colors.theme_bg}/>
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
      <Loader visible={loading} />
      <View style={{ padding:20 }}>
        <View style={{ margin:90 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Name"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            onChangeText={text => props.addRestaurantName(text)}
            value={props.restaurant_name}
          />
        </View>
        <View style={{ margin:5 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Name"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            value={props.restaurant_phone_with_code}
          />
        </View>
        <View style={{ margin:5 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Email"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            onChangeText={text => props.addRestaurantEmail(text)}
            value={props.restaurant_email}
          />
        </View>
        <View style={{ margin:20 }}/>
        <TouchableOpacity onPress={profile_validation.bind(this)}  style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Submit</Text>
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
        <TouchableOpacity onPress={change_password} style={styles.password_button}>
          <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:14}}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    <View style={{  width:'100%',flexDirection:'row',height:120, backgroundColor:colors.theme_fg, position:'absolute', top:0,  borderBottomRightRadius:40}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'15%',justifyContent:'flex-start', alignItems:'flex-start' }}>
          <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_three} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ width:'85%',justifyContent:'flex-start', alignItems:'flex-start', padding:5 }}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:20 }}>Profile Settings</Text>
        </View>
      </View>
    </View>
    <TouchableOpacity onPress={select_photo.bind(this)} style={styles.box}>
      <View onPress={select_photo.bind(this)} style={styles.profile} >
        <Image style= {{ height: undefined,width: undefined, flex:1, borderRadius:50 }} source={{ uri : img_url + props.restaurant_profile_picture}} />
      </View>
    </TouchableOpacity>
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
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg
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
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'flex-start',
    flexDirection:'row',
    shadowColor: '#ccc',
    padding:10
  },
  box:{
    position:'absolute',
    left:(Dimensions.get('window').width / 2) - 50,
    top: 70,
    backgroundColor:colors.theme_bg_three,
    width: 100,
    height: 100,
    borderRadius: 60
  },
  profile:{
    width: 100,
    height: 100,
    borderRadius: 50
  },
  password_button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:colors.theme_fg,
    borderWidth:1
  },
});

function mapStateToProps(state){
  return{
    restaurant_name : state.restaurant_register.restaurant_name,
    restaurant_email : state.restaurant_register.restaurant_email,
    restaurant_profile_picture : state.restaurant_register.restaurant_profile_picture,
    restaurant_phone_with_code : state.restaurant_register.restaurant_phone_with_code,
    
  };
}

const mapDispatchToProps = (dispatch) => ({
  addRestaurantName: (data) => dispatch(addRestaurantName(data)),
  addRestaurantEmail: (data) => dispatch(addRestaurantEmail(data)),
  addRestaurantProfilePicture: (data) => dispatch(addRestaurantProfilePicture(data)),
    
});

export default connect(mapStateToProps,mapDispatchToProps)(Profile);
