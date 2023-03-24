import { createSlice, configureStore } from "@reduxjs/toolkit";
const initialState = {
  searchInput: "",
  chosenComponents: {
    type: "",
    status: "",
    finances: [],
    startDate: '',
    endDate: '',
    valueRangeMin: "",
    valueRangeMax: "",

  },
};

const counterSlice = createSlice({
  name: "addingData",
  initialState,
  reducers: {
    addSearchInput(state, action) {
      state.searchInput = action.payload;
    },
    UpdateComponents(state, action) {
      state.chosenComponents = action.payload;
    },
    addFinances(state, action) {
      state.finances = action.payload;
    },
    addStartDate(state, action) {
      state.startDate = action.payload;
    },
    addEndDate(state, action) {
      state.endDate = action.payload;
    },
  },
});

const store = configureStore({
  reducer: counterSlice.reducer,
});

export const counterActions = counterSlice.actions;
export default store;
