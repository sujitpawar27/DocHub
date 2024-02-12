import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useResetTokenValidation from "../utils/Hooks/resetTokenValidation";
import * as FormTheme from "../Tailwindtheme/Theme";
import { updatePassword } from "../services/updatePassword";
import { useNavigate } from "react-router-dom";
import EyeOpenSvg from "../assets/Eyeopensvg";
import ClosedEye from "../assets/svg/Eyeclosed";
import showToast from "../common/toast/Toastmessage";
const ResetPasswordForm = () => {
  const [passwordMismatchError, setPasswordMismatchError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [passwordRequirementsError, setPasswordRequirementsError] =
    useState("");
  const [fadeError, setFadeError] = useState(false); // New state for fading error
  const { resetToken, userEmail } = useParams();
  const { isValid, loading } = useResetTokenValidation(resetToken, userEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+,\-./:;<=>?@[\\\]^_`{|}~])(?=.{6,})/;
    if (passwordRegex.test(newPassword)) {
      setPasswordRequirementsError(""); // Reset the error
      setFadeError(true); // Trigger fade-out effect
    }
    if (!passwordRegex.test(newPassword)) {
      setPasswordRequirementsError(
        "Password must contain at least one uppercase letter, one special character, and be at least 6 characters long"
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      console.error("Password and confirm password do not match");
      setPasswordMismatchError("Password and confirm password do not match");
      return;
    }
    try {
      const result = await updatePassword(userEmail, newPassword);
      if (result.success) {
        navigate("/login");
        showToast("Password updated successfully", "success");
        console.log("Password updated successfully");
      } else {
        console.error("Password update failed:", result.message);
        showToast("Password update failed", "error");
      }
    } catch (error) {
      console.error("Error updating password:", error.message);
    }
  };
  const isFormEnabled =
    newPassword.trim().length > 0 && confirmPassword.trim().length > 0;
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isValid) {
    showToast("Unauthorized Request", "error");
    return <div>Error validating reset token</div>;
  }
  return (
    <div>
      <div className={FormTheme.formContainer}>
        <div className={FormTheme.formSection}>
          <div className="mb-3 text-2xl font-bold font-montserrat leading-9">
            Reset Password
          </div>
          <div
            className={`${FormTheme.formDescription} mb-3 text-base font-normal font-montserrat leading-snug`}
          >
            Enter your password below
          </div>
          <form className="w-full sm:w-96" onSubmit={handleResetPassword}>
            <div className={`${FormTheme.formInputContainer} mb-6`}>
              <label
                htmlFor="password"
                className={`${FormTheme.formInputLabel} mb-2 text-sm`}
              >
                New Password
              </label>
              <div className={`${FormTheme.formInput} relative`}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  className={`${
                    isTyping
                      ? FormTheme.afterPlaceholder
                      : FormTheme.placeholder
                  }`}
                />
                <div
                  className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <ClosedEye /> : <EyeOpenSvg />}
                </div>
              </div>
              {passwordRequirementsError && (
                <div
                  className={`text-red-500 text-sm mt-2 ${
                    fadeError ? "fade-out" : ""
                  }`}
                >
                  {passwordRequirementsError}
                </div>
              )}
            </div>
            <div className={`${FormTheme.formInputContainer} mb-6`}>
              <label
                htmlFor="confirmPassword"
                className={`${FormTheme.formInputLabel} mb-2 text-sm`}
              >
                Confirm Password
              </label>
              <div className={`${FormTheme.formInput} relative`}>
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordMismatchError("");
                  }}
                  onFocus={() => setIsTyping(true)}
                  className={`${
                    isTyping
                      ? FormTheme.afterPlaceholder
                      : FormTheme.placeholder
                  }`}
                />
                <div
                  className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {confirmPasswordVisible ? <ClosedEye /> : <EyeOpenSvg />}
                </div>
              </div>
              {passwordMismatchError && (
                <div className="text-red-500 text-sm mt-2">
                  {passwordMismatchError}
                </div>
              )}
            </div>
            <button
              type="submit"
              className={`${
                isFormEnabled ? FormTheme.formenable : FormTheme.formButton
              } w-full h-12 px-6 py-3 text-white rounded-lg ${
                isFormEnabled ? FormTheme.formenable : ""
              }`}
              disabled={passwordMismatchError !== ""}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ResetPasswordForm;
