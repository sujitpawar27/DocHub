import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PageNotFound from "../components/PageNotFound";
import Dashboard from "../components/doctor/DoctorDashboard";
import StickyTable from "../components/doctor/StickyTable";
import PatientProfile from "../components/patientprofile";
import PriscriptionForm from "../components/priscriptionForm";
import Forgot from "../components/Forgot";
import Register from "../components/Register";
import ProfilePictureUploader from "../components/ProfilePictureUploader";
import NameInput from "../components/Nameinput";
import Signin from "../components/Signin";
import Login from "../components/Login";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Login />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PrivateRoute>
              <Login />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute required>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="" element={<StickyTable />} />
          <Route path="patientprofile" element={<PatientProfile />} />
          <Route path="priscriptionform" element={<PriscriptionForm />} />
        </Route>

        <Route
          path="/forgot-password"
          element={
            <PrivateRoute>
              <Forgot />
            </PrivateRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PrivateRoute>
              <Register />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <PrivateRoute>
              <ProfilePictureUploader />
            </PrivateRoute>
          }
        />
        <Route
          path="/name"
          element={
            <PrivateRoute>
              <NameInput />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
        <Route
          path="/reset-password/:resetToken/:userEmail"
          element={<Signin />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
