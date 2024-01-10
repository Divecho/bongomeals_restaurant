import { combineReducers } from 'redux';

import RestaurantRegisterReducer from './RestaurantRegisterReducer.js';

const allReducers = combineReducers({
  restaurant_register:RestaurantRegisterReducer,
  
});

export default allReducers;