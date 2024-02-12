import axios from 'axios';
import { REGISTER_URL } from '../apiUrl/apiUrl';
import showToast from '../common/toast/Toastmessage';
export const register = async ({
    firstName,
    lastName,
    email,
    password,
    role,
    specialization,
    experience,
    mobileNumber,
    address,
    profilePicUrl,
  }) => {
    try {
      const response = await axios.post(REGISTER_URL, {
        firstName,
        lastName,
        email,
        password,
        role,
        specialization,
        experience,
        mobileNumber,
        address,
        profilePicUrl,
      });
  
      if (response.data.success) {
        // Registration was successful
        return response.data;
      } else {
        // Server responded with an error message
        
         showToast(response.data.message, 'error');
        // throw new Error(`Registration failed: ${response.data.message}`);
        // showToast(response.data.message, 'error');
      }
    } catch (error) {
      // Axios or network error
      console.error('Error during registration:', error.message);
     
      throw new Error('Registration failed. Please try again.');
    }
  };
  