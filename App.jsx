import React, { useEffect, useRef } from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon, { Icons } from './src/components/Icons';
import * as colors from './src/assets/css/Colors';
import { img_url } from './src/config/Constants';
import * as Animatable from 'react-native-animatable'; 

/* Screens */
import Splash from './src/views/Splash';
import Login from './src/views/Login';
import More from './src/views/More';
import FaqCategories from './src/views/FaqCategories';
import FaqDetails from './src/views/FaqDetails';
import Wallet from './src/views/Wallet';
import Faq from './src/views/Faq';
import PrivacyPolicies from './src/views/PrivacyPolicies';
import Menu from './src/views/Menu';
import OngoingOrders from './src/views/OngoingOrders';
import Home from './src/views/Home';
import Profile from './src/views/Profile';
import MyOrders from './src/views/MyOrders';
import Complaint from './src/views/Complaint';
import Register from './src/views/Register';
import RestaurantInfo from './src/views/RestaurantInfo';
import RestaurantLocation from './src/views/RestaurantLocation';
import Success from './src/views/Success';
import MyOrderDetails from './src/views/MyOrderDetails';
import OrderRequest from './src/views/OrderRequest';
import AboutUs from './src/views/AboutUs';
import ResetPassword from './src/views/ResetPassword';
import Otp from './src/views/Otp';
import OrderSummery from './src/views/OrderSummery';
import ForgotPassword from './src/views/ForgotPassword';
import Withdrawal from './src/views/Withdrawal';
import AddNewItemScreen from './src/views/addNewItem/addNewItemScreen';
import WelcomeScreen from './src/views/Welcome';


const TabArr = [
  { route: 'Home', label: 'Home', type: Icons.Feather, icon: 'home', component: Home },
  { route: 'Menu', label: 'Menu', type: Icons.Feather, icon: 'coffee', component: Menu },
  { route: 'OngoingOrders', label: 'Ongoing Orders', type: Icons.Feather, icon: 'shopping-bag', component: OngoingOrders },
  { route: 'More', label: 'More', type: Icons.Feather, icon: 'more-horizontal', component: More },
];

const Tab = createBottomTabNavigator();

const animate1 = { 0: { scale: .5, translateY: 7 }, .92: { translateY: -34 }, 1: { scale: 1.2, translateY: -24 } }
const animate2 = { 0: { scale: 1.2, translateY: -24 }, 1: { scale: 1, translateY: 7 } }

const circle1 = { 0: { scale: 0 }, 0.3: { scale: .9 }, 0.5: { scale: .2 }, 0.8: { scale: .7 }, 1: { scale: 1 } }
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } }

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({ scale: 1 });
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({ scale: 0 });
    }
  }, [focused])

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animatable.View
        ref={viewRef}
        duration={1000}
        style={styles.container}>
        <View style={styles.btn}>
          <Animatable.View
            ref={circleRef}
            style={styles.circle} />
          <Icon type={item.type} name={item.icon} color={focused ? colors.theme_fg_three : colors.theme_fg} />
        </View>
        <Animatable.Text
          ref={textRef}
          style={styles.text}>
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  )
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen key={index} name={item.route} component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />
            }}
          />
        )
      })}
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={({ route, navigation })  => ({
                        ...TransitionPresets.SlideFromRightIOS,
                    })}>
        <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}}/>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={TabNavigator} options={{headerShown: false}}/>
        <Stack.Screen name="FaqCategories" component={FaqCategories} options={{headerShown: false}}/>
        <Stack.Screen name="FaqDetails" component={FaqDetails} options={{headerShown: false}}/>
        <Stack.Screen name="Faq" component={Faq} options={{headerShown: false}}/>
        <Stack.Screen name="Wallet" component={Wallet} options={{headerShown: false}}/>
        <Stack.Screen name="PrivacyPolicies" component={PrivacyPolicies} options={{headerShown: false}}/>
        <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
        <Stack.Screen name="AddItem" component={AddNewItemScreen} options={{headerShown: false}}/>
        <Stack.Screen name="MyOrders" component={MyOrders} options={{headerShown: false}}/>
        <Stack.Screen name="Complaint" component={Complaint} options={{headerShown: false}}/>
        <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
        <Stack.Screen name="RestaurantLocation" component={RestaurantLocation} options={{headerShown: false}}/>
        <Stack.Screen name="RestaurantInfo" component={RestaurantInfo} options={{headerShown: false}}/>
        <Stack.Screen name="Success" component={Success} options={{headerShown: false}}/>
        <Stack.Screen name="MyOrderDetails" component={MyOrderDetails} options={{headerShown: false}}/>
        <Stack.Screen name="OrderRequest" component={OrderRequest} options={{headerShown: false}}/>
        <Stack.Screen name="AboutUs" component={AboutUs} options={{headerShown: false}}/>
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{headerShown: false}}/>
        <Stack.Screen name="Otp" component={Otp} options={{headerShown: false}}/>
        <Stack.Screen name="OrderSummery" component={OrderSummery} options={{headerShown: false}}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{headerShown: false}}/>
        <Stack.Screen name="Withdrawal" component={Withdrawal} options={{headerShown: false}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: 70,
    position: 'absolute',
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: colors.theme_fg_three,
    backgroundColor: colors.theme_fg_three,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_fg,
    borderRadius: 25,
  },
  text: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.theme_fg,
  }
})

export default App;