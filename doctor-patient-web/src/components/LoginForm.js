import React, { useState } from "react";
import * as FormTheme from "../Tailwindtheme/Theme";
import { login } from "../services/loginapi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import showToast from "../common/toast/Toastmessage";
import EyeOpenSvg from "../assets/Eyeopensvg"; // Import your SVG component
import ClosedEye from "../assets/svg/Eyeclosed";

import { useDispatch } from "react-redux";
import { setAuthUserData } from "../store/slices/userAuthSlice";
import { setUserData } from "../store/slices/userDataSlice";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
    setIsTyping(e.target.value.trim().length > 0);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await login(email, password);

      console.log("Login successful:", result);
      console.log("Login successful accesstoken is ", result.accesstoken);

      const accesstoken = result.accesstoken;

      const firstName = result.user.firstName;
      const lastName = result.user.lastName;
      const userEmail = result.user.email;
      const profileUrl = result.user.profilePicUrl;
      const role = result.user.role;
      const id = result.user._id;

      dispatch(setAuthUserData({ accesstoken }));
      dispatch(
        setUserData({ firstName, lastName, userEmail, profileUrl, role, id })
      );

      showToast("Login successful", "success");

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.message);
      showToast("Invalid Credentials", "error");
      setError("");
    } finally {
      setLoading(false);
    }
  };

  const isFormEnabled = email.trim().length > 0 && password.trim().length > 0;

  return (
    <div className={FormTheme.formContainer}>
      <div className={FormTheme.formSection}>
        <div className="mb-3 text-2xl font-bold font-montserrat leading-9">
          Welcome to MBDocHub
        </div>
        <div
          className={`${FormTheme.formDescription} mb-3 text-base font-normal font-montserrat leading-snug`}
        >
          Please Sign Up and fill the details to start the adventure!
        </div>
        <form className={`w-full sm:w-96`} onSubmit={handleLogin}>
          <div className={`${FormTheme.formInputContainer} mb-6 relative`}>
            <label
              htmlFor="email"
              className={`${FormTheme.formInputLabel} mb-2 text-sm`}
            >
              Email
            </label>
            <div className={FormTheme.formInput}>
              <input
                type="email"
                id="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => handleInputChange(e, setEmail)}
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                title="Enter a valid email address"
                className={`${
                  isTyping ? FormTheme.afterPlaceholder : FormTheme.placeholder
                } ${
                  email &&
                  !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                    email
                  )
                    ? FormTheme.inputError
                    : ""
                }`}
              />
              {email &&
                !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                  email
                ) && (
                  <div className="text-red-500 text-xs absolute top-full left-0 mt-1">
                    {/* Adjust styling as needed */}
                    Invalid email address
                  </div>
                )}
            </div>
          </div>

          <div className={`${FormTheme.formInputContainer} mb-6 relative`}>
            <label
              htmlFor="password"
              className={`${FormTheme.formInputLabel} mb-2 text-sm`}
            >
              Password
            </label>
            <div className={`${FormTheme.formInput} relative`}>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => handleInputChange(e, setPassword)}
                className={`${
                  isTyping ? FormTheme.afterPlaceholder : FormTheme.placeholder
                }`}
              />
              <div
                className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {/* Use the imported EyeOpenSvg component here */}
                {passwordVisible ? <ClosedEye /> : <EyeOpenSvg />}
              </div>
            </div>
          </div>
          <div className=" mb-6 w-96 text-right text-blue-600 text-xs font-medium font-montserrat leading-tight">
            <Link to="/forgot-password">Forget Password?</Link>
          </div>
          <button
            type="submit"
            className={`${
              isFormEnabled ? FormTheme.formenable : FormTheme.formButton
            } w-full h-12 px-6 py-3 text-white rounded-lg ${
              isFormEnabled ? FormTheme.formenable : ""
            }`}
            onClick={handleLogin}
            disabled={loading || !isFormEnabled}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <div className="w-96 text-center">
            <span className="text-zinc-600 text-xs font-medium font-Montserrat leading-tight">
              Don’t have an account?{" "}
            </span>
            <span className="text-blue-600 text-xs font-semibold font-Montserrat leading-tight">
              <Link to="/signup">Sign Up</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
