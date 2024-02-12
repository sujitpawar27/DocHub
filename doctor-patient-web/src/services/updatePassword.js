import axios from 'axios';
import { UPDATE_PASSWORD } from '../apiUrl/apiUrl'; // Make sure to replace with the actual URL

export const updatePassword = async (email, newPassword) => {
  try {
    console.log("entering axios")
    const response = await axios.post(UPDATE_PASSWORD, {
      email,
      newPassword,
    });
    console.log("exit")

    // Check if the response is successful
    if (response.data.success) {
      return response.data; // Return the success data
    } else {
      throw new Error(response.data.message); // Throw an error with the error message
    }
  } catch (error) {
    console.error('Error during password update:', error.message);
    throw new Error('Password update failed'); // Throw a generic error message
  }
};
