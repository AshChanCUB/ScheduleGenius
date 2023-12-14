import { createSlice } from '@reduxjs/toolkit';

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: {
    userPreferences: {},
    // Add other initial state related to preferences if needed
  },
  reducers: {
    setPreferences: (state, action) => {
      state.userPreferences = action.payload;
    },
    // Add other reducers if needed
  }
});

export const { setPreferences } = preferencesSlice.actions;

export default preferencesSlice.reducer;