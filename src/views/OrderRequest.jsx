import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Image, BackHandler, FlatList,StatusBar} from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold, veg, delivery, order_accept, api_url, order_request, img_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';
import DropShadow from 'react-native-drop-shadow';
import LottieView from 'lottie-react-native';
import Moment from 'moment';

var Sound = require('react-native-sound');

Sound.setCategory('Playback');

var whoosh = new Sound('uber.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // loaded successfully
  console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

});

const OrderRequest = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState([]); 

  useEffect(() => {
    get_order_request();
    whoosh.play();
    whoosh.setNumberOfLoops(-1);
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
      return () => backHandler.remove()

    const _unblur = navigation.addListener('blur', async () => {
      whoosh.stop();
    });
    console.log("Hello NAren")
    return _unblur;
  },[]);
    
  const accept = async(type, id) => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + order_accept,
      data:{ order_id:id, type:type, restaurant_id:global.id }
    })
    .then(async response => {
      setLoading(false);
      get_order_request();
    })
    .catch(error => {
      setLoading(false);
      alert('Something went wrong')
    });
  }

  const get_order_request = async(type) => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + order_request,
      data:{ restaurant_id:global.id }
    })
    .then(async response => {
      setLoading(false);
      setRequest(response.data.result)
      if(response.data.result.length == 0){
        navigate();
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Something went wrong')
    });
  }

  const navigate = () =>{
    whoosh.stop();
    navigation.navigate("Home")
  }

  const renderItem = ({ item }) => (
    <View style={{ paddingTop:10, paddingBottom:10}}>
      <View style={{ padding:10 }}>
      <DropShadow
        style={{
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
          <View style={styles.restaurant_container}>
            <View style={{ flexDirection:'row', padding:10,}}>  
              <View style={{  width:'60%', alignItems:'flex-start', justifyContent:'flex-start'}}>
                <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:14 }}>{item.customer_name}</Text>
              </View>
              <View style={{ width:'40%', alignItems:'flex-end', justifyContent:'center'}}>
                <Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:10, letterSpacing:1 }}>{global.currency}{item.total}</Text>
              </View>
            </View>
            <View style={{ flexDirection:'row', padding:10, width:'100%', alignItems:'flex-start', justifyContent:'flex-start'}}>  
              {item.order_type == 1?
                <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:14 }}>FUTURE ORDER - {Moment(item.order_date).format('hh:mm A')}</Text>
                :
                <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:14 }}>INSTANT ORDER</Text>
              }
              </View>
            <View style={{ flexDirection:'row', padding:10,}}> 
              <View style={{  width:'60%', alignItems:'flex-start', justifyContent:'flex-start'}}>
                <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:12 }}>Order Items</Text>
                <View style={{ margin:5 }} />
                {item.item_list.map((item) => {
                  return (
                    <View>
                      <View style={{ flexDirection:'row', width:'60%',}}>
                        <Image style={{ height: 15, width: 15 }} source={{ uri: img_url + item.icon }} />
                        <View style={{ margin:4 }} />
                        <Text style={{ color:colors.light_blue, fontFamily:bold, fontSize:10, letterSpacing:1 }}>{item.quantity} x {item.item_name}</Text>
                      </View> 
                      <View style={{ margin:4 }} />
                    </View>
                  );
                })}
              </View>
            </View> 
            <View style={{ flexDirection:'row', backgroundColor:colors.theme_bg_three, borderTopWidth:1.5, borderColor:colors.light_grey, }}/>
          </View> 
          <View style={{ margin:5 }} />
          <View style={{ flexDirection:'row', padding:10,}}> 
            <View style={{ width:'10%', alignItems:'flex-start', justifyContent:'center'}}>
              <Icon type={Icons.Ionicons} name="location" color={colors.theme_fg_two} style={{ fontSize:25, color:colors.theme_fg }} />
            </View>
            <View style={{ width:'90%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ color:colors.theme_fg_two, fontSize:10, fontFamily:regular,}}>{item.address}</Text>
            </View>
          </View>
          <View style={{ margin:5 }} />
          <View style={{ flexDirection:'row', width:'100%', padding:10}}>
            <TouchableOpacity onPress={accept.bind(this,'reject', item.id)} style={{ width:'49%',margin:2, borderWidth:0.2, padding:10, borderRadius:10, borderColor:colors.red, backgroundColor:colors.red, alignItems:'center', justifyContent:'center'}}>
              <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_three}}>Decline</Text>  
            </TouchableOpacity>
            <TouchableOpacity onPress={accept.bind(this,'accept', item.id)} style={{ width:'49%',margin:2, borderWidth:0.2, padding:10, borderRadius:10, borderColor:colors.green, backgroundColor:colors.green, alignItems:'center', justifyContent:'center'}}>
              <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_three}}>Accept</Text>  
            </TouchableOpacity>
            <View style={{ marginLeft:'2%' }}/>
          </View> 
        </DropShadow>
      </View> 
    </View>   
  );

  return( 
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView style={{ padding: 10 }} showsVerticalScrollIndicator={false} >
        <Loader visible={loading} />
          <FlatList
            data={request}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  
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
  
});

export default OrderRequest;