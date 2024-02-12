import axios from "axios";
import { LOGIN_URL } from "../apiUrl/apiUrl";
import showToast from "../common/toast/Toastmessage";
export const login = async (email, password) => {
  try {
    const response = await axios.post(LOGIN_URL, {
      email,
      password,
    });
    console.log("Checking for valid email and password");
    console.log(`Token is ${response.data.accesstoken}`);
    // Check if the response is successful
    if (response.data.success) {
      // Check the role of the user
      if (response.data.user && response.data.user.role === "patient") {
        showToast("Unautharized User", "error");
        throw new Error(
          "Login declined. Users with role 'patient' are not allowed."
        );
      }
      console.log("Sending data");
      return response.data; // Return the success data
    } else {
      throw new Error(response.data.message); // Throw an error with the error message
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    throw new Error("Login failed"); // Throw a generic error message
  }
};
