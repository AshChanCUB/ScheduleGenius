import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user_id: null,
    username: null,
    email: null,
    // ... other user states
  },
  reducers: {
    setUser: (state, action) => {
      state.user_id = action.payload.user_id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      // ... set other user information
    },
    // ... other reducers
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;