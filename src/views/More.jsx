import React, { useState} from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Modal ,StatusBar} from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, profile_img, change_online_status, api_url, img_url } from '../config/Constants';
import DropShadow from 'react-native-drop-shadow';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Loader } from '../components/Loader';
import { connect } from 'react-redux'; 
import { reset, addRestaurantOnlineStatus } from '../actions/RestaurantRegisterActions';
import Dialog from "react-native-dialog";

const More = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const next = async(name) => {
    if(name == 'Order History'){
      await navigation.navigate("MyOrders")
    }else if(name == 'Add Item'){
      await navigation.navigate("AddItem")
    }else if(name == 'Help Center'){
      await navigation.navigate("FaqCategories")
    }else if(name == 'Customer Complaint'){
      await navigation.navigate("Complaint")
    }else if(name == 'Wallet'){
      await navigation.navigate("Wallet")
    }else if(name == 'Withdrawal'){
      await navigation.navigate("Withdrawal")
    }else if(name == 'Privacy Policies'){
      await navigation.navigate("PrivacyPolicies")
    }else if(name == 'About Us'){
      await navigation.navigate("AboutUs")
    }else if(name == 'Logout'){
      await showDialog();
    }else if(name == 'Help'){
      await showSnackbar('Not Active')
    }
  }

  const online_status = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + change_online_status,
      data:{ id: global.id, is_open : 0 }
    })
    .then(async response => {
      setLoading(false);
      await props.addRestaurantOnlineStatus(0);
      await AsyncStorage.clear();
      await props.reset();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    })
    .catch( async error => {
      await props.addRestaurantOnlineStatus(0);
      await AsyncStorage.clear();
      await props.reset();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
      setLoading(false);
    });
  }

  const showDialog = async() => {
    await setShowModal(true);
  };

  const handleCancel = async() => {
    await setShowModal(false);
  };

  const handleLogout = async() => {
    setShowModal(false);
    online_status();
  };

 
  const DATA = [

    {
      title: 'Order History',
      icon:'cart-outline'
    },
    {
      title: 'Add Item',
      icon:'add'
    },
    {
      title: 'Wallet',
      icon:'wallet-outline'
    },
    {
     title: 'Withdrawal',
      icon:'cash'
    },
    {
     title: 'Help Center',
      icon:'help-outline'
    },
    {
      title: 'Privacy Policies',
      icon:'alert-circle-outline'
    },
    {
      title: 'Customer Complaint',
      icon:'people-outline'
    },
    {
      title: 'About Us',
      icon:'information-outline'
    },
    {
      title: 'Logout',
      icon:'log-out-outline'
    },
    
  ];

   const profile = () => {
    navigation.navigate("Profile")
  }


  const renderItem = ({ item }) => (
  <TouchableOpacity activeOpacity={1} onPress={next.bind(this,item.title)}>
  <Loader visible={loading} />
    <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
      <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
        <Icon type={Icons.Ionicons} name={item.icon} color={colors.grey} style={{ fontSize:20 }} />
      </View>  
      <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
        <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two}}>{item.title}</Text>
      </View>
      <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
        <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.grey} style={{ fontSize:15 }} />
      </View>  
    </View>
    <Modal animationType='slide' visible={showModal}>
      <View style={{margin: 20, backgroundColor: colors.theme_bg_three, borderRadius: 20, paddingTop: 35, paddingBottom: 10, alignItems: "center", justifyContent:'center', shadowColor: "#000", 
      shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5}}>

          <Text style={{textAlign:'center', color:colors.theme_fg_two, fontFamily: regular,}}>Need to logout?</Text>
          <View style={{ margin:10, borderBottomWidth: 0.5, borderColor:colors.theme_fg_two, width:'100%'}}/>
           <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center', width:'100%'}}>
            <TouchableOpacity onPress={handleLogout} style={{ width:'50%',  alignItems:'center', justifyContent:'center'}}>
              <Text style={{ textAlign:'center', color:colors.theme_fg_two, fontFamily: regular,}} >YES</Text>
            </TouchableOpacity>
            <View style={{ borderWidth:0.5, height:50 }}/>
            <TouchableOpacity onPress={handleCancel} style={{ width:'48%',  alignItems:'center', justifyContent:'center'}}>
              <Text style={{ textAlign:'center', color:colors.theme_fg_two, fontFamily: regular,}} >NO</Text>
            </TouchableOpacity>
          </View>

      
      </View>
    </Modal>
  </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView style={{ padding: 10 }} showsVerticalScrollIndicator={false}>
      <Loader visible={loading} />
        <View style={styles.header}>
          <View style={{ width:'100%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Settings</Text>
          </View>
        </View>
        <View style={{ margin:10 }} />
        <TouchableOpacity activeOpacity={1} onPress={profile}>
        <DropShadow
        style={{
          paddingLeft:10, 
          paddingRight:10, 
          marginLeft:5,
           marginRight:5, 
          backgroundColor:colors.theme_bg_three,
            width: '100%',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 0,
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
        }}
      >
              <View style={{ flexDirection:'row', paddingTop:15, paddingBottom:15}}>
                <View style={{ width:'20%',justifyContent:'center', alignItems:'flex-start' }}>
                  <Image style={{ height: 50, width: 50, borderRadius:25 }} source={{ uri : img_url + props.restaurant_profile_picture}} />
                </View>  
                <View style={{ width:'75%', justifyContent:'center', alignItems:'flex-start'}}>
                  <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two}}>{props.restaurant_name}</Text>
                <View style={{ margin:2 }} />
                  <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>Edit Profile</Text>   
                </View>
                <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
                  <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.grey} style={{ fontSize:15 }} />
                </View>  
              </View>
          </DropShadow>
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,

  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
  },
});

function mapStateToProps(state){
  return{
    restaurant_profile_picture : state.restaurant_register.restaurant_profile_picture,
    restaurant_name : state.restaurant_register.restaurant_name,
    
  };
}

const mapDispatchToProps = (dispatch) => ({
  reset: () => dispatch(reset()),
  addRestaurantOnlineStatus: (data) => dispatch(addRestaurantOnlineStatus(data)),
  
});


export default connect(mapStateToProps,mapDispatchToProps)(More);
