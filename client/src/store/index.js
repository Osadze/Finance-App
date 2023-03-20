import { createSlice, configureStore } from "@reduxjs/toolkit";
const initialState = {};

const counterSlice = createSlice({
  name: "addingData",
  initialState,
  reducers: {},
});

const store = configureStore({
  reducer: counterSlice.reducer,
});

export const counterActions = counterSlice.actions;
export default store;
