import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, FlatList, Switch, StatusBar } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, non_veg, veg, restaurant_menu, api_url, img_url, stock_update, no_menu_lottie } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';
import LottieView from 'lottie-react-native';

const Menu = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [restaurant_category, setRestaurantCategory] = useState([]);
  const [restaurant_details, setRestaurantDetails] = useState(false);
  const [switch_value, setSwitchValue] = useState(false);
  const [count, setCount] = useState(false);

  useEffect(() => {
    console.log("global.id ", global.id)
    const unsubscribe = navigation.addListener('focus', async () => {
      await get_restaurant_menu();
    });
    return unsubscribe;
  }, []);

  const get_restaurant_menu = async () => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + restaurant_menu,
      data: { restaurant_id: global.id }
    })
      .then(async response => {
        setLoading(false);
        setRestaurantCategory(response.data.result.categories);
        setRestaurantDetails(response.data.result.restaurant);
        setCount(response.data.result.categories.length);
      })
      .catch(error => {
        setLoading(false);
        alert('Something went wrong')
      });
  }

  const update_stock = async (item_id, in_stock) => {
    console.log({ restaurant_id: global.id, item_id: item_id, in_stock: in_stock == true ? 1 : 0 })
    //setLoading(true);
    await axios({
      method: 'post',
      url: api_url + stock_update,
      data: { restaurant_id: global.id, item_id: item_id, in_stock: in_stock == true ? 1 : 0 }
    })
      .then(async response => {
        setLoading(false);
        get_restaurant_menu();
      })
      .catch(error => {
        setLoading(false);
        alert(error)
      });
  }

  const toggleSwitch = async (item_id, in_stock) => {
    await update_stock(item_id, !in_stock);
    //get_restaurant_menu();

    /*if(value){
      await setSwitchValue( value );
      await get_stock(1);
    }else{
      await setSwitchValue( value );
      await get_stock(0); 
    } */
  }

  const renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, borderColor: colors.light_grey, marginBottom: 10 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontFamily: bold, fontSize: 18, color: colors.theme_fg_two, letterSpacing: 1 }}>{item.category_name}</Text>
      </View>
      {item.data.map((category, index, i) => {
        return (
          <View>
            <View style={{ flexDirection: 'row', paddingBottom: 10, padding: 10 }}>
              <View style={{ width: '70%', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Image style={{ height: 15, width: 15 }} source={{ uri: img_url + category.icon }} />
                <View style={{ margin: 2 }} />
                <Text style={{ fontFamily: regular, fontSize: 14, color: colors.theme_fg_two, letterSpacing: 1 }}>{category.item_name}</Text>
                <View style={{ margin: 2 }} />
                <Text style={{ fontFamily: regular, fontSize: 12, color: colors.grey, letterSpacing: 1 }}>{global.currency}{category.base_price}</Text>
                <View style={{ margin: 2 }} />
                <Text style={{ fontFamily: regular, fontSize: 10, color: colors.grey, letterSpacing: 1 }}>{category.item_description}</Text>
              </View>
              <View style={{ width: '30%', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                <Image style={{ height: 90, width: 90, borderRadius: 10 }} source={{ uri: img_url + category.item_image }} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, borderColor: colors.light_grey, borderTopWidth: 1, }}>
              <View style={{ flexDirection: 'row', width: '65%', padding: 10 }}>
                <View style={{ width: '25%', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Switch
                    trackColor={{ false: "#767577", true: colors.theme_bg }}
                    thumbColor={switch_value ? "green" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch.bind(this, category.id, category.in_stock)}
                    value={Boolean(category.in_stock)}
                  />
                </View>
                {/*<View style={{ width:'75%', justifyContent:'center', alignItems:'flex-start'}}>
                <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>No time set time on manually</Text>
              </View>*/}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Loader visible={loading} />
        <View style={styles.header}>
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.theme_fg_two, fontFamily: bold, fontSize: 20 }}>Menu</Text>
          </View>
        </View>
        <View style={{ margin: 10 }} />
        <View style={{ flexDirection: 'row', padding: 10, paddingBottom: 15, borderBottomWidth: 1, borderColor: colors.light_grey, }}>
          <View style={{ width: '20%', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Image style={{ height: 50, width: 50, borderRadius: 5 }} source={{ uri: img_url + restaurant_details.restaurant_image }} />
          </View>
          <View style={{ width: '80%', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Text style={{ fontFamily: bold, fontSize: 18, color: colors.grey }}>{restaurant_details.restaurant_name}</Text>
            <View style={{ margin: 3 }} />
            <Text style={{ fontFamily: regular, fontSize: 12, color: colors.grey }}>{restaurant_details.cuisines}</Text>
          </View>
        </View>
        <View style={{ borderBottomWidth: 10, borderColor: colors.light_grey }} />
        <View style={{ margin: 10 }} />
        {count == 0 ?
          <View>
            <View style={{ margin: '15%' }}>
              <View style={{ height: 200 }}>
                <LottieView source={no_menu_lottie} autoPlay loop />
              </View>
            </View>
            <Text style={{ alignSelf: 'center', fontFamily: bold, fontSize: 14 }}>Waiting for uploading your menu.</Text>
          </View>
          :
          <FlatList
            data={restaurant_category}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        }
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme_bg_three,
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#ccc',
    padding: 10

  },

});

export default Menu;
