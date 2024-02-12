import { useState, useEffect } from "react";
import axios from "axios";
import { RESET_TOKEN_VALIDATION } from "../../apiUrl/apiUrl";

const useResetTokenValidation = (resetToken, userEmail) => {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateResetToken = async () => {
      try {
        const response = await axios.post(RESET_TOKEN_VALIDATION, {
          email: userEmail,
          resetToken: resetToken,
        });

        if (response.data.success) {
          // Token is valid
          setIsValid(true);
        } else {
          // Token is not valid
          setIsValid(false);
        }
      } catch (error) {
        // Handle API error
        console.error("Error validating reset token:", error);
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateResetToken();
  }, [resetToken, userEmail]);

  return { isValid, loading };
};

export default useResetTokenValidation;
