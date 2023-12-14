// src/store/reducers/index.js
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import calendarReducer from './calendarSlice';
import preferencesReducer from './preferenceSlice';
// Import other reducers

const rootReducer = combineReducers({
  user: userReducer,
  calendar: calendarReducer, 
  preferences: preferencesReducer,
});

export default rootReducer;