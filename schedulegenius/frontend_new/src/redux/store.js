// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../redux/reducers'; // Import your root reducer
import userReducer from './reducers/userSlice';
import calendarReducer from './reducers/calendarSlice';
import preferencesReducer from './reducers/preferenceSlice';


const store = configureStore({
  reducer: rootReducer,
  user: userReducer,
  calendar: calendarReducer,
  preferences: preferencesReducer,
});

export default store;