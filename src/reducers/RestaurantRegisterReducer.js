import * as Actions from '../actions/ActionTypes'
const RestaurantRegisterReducer = (state = { restaurant_online_status:1 ,restaurant_email:undefined , restaurant_profile_picture:undefined, restaurant_name: undefined, restaurant_address: undefined, restaurant_phone_with_code: undefined, restaurant_phone_number: undefined, restaurant_contact_person: undefined, restaurant_google_address: undefined, restaurant_lat: undefined, restaurant_lng: undefined, restaurant_pin_code: undefined, restaurant_user_name: undefined, restaurant_password: undefined }, action) => {

    switch (action.type) {
        case Actions.ADD_RESTAURANT_NAME:
            return Object.assign({}, state, {
                restaurant_name: action.data
            });

        case Actions.ADD_RESTAURANT_ADDRESS:
            return Object.assign({}, state, {
                restaurant_address: action.data
            });
        case Actions.ADD_RESTAURANT_PHONE_WITH_CODE:
            return Object.assign({}, state, {
                restaurant_phone_with_code: action.data
            });
        case Actions.ADD_RESTAURANT_PHONE_NUMBER:
            return Object.assign({}, state, {
                restaurant_phone_number: action.data
            });
        case Actions.ADD_RESTAURANT_CONTACT_PERSON:
            return Object.assign({}, state, {
                restaurant_contact_person: action.data
            });
        case Actions.ADD_RESTAURANT_GOOGLE_ADDRESS:
            return Object.assign({}, state, {
                restaurant_google_address: action.data
            });
        case Actions.ADD_RESTAURANT_LAT:
            return Object.assign({}, state, {
                restaurant_lat: action.data
            });
        case Actions.ADD_RESTAURANT_LNG:
            return Object.assign({}, state, {
                restaurant_lng: action.data
            });
        case Actions.ADD_RESTAURANT_PIN_CODE:
            return Object.assign({}, state, {
                restaurant_pin_code: action.data
            });
        case Actions.ADD_RESTAURANT_USER_NAME:
            return Object.assign({}, state, {
                restaurant_user_name: action.data
            });
        case Actions.ADD_RESTAURANT_PASSWORD:
            return Object.assign({}, state, {
                restaurant_password: action.data
            });
        case Actions.ADD_RESTAURANT_PROFILE_PICTURE:
            return Object.assign({}, state, {
                restaurant_profile_picture: action.data
            });
        case Actions.ADD_RESTAURANT_EMAIL:
            return Object.assign({}, state, {
                restaurant_email: action.data
            });
        case Actions.ONLINE_STATUS:
            return Object.assign({}, state, {
                restaurant_online_status: action.data
            });
        case Actions.RESET:
            return Object.assign({}, state, {
                restaurant_phone_with_code:undefined,
                restaurant_google_address:undefined,
                restaurant_lat:undefined,
                restaurant_lng:undefined,
                restaurant_name:undefined,
                restaurant_contact_person:undefined,
                restaurant_profile_picture:undefined,
            });
        default:
            return state;
    }
}

export default RestaurantRegisterReducer;


