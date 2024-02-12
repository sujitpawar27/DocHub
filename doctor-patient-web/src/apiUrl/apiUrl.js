export const BASE_URL = "http://localhost:8000";

export const LOGIN_URL = `${BASE_URL}/auth/login`;

export const SIGNUP_URL = `${BASE_URL}/auth/register`;

export const LOGOUT_URL = `${BASE_URL}/auth/logout`;

export const FORGOT_PASSWORD_URL = `${BASE_URL}/auth/forgot-password`;

export const RESET_PASSWORD_URL = `${BASE_URL}/auth/reset-password?token={resetToken}&email={userEmail}`;

export const RESET_TOKEN_VALIDATION = `${BASE_URL}/auth/validate-resetToken`;

export const UPDATE_PASSWORD = `${BASE_URL}/auth/update-password`;

export const REGISTER_URL = `${BASE_URL}/auth/register`;

export const SHOW_PATIENTS = `${BASE_URL}/user/doctor/patients`;

export const ACCEPTS = `${BASE_URL}/user/accept`;

export const DECLINE = `${BASE_URL}/user/decline`;
