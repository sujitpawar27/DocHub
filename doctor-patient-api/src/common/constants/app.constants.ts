// Base URL
export const API_BASE_URL = "http://localhost:8000";

// Authentication Endpoints
export const BASE_ENDPOINT_FOR_AUTH = "/auth";
export const REGISTER = "/register";
export const LOGIN = "/login";
export const LOGOUT = "/logout";
export const REFRESH_TOKEN = "/refresh-token";
export const FORGOT_PASSWORD = "/forgot-password";
export const UPDATE_PASSWORD = "/update-password";

// User Endpoints
export const BASE_ENDPOINT_FOR_USER = "/user";
export const NEARBY_DOCTORS = "/nearby-doctors";
export const GET_DOCTOR_DETAILS = "/get-doctor-details/:doctorId";
export const SUBMIT_FEEDBACK = "/submit-feedback";
export const GET_ALL_APPOINTMENTS = "/get-allappointments/:patientId";
export const BOOK_APPOINTMENT = "/book-appointment";
export const SHOW_PATIENTS = "/doctor/patients";
export const ADD_PRESCRIPTION = "/doctor/add-prescription";
export const GET_APPOINTMENT_BY_PATIENTID = "/get-appointments/:patientId";
export const ACCEPT_APPOINTMENT = "/accept/:id";
export const DECLINE_APPOINTMENT = "/decline/:id";
export const GET_PATIENT_DETAILS = "/doctor/patient-details/:id";
export const GET_PRESCRIPTION_DETAILS = "/get-prescription/:appointmentId";

// Error Messages and Responses
export const INTERNAL_SERVER_ERROR = "Internal Server Error";
export const VALIDATION_ERROR = "Validation error during registration";
export const USER_ALREADY_EXISTS = "User already exists";
export const USER_REGISTERED_SUCCESSFULLY = "User registered successfully";
export const USER_REGISTERATION_ERROR = "Error registering user";
export const ACCESS_DENIED_401 = "Access denied. No token provided.";
export const SECRET = "secret";
export const INVALID_TOKEN = "Invalid token";
export const SESSION_NOT_FOUND = "Session not found";
export const FORBIDDEN = "Forbidden";
export const PASSWORD_NOT_MATCHED =
  "Password doesn't match, please enter again";
export const USER_LOGGED_IN = "user logged in successfully";
export const USER_LOGGED_OUT = "user logged out successfully";
export const USER_NOT_FOUND = "User not found";
export const RESET_TOKEN_SENT = "Reset token sent successfully";
export const UNAUTHORISED = "Unauthorised";
export const PASSWORD_UPDATED = "Password updated successfully";
export const PATIENT_DETAILS_NOT_FOUND = "Patient details not found";
export const CANNOT_APPOINTMENT_NOW = "You cannot cancel appointment now";
export const APPOINTMENT_NOT_FOUND = "Appointment not found";
export const ALL_FIELDS_REQUIRED = "all fields are required";
export const APPOINTMENT_BOOKED = "appointment booked successfully";
export const DOCTOR_ID_NOT_FOUND = "doctor id not found";
export const DOCTOR_NOT_FOUND = "doctor not found";
export const PAGE_NOT_FOUND = "Page Not Found";
export const DATABASE_CONNECTED = "Database connected successfully";
export const PRESCRIPTION_ADDED_SUCCESSFULLY =
  "Prescription Added Successfully";
