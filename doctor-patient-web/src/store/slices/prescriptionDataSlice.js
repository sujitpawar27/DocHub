import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prescriptionData: null,
};
const prescriptionDataSlice = createSlice({
  name: "prescription",
  initialState,
  reducers: {
    setPrescriptionDatas: (state, action) => {
      console.log(`in prescription reducer`);
      state.prescriptionData = action.payload.prescriptionData;
    },
    clearPrescriptionDatas: (state, acion) => {
      state.prescriptionData = null;
    },
  },
});

export const { setPrescriptionDatas, clearPrescriptionDatas } =
  prescriptionDataSlice.actions;
export default prescriptionDataSlice.reducer;
