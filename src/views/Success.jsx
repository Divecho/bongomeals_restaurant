import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity,StatusBar } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, success_lottie } from '../config/Constants';
import LottieView from 'lottie-react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';

const Success = () => {
  const navigation = useNavigation();

  const navigate = async() => {
    navigation.dispatch(
      CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
      })
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <View style={{ height:'100%',width: '100%', justifyContent:'center'}}>
        <View style={{ height:250 }}>
          <LottieView source={success_lottie} autoPlay loop />
        </View>
        <View style={{ margin:10}} />
        <View style={{alignItems: 'center', justifyContent:'center'}}>
          <Text style={{fontFamily:bold, fontSize:20, color:colors.green,}}>Registered Successfully</Text>
        </View>
        <View style={{ margin:20}} /> 
        <TouchableOpacity onPress={navigate} style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  button: {
    padding:10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'94%',
    marginLeft:'3%',
    marginRight:'3%',
  },
});

export default Success;
