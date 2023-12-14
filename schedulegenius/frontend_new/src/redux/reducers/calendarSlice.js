import { createSlice } from '@reduxjs/toolkit';

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    calendarEvents: []
  },
  reducers: {
    setCalendarEvents: (state, action) => {
      state.calendarEvents = action.payload;
    }
  }
});

export const { setCalendarEvents } = calendarSlice.actions;

export default calendarSlice.reducer;