import axios from 'axios';
import { FORGOT_PASSWORD_URL } from '../apiUrl/apiUrl';

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(FORGOT_PASSWORD_URL, {
      email,
    });

    // Check if the response is successful
    if (response.data.success) {
      return response.data; // Return the success data
    } else {
      throw new Error(response.data.message); // Throw an error with the error message
    }
  } catch (error) {
    console.error('Error during forgot password:', error.message);
    throw new Error('Forgot password failed'); // Throw a generic error message
  }
};
