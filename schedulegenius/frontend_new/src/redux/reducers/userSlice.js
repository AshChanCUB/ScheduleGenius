import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user_id: null,
    first_name: null,
    last_name:null,
    email: null,
    // ... other user states
  },
  reducers: {
    setUser: (state, action) => {
      state.user_id = action.payload.user_id;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.email = action.payload.email;
      // ... set other user information
    },
    // ... other reducers
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;