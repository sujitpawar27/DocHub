import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accesstoken: null,
  isAuthenticated: false,
};
const userAuthSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthUserData: (state, action) => {
      state.accesstoken = action.payload.accesstoken;
      state.isAuthenticated = true;
    },
    clearAuthUserData: (state, acion) => {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { setAuthUserData, clearAuthUserData } = userAuthSlice.actions;
export default userAuthSlice.reducer;
