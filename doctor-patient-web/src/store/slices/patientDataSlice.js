import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStatus: null,
  appointmentId: null,
  patientUrl: null,
};

const patientDataSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setPatientData: (state, action) => {
      state.selectedStatus = action.payload.selectedStatus;
      state.appointmentId = action.payload.appointmentId;
      state.patientUrl = action.payload.patientUrl;
    },
    clearPatientData: (state) => {
      state.selectedStatus = null;
      state.appointmentId = null;
      state.patientUrl = null;
    },
    updatePatientStatus: (state) => {
      state.selectedStatus = "completed";
      
    },
  },
});

export const { setPatientData, clearPatientData, updatePatientStatus } =
  patientDataSlice.actions;
export default patientDataSlice.reducer;
