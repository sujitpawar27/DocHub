import React, { useState } from "react";
import * as FormTheme from "../Tailwindtheme/Theme";
import { forgotPassword } from "../services/forgotPassword";
import { useNavigate, Link } from "react-router-dom";
import Modal from "./Modal";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
    setIsTyping(e.target.value.trim().length > 0);
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await forgotPassword(email);

      console.log("Forgot password request successful:", result);
      // Handle the successful result, e.g., show a success message or redirect the user
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Forgot password request failed:", error.message);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  const isFormEnabled = email.trim().length > 0;

  return (
    <div className={FormTheme.formContainer}>
      <div className={FormTheme.formSection}>
        <div>Forgot Password</div>
        <div className={FormTheme.formDescription}>
          Please provide a registered email address to receive a password reset
          link.
        </div>
        <form className="w-96" onSubmit={handleResetRequest}>
          <div className={`${FormTheme.formInputContainer} mb-6`}>
            <label
              htmlFor="email"
              className={`${FormTheme.formInputLabel} mb-2 text-sm`}
            >
              Email address
            </label>
            <div className={FormTheme.formInput}>
              <input
                type="email"
                id="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => handleInputChange(e, setEmail)}
                className={`${
                  isTyping ? FormTheme.afterPlaceholder : FormTheme.placeholder
                }`}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`${
              isFormEnabled ? FormTheme.formenable : FormTheme.formButton
            } w-full h-12 px-6 py-3 text-white rounded-lg ${
              isFormEnabled ? FormTheme.formenable : ""
            }`}
            disabled={loading || !isFormEnabled}
          >
            {loading ? "Sending..." : "Request Reset Link"}
          </button>
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <Link to="/login">
              <button className="w-96 h-12 px-6 py-3 bg-indigo-50 rounded-lg border border-blue-600 text-black text-base font-medium font-montserrat leading-snug">
                Back
              </button>
            </Link>
          </div>
        </form>
      </div>
      {/* Render the Modal component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ForgotPasswordForm;
