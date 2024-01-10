import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList ,StatusBar} from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, ellipsis, pending_order_list, api_url, empty_lottie, dashboard, img_url } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import DropShadow from 'react-native-drop-shadow';
import axios from 'axios';
import { Loader } from '../components/Loader';
import Moment from 'moment';
import LottieView from 'lottie-react-native';

const OngoingOrders = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [order_list, setOrderList] = useState([]);
  const [count, setCount] = useState('');
  const [pending_count, setPendingCount] = useState(0);
  const [picked_up_count, setPickedUpCount] = useState(0);
  const [completed_count, setCompletedCount] = useState(0);

  const handleBackButtonClick= () => {
    navigation.goBack()
  } 
  
  const order_details = (id) => {
    navigation.navigate("OrderSummery", {id:id})
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await get_orders();
    });
    return unsubscribe;
  },[]);

  const get_orders = async() => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + pending_order_list,
      data:{ restaurant_id:global.id }
    })
    .then(async response => {
      setLoading(false);
      setOrderList(response.data.result.orders)   
      setCount(response.data.result.orders.length)
      setPendingCount(response.data.result.pending_orders)
      setPickedUpCount(response.data.result.picked_orders)
      setCompletedCount(response.data.result.completed_orders)
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong')
    });
  }

  const order_accept = (id) =>{
    navigation.navigate("OrderDetails", { id:id})
  }

  const renderItem = ({ item }) => (
    <View style={{ padding:5}} >
      <TouchableOpacity onPress={order_details.bind(this,item)} activeOpacity={1}  >
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
          <View style={{backgroundColor:colors.theme_bg_three}}>
            <View style={{ flexDirection:'row', padding:15,}}>
              <View style={{ width:'100%', alignItems:'flex-start', justifyContent:'center'}}>
                {item.order_type == 0 ?
                  <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:12 }}>Delivery Time - {Moment(item.order_date).format('hh:mm A')} <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:14 }}>[ INSTANT ORDER ]</Text></Text>
                  :
                  <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:12 }}>{Moment(item.created_at).format('MMM DD, YYYY hh:mm A')} <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:14 }}>[ FUTURE ORDER ]</Text></Text>
                }
                <View style={{ margin:4 }} />
                <Text style={{ color:colors.light_blue, fontFamily:bold, fontSize:8, letterSpacing:1 }}>{item.customer_name}'S ORDER NO - {item.id}</Text>
              </View>
            </View>
            <View style={{ flexDirection:'row', backgroundColor:colors.theme_bg_three, borderTopWidth:0.5, borderColor:colors.regular_grey, }}/>
            {item.item_list.map((item) => {
              return (
                <View style={{ flexDirection:'row', backgroundColor:colors.theme_bg_three, padding:15 }}>
                  <View style={{ alignItems:'flex-start', width:'6%'}}>
                    <Image style={{ height: 15, width: 15 }} source={{uri: img_url + item.icon}} />
                  </View>
                  <View style={{ alignItems:'flex-start', width:'50%'}}>
                    <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold}}>{item.quantity} x {item.item_name}</Text>
                  </View>
                  <View style={{ alignItems:'flex-end', width:'44%'}}>
                    <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold}}>{global.currency}{item.total}</Text>
                  </View>
                </View> 
              );
            })}
            <View style={{ flexDirection:'row', backgroundColor:colors.theme_bg_three, borderTopWidth:0.5, borderColor:colors.regular_grey, padding:15 }}>
              <Text style={{ fontSize:12, color:colors.regular_grey, fontFamily:bold}}>Total bill: {global.currency}{item.total}</Text>
            </View>     
          </View> 
          <TouchableOpacity onPress={order_details.bind(this,item)} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>{item.status}</Text>
          </TouchableOpacity>
        </DropShadow>
        <View style={{ margin:10 }}/>
      </TouchableOpacity>
    </View>  
    );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView style={{ padding: 10 }} showsVerticalScrollIndicator={false}>
      <Loader visible={loading} />
        <View style={{ margin:10}} />
        <View style={{flexDirection:'row'}}>
          <View style={{ width:'90%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.green, fontFamily:bold, fontSize:14 }}>Outlet Online</Text>
            <View style={{ margin:4}} />
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Accepting orders</Text>
          </View>
        </View>
        <View style={{ margin:10 }}/>
        <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, padding:10, alignItems:'center', justifyContent:'center'}}>
          <View style={{ borderWidth:1, borderColor:colors.regular_grey, padding:10,fontFamily:regular, borderRadius:10, width:'30%',padding:2, flexDirection:'column'}}>
            <Text style={{fontSize:14,color:colors.theme_fg_two, textAlign:'center'}}>Pending</Text>  
            <View style={{ margin:2 }} />
            <Text style={{fontSize:14,color:colors.theme_fg_two, textAlign:'center'}}>({pending_count})</Text> 
          </View>  
          <View style={{margin:5}}/>
          <View style={{ borderWidth:1, borderColor:colors.regular_grey, padding:10,fontFamily:regular, borderRadius:10, width:'30%',padding:2, flexDirection:'column'}}>
            <Text style={{fontSize:14,color:colors.theme_fg_two, textAlign:'center'}}>Picked Up</Text>  
            <View style={{ margin:2 }} />
            <Text style={{fontSize:14,color:colors.theme_fg_two, textAlign:'center'}}>({picked_up_count})</Text> 
          </View> 
          <View style={{margin:5}}/>
          <View style={{ borderWidth:1, borderColor:colors.regular_grey, padding:10,fontFamily:regular, borderRadius:10, width:'30%',padding:2, flexDirection:'column'}}>
            <Text style={{fontSize:14,color:colors.theme_fg_two, textAlign:'center'}}>Completed</Text> 
            <View style={{ margin:2 }} /> 
            <Text style={{fontSize:14,color:colors.theme_fg_two, textAlign:'center'}}>({completed_count})</Text> 
          </View> 
        </View>
        <View style={{ margin:10 }}/>
        {count == 0 ?
          <View style={{marginTop:'30%'}}>
            <View style={{ height:250 }}>
              <LottieView source={empty_lottie} autoPlay loop />
            </View>
            <Text style={{ alignSelf:'center', fontFamily:bold, fontSize:14}}>Sorry no data found</Text>
          </View>
        :
          <FlatList
            data={order_list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        }
        <View style={{ margin:40 }}/>
      </ScrollView>
    </SafeAreaView>  
  )
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
    padding:15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    margin:10
  },
});

export default OngoingOrders;
