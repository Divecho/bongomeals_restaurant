import { Dimensions } from 'react-native';

export const settings = "restaurant/app_setting";
export const base_url = "https://bongomeals.com/";
export const api_url  = "https://bongomeals.com/api/";
export const img_url  = "https://bongomeals.com/uploads/";
export const faq = "restaurant/faq";
export const privacy = "restaurant/privacy_policy";
export const app_name = "Bongomeals";
export const register = "restaurant/register"; 
export const restaurant_login = "restaurant/login";
export const change_online_status = "restaurant/change_online_status";
export const restaurant_menu = "restaurant/get_menu";
export const wallet_histories = "restaurant/wallet_histories";
export const get_orders_list = "restaurant/get_orders";
export const get_categories = "customer/get_categories";
export const restaurant_add_item = 'store-item'
export const item_image_upload = 'item_image_upload'
export const dashboard = "restaurant/dashboard";
export const order_accept = "restaurant/order_accept";
export const pending_order_list = "restaurant/get_pending_orders";
export const stock_update = "restaurant/stock_update"; 
export const forget_password = "restaurant/forget_password";
export const reset_password = "restaurant/reset_password"; 
export const order_request = "restaurant/get_order_request";
export const restaurant_order_detail = "restaurant/get_restaurant_order_detail"; 
export const get_profile = "restaurant/get_profile";
export const profile_update = "restaurant/profile_update";
export const save_profile_picture = "restaurant/restaurant_image";
export const profile_picture_update = "restaurant/restaurant_image_update";
export const order_status_change = "order_status_change"; 
export const restaurant_complaints = "restaurant/get_complaints"; 
export const withdrawal_request = "restaurant/withdrawal_request";
export const withdrawal_history = "restaurant/withdrawal_history"; 

//Size
export const screenHeight = Math.round(Dimensions.get('window').height);
export const height_40 = Math.round(40 / 100 * screenHeight);
export const height_50 = Math.round(50 / 100 * screenHeight);
export const height_60 = Math.round(60 / 100 * screenHeight);
export const height_35 = Math.round(35 / 100 * screenHeight);
export const height_20 = Math.round(20 / 100 * screenHeight);
export const height_30 = Math.round(30 / 100 * screenHeight);
export const height_70 = Math.round(70 / 100 * screenHeight);

//Path

export const home_banner = require('.././assets/img/home_banner.jpeg');
export const veg = require('.././assets/img/veg.png');
export const non_veg = require('.././assets/img/non_veg.png');
export const email = require('.././assets/img/email.png');
export const profile_img = require('.././assets/img/profile.png');
export const logo_with_name = require('.././assets/img/logo_with_name.png');
export const wallet = require('.././assets/img/wallet.png');
export const wallet_money = require('.././assets/img/wallet_money.png');
export const biryani = require('.././assets/img/biryani.jpeg');
export const biryani_corner = require('.././assets/img/biryani_corner.jpeg');
export const edit = require('.././assets/img/edit.png');
export const splash_image = require('.././assets/img/splash_image.png');
export const restaurant = require('.././assets/img/restaurant.png');
export const visa = require('.././assets/img/visa.png');
export const paypal = require('.././assets/img/paypal.png');
export const mastro = require('.././assets/img/mastro.png');
export const burger = require('.././assets/img/burger.webp');
export const location = require('.././assets/img/location.png');
export const notification = require('.././assets/img/notification.png');
export const credit_card = require('.././assets/img/credit_card.jpeg');
export const profile = require('.././assets/img/profile.png');
export const navigate = require('.././assets/img/navigate.png');
export const cancel = require('.././assets/img/cancel.png');


//Lottie
export const empty_lottie = require('.././assets/json/empty.json');
export const notification_lottie = require('.././assets/json/notification.json');
export const address_lottie = require('.././assets/json/address.json');
export const success_lottie = require('.././assets/json/success.json');
export const closed_lottie = require('.././assets/json/closed.json');
export const delivery = require('.././assets/json/delivery.json');
export const empty_wallet = require('.././assets/json/empty_wallet.json');
export const online_lottie = require('.././assets/json/online.json');
export const offline_lottie = require('.././assets/json/offline.json');
export const no_menu_lottie = require('.././assets/json/no_menu.json');
export const no_data_lottie = require('.././assets/json/no_data.json');
export const withdraw_lottie = require('.././assets/json/withdraw.json');

//Font Family
export const light  = "Metropolis-Light";
export const regular  = "CheyenneSans-Regular";
export const bold  = "Metropolis-Bold";

//Map
export const GOOGLE_KEY = "AIzaSyCp77n_8Z2QDcWMebzUwHK_z3Q1ibZifkA";
export const LATITUDE_DELTA = 0.0150;
export const LONGITUDE_DELTA =0.0152;

//More Menu
export const menus = [
  {
    menu_name: 'Profile',
    icon: 'person',
    route:'Profile'
  },
  {
    menu_name: 'Manage Addresses',
    icon: 'pin',
    route:'AddressList'
  },
  {
    menu_name: 'Wallet',
    icon: 'wallet',
    route:'Wallet'
  },
  {
    menu_name: 'Faq',
    icon: 'help',
    route:'Faq'
  },
  {
    menu_name: 'Privacy Policy',
    icon: 'alert',
    route:'PrivacyPolicy'
  },
  {
    menu_name: 'Contact Us',
    icon: 'call',
    route:'ContactUs'
  },
  {
    menu_name: 'Logout',
    icon: 'log-out',
    route:'Logout'
  },
]

