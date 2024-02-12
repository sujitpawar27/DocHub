import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: null,
  lastName: null,
  userEmail: null,
  profileUrl: null,
  role: null,
  id: null,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      console.log("In reducer");
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.userEmail = action.payload.userEmail;
      state.profileUrl = action.payload.profileUrl;
      state.role = action.payload.role;
      state.id = action.payload.id;
    },
    clearUserData: (state, action) => {
      state.firstName = null;
      state.lastName = null;
      state.userEmail = null;
      state.profileUrl = null;
      state.role = null;
      state.id = null;
    },
  },
});

export const { setUserData, clearUserData } = userDataSlice.actions;

export default userDataSlice.reducer;
