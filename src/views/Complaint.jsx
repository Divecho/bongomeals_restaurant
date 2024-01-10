import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Image, BackHandler, FlatList,StatusBar} from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold, veg, delivery, order_accept, api_url, order_request, img_url, restaurant_complaints, no_data_lottie } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';
import DropShadow from 'react-native-drop-shadow';
import LottieView from 'lottie-react-native';

const Complaint = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]); 
  const [count, setCount] = useState(''); 

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await get_complaints();
    });
    return unsubscribe;
  },[]);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }
    
  const get_complaints = async(type, id) => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + restaurant_complaints,
      data:{ restaurant_id:global.id }
    })
    .then(async response => {
      setLoading(false);
      setComplaints(response.data.result);
      setCount(response.data.result.length);
    })
    .catch(error => {
      setLoading(false);
      alert('Something went wrong')
    });
  }

  const navigate = () =>{
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
                <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:13, letterSpacing:1 }}>for Order Id - {item.order_id}</Text>
              </View>
            </View>

            <View style={{ margin:4 }} />
            <View style={{ flexDirection:'row', backgroundColor:colors.theme_bg_three, borderTopWidth:1.5, borderColor:colors.light_grey, }}/>
          </View> 
          <View style={{ margin:5 }} />
          <View style={{ flexDirection:'row', padding:10,}}> 
            <View style={{ width:'10%', alignItems:'flex-start', justifyContent:'center'}}>
              <Icon type={Icons.Ionicons} name="reader-outline" color={colors.theme_fg_two} style={{ fontSize:25, color:colors.theme_fg }} />
            </View>
            <View style={{ width:'90%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ color:colors.theme_fg_two, fontSize:10, fontFamily:regular,}}>{item.complaint}</Text>
            </View>
          </View>
          <View style={{ margin:5 }} />
        </DropShadow>
      </View> 
    </View>   
  );

  return( 
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView style={{  padding: 10 }} showsVerticalScrollIndicator={false} >
        <Loader visible={loading} />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
          </TouchableOpacity>
          <View style={{ width:'75%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Customer Complaint</Text>
          </View>
        </View>
        <View style={{ margin:10 }} />
        {count == 0 ?
          <View> 
            <View style={{ margin:'15%' }}>
              <View style={{ height:250 }}>
                <LottieView source={no_data_lottie} autoPlay loop />
              </View>
            </View>
            <Text style={{ alignSelf:'center', fontFamily:bold, fontSize:14}}>Sorry no data found.</Text>
          </View>
          :
          <FlatList
            data={complaints}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        }
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
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
  },
  
});

export default Complaint;
