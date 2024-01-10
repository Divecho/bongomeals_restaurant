import * as ActionTypes from './ActionTypes';

export const addRestaurantName = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_NAME,
    data: data
})
export const addRestaurantAddress = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_ADDRESS,
    data: data
})
export const addRestaurantPhoneWithCode = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_PHONE_WITH_CODE,
    data: data
})
export const addRestaurantPhoneNumber = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_PHONE_NUMBER,
    data: data
})
export const addRestaurantContactPerson = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_CONTACT_PERSON,
    data: data
})
export const addRestaurantGoogleAddress = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_GOOGLE_ADDRESS,
    data: data
})
export const addRestaurantLat = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_LAT,
    data: data
})
export const addRestaurantLng = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_LNG,
    data: data
})
export const addRestaurantPincode = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_PIN_CODE,
    data: data
})
export const addRestaurantUserName = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_USER_NAME,
    data: data
})
export const addRestaurantPassword = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_PASSWORD,
    data: data
})
export const addRestaurantProfilePicture = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_PROFILE_PICTURE,
    data: data
})
export const addRestaurantEmail = (data) => ({
    type: ActionTypes.ADD_RESTAURANT_EMAIL,
    data: data
})
export const addRestaurantOnlineStatus = (data) => ({
    type: ActionTypes.ONLINE_STATUS,
    data: data
})
export const reset = () => ({
    type: ActionTypes.RESET,
})

