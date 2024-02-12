import React, { useState } from "react";
import * as FormTheme from "../Tailwindtheme/Theme";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Make sure to import the styles
import { Link, useNavigate } from "react-router-dom";
import ProfilePictureUploader from "./ProfilePictureUploader";
import EyeOpenSvg from "../assets/Eyeopensvg"; // Import your SVG component
import ClosedEye from "../assets/svg/Eyeclosed";
import { register } from "../services/Register";
import showToast from "../common/toast/Toastmessage";

const RegisterForm = () => {
  const handlePhoneChange = (value, country, e, formattedValue) => {
    // Update the mobileNumber state with the phone number
    setMobileNumber(value);
  };
  const [isFirstNameTyping, setIsFirstNameTyping] = useState(false);
  const [isLastNameTyping, setIsLastNameTyping] = useState(false);
  const [isEmailTyping, setEmailTyping] = useState(false);
  const [isPAsswordTyping, setPasswordTyping] = useState(false);
  const [isConfirmTyping, setConfirmTyping] = useState(false);
  const [isLaitudeTyping, setLatutudeTyping] = useState(false);
  const [isLongitudeTyping, setLongitudeTyping] = useState(false);
  const [isSpecialisationTyping, setSpecialisationTyping] = useState(false);
  const [isExperienceTyping, setExperienceTyping] = useState(false);
  const [isAddressTyping, setAddressTyping] = useState(false);
  const [iszipcodeTyping, setzipcodeTyping] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [latitude, setlatitude] = useState("");
  const [longitude, setlongitude] = useState("");
  const [city, setCity] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [address, setAddress] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isLatitudeValid, setIsLatitudeValid] = useState(true);
  const [isLongitudeValid, setIsLongitudeValid] = useState(true);

  const validateEmail = () => {
    const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      email
    );
    setIsEmailValid(isValid);
  };

  const validatePassword = () => {
    const isValidPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        password
      );
    setIsPasswordValid(isValidPassword);
  };

  const validateLatitude = () => {
    const isValid = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(latitude);

    setIsLatitudeValid(isValid);
  };

  const validateLongitude = () => {
    const isValid = /^[-+]?(180(\.0+)?|((1[0-7]\d)|(\d{1,2}))(\.\d+)?)$/.test(
      longitude
    );
    setIsLongitudeValid(isValid);
  };

  const validateFirstName = (value) => {
    // Your validation logic for first name
    // For example, check if it's not empty or meets certain criteria
    return value.trim().length > 0;
  };

  const validateLastName = (value) => {
    // Your validation logic for last name
    return value.trim().length > 0;
  };

  const validateConfirmPassword = (value, password) => {
    // Your validation logic for confirming password
    return value === password;
  };

  const validateAddress = (value) => {
    // Your validation logic for address
    return value.trim().length > 0;
  };

  const validatePasswordMatch = () => {
    return password === confirmPassword;
  };
  //enter more when required

  const stateOptions = ["Maharashtra"];
  const countryOptions = ["India"];
  const cityOptions = ["Pune", "Nashik", "Mumbai"];

  const [selectedState, setSelectedState] = useState("");
  const [selectedcity, setSelectedcity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const [isTyping, setIsTyping] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const handleInputChange = (e, setter, validationFunc) => {
    const inputValue = e.target.value;
    setter(inputValue);

    // setIsTyping(inputValue.trim().length > 0);
    setIsFirstNameTyping(inputValue.trim().length > 0);
    setIsLastNameTyping(inputValue.trim().length > 0);
    setEmailTyping(inputValue.trim().length > 0);
    setPasswordTyping(inputValue.trim().length > 0);
    setConfirmTyping(inputValue.trim().length > 0);
    setAddressTyping(inputValue.trim().length > 0);
    setExperienceTyping(inputValue.trim().length > 0);
    setLatutudeTyping(inputValue.trim().length > 0);
    setLongitudeTyping(inputValue.trim().length > 0);

    if (typeof validationFunc === "function") {
      // Perform validation dynamically as the user types
      validationFunc(inputValue);
    }
    if (
      inputValue.trim().length === 0 &&
      validationFunc !== validateExperience
    ) {
      if (validationFunc === validateFirstName) {
        setIsFirstNameTyping(false);
      } else if (validationFunc === validateLastName) {
        setIsLastNameTyping(false);
      } else if (validationFunc === validateEmail) {
        setEmailTyping(false);
      } else if (validationFunc === validatePassword) {
        setPasswordTyping(false);
      } else if (validationFunc === validateConfirmPassword) {
        setConfirmTyping(false);
      } else if (validationFunc === validateAddress) {
        setAddressTyping(false);
      } else if (validationFunc === validateExperience) {
        setExperienceTyping(false);
      } else if (validationFunc === validateLatitude) {
        setLatutudeTyping(false);
      } else if (validationFunc === validateLongitude) {
        setLongitudeTyping(false);
      }

      setError("");
    }
  };
  const validateExperience = (value) => {
    const isNonNegativeInteger = /^\d+$/.test(value);
    const isNotNegative = parseInt(value, 10) >= 0;

    if (!isNonNegativeInteger || !isNotNegative) {
      setError("Experience should be a non-negative integer.");
      // setIsTyping(true);
      setExperienceTyping(true);
    } else {
      setError("");
      setExperienceTyping(value.trim().length > 0);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      email.trim() === "" ||
      password.trim() === "" ||
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      confirmPassword.trim() === "" ||
      experience.trim() === "" ||
      latitude.trim() === "" ||
      longitude.trim() === ""
    ) {
      showToast("All fields are mandatory", "error");
      return; // Stop registration process if any mandatory field is empty
    }

    try {
      setLoading(true);

      const userData = {
        firstName,
        lastName,
        email,
        password,
        specialization,
        experience,
        mobileNumber,
        address: {
          country,
          state,
          city,
          zipcode,
          coordinates: {
            latitude: Number(latitude), // Convert latitude to number
            longitude: Number(longitude), // Convert longitude to number
          },
        },
        profilePicUrl,
      };
      const requestBody = {
        ...userData,
        role: "doctor", // Add the appropriate role here
      };

      const result = await register(requestBody);

      console.log("Registration successful:", result);
      showToast("Registration Successful", "success");
      navigate("/login");
      setError("");
    } catch (error) {
      console.error("Registration failed:", error);
      showToast("Error Registering ", "error");
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormEnabled =
    isEmailValid &&
    isPasswordValid &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    experience.trim().length > 0 &&
    latitude.trim().length > 0 &&
    longitude.trim().length > 0;

  console.log("isEmailValid:", isEmailValid);
  console.log("isPasswordValid:", isPasswordValid);
  console.log("email.trim().length:", email.trim().length);
  console.log("password.trim().length:", password.trim().length);
  console.log("firstName.trim().length:", firstName.trim().length);
  console.log("lastName.trim().length:", lastName.trim().length);
  console.log("confirmPassword.trim().length:", confirmPassword.trim().length);
  console.log("experience.trim().length:", experience.trim().length);
  console.log("latitude.trim().length:", latitude.trim().length);
  console.log("longitude.trim().length:", longitude.trim().length);

  console.log("isFormEnabled:", isFormEnabled);

  return (
    <div className="overflow-hidden">
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none; /* Hide the x-axis scrollbar */
            
          }
        
        
          
        `}
      </style>
      <div className={`${FormTheme.formContainer} scrollbar-hide`}>
        <div className={FormTheme.formSection}>
          <div className="mb-3 text-2xl font-bold font-montserrat leading-9">
            Create Doctor Profile
          </div>
          <div
            className={`${FormTheme.formDescription} mb-3 text-base font-normal font-montserrat leading-snug`}
          >
            Please Scroll down and fill in the details to continue.
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-500px)] scrollbar-hide">
            <form className="w-full sm:w-96">
              <div className="mb-4">
                <ProfilePictureUploader setProfilePicUrl={setProfilePicUrl} />
              </div>
              <div className="w-96 h-20 justify-start items-start gap-5 inline-flex mb-4">
                {/* First Name */}
                <div className=" mb-4 w-48 flex-col justify-start items-start gap-1 inline-flex">
                  <div className="text-neutral-800 text-sm font-semibold font-Montserrat leading-tight">
                    First Name
                  </div>
                  <div className="self-stretch h-12 px-4 py-3 rounded border border-neutral-200 justify-start items-center gap-2 inline-flex">
                    <div className="grow shrink basis-0 self-stretch justify-start items-center gap-2.5 flex">
                      <input
                        type="text"
                        // className="w-full h-full text-neutral-400 text-sm font-normal font-Montserrat leading-snug outline-none"
                        placeholder="Enter first name"
                        required
                        className={`${
                          isFirstNameTyping
                            ? FormTheme.afterPlaceholder
                            : FormTheme.placeholder
                        }`}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            setFirstName,
                            setIsFirstNameTyping
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Last Name */}
                <div className=" mb-4 w-48 flex-col justify-start items-start gap-1 inline-flex">
                  <div className="text-neutral-800 text-sm font-semibold font-Montserrat leading-tight">
                    Last Name
                  </div>
                  <div className="self-stretch h-12 px-4 py-3 rounded border border-neutral-200 justify-start items-center gap-2 inline-flex">
                    <div className="grow shrink basis-0 self-stretch justify-start items-center gap-2.5 flex">
                      <input
                        type="text"
                        // className="w-full h-full text-neutral-400 text-sm font-normal font-Montserrat leading-snug outline-none"
                        placeholder="Enter last name"
                        required
                        className={`${
                          isLastNameTyping
                            ? FormTheme.afterPlaceholder
                            : FormTheme.placeholder
                        }`}
                        onChange={(e) =>
                          handleInputChange(e, setLastName, setIsLastNameTyping)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${FormTheme.formInputContainer} `}>
                <label
                  htmlFor="phone"
                  className={`${FormTheme.formInputLabel}  text-sm`}
                >
                  Contact
                </label>
                <div className={FormTheme.formInput}>
                  <PhoneInput
                    country={"in"}
                    inputClass={`${FormTheme.formPhoneInputField} ${FormTheme.customPhoneInput}`}
                    inputStyle={{ border: "none" }}
                    dropdownStyle={{ border: "none" }}
                    required
                    onChange={handlePhoneChange} //
                  />
                </div>
              </div>
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
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        setEmail,
                        validateEmail,
                        setEmailTyping
                      )
                    }
                    className={`${
                      isEmailTyping
                        ? FormTheme.afterPlaceholder
                        : FormTheme.placeholder
                    } ${isEmailValid ? "" : FormTheme.inputError} `}
                  />
                </div>
                {isEmailTyping && !isEmailValid && (
                  <div className="text-red-500 text-xs mt-1">
                    Invalid email address
                  </div>
                )}
              </div>

              {/* Password Input with SVG icon */}
              <div className={`${FormTheme.formInputContainer}  relative`}>
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
                    className={`${
                      isPAsswordTyping
                        ? FormTheme.afterPlaceholder
                        : FormTheme.placeholder
                    } ${isPasswordValid ? "" : FormTheme.inputError}`}
                    onChange={(e) =>
                      handleInputChange(e, setPassword, () =>
                        validatePassword(e.target.value)
                      )
                    }
                    required
                  />
                  <div
                    className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                    onClick={() => togglePasswordVisibility("password")}
                  >
                    {/* Use the imported EyeOpenSvg component here */}
                    {passwordVisible ? <ClosedEye /> : <EyeOpenSvg />}
                  </div>
                </div>
                {isPAsswordTyping && !isPasswordValid && (
                  <div className="text-red-500 text-xs mt-1">
                    Password must have 1 special character 1 upper case and 6
                    letters
                  </div>
                )}
              </div>
              {/* Confirm Password Input with SVG icon */}
              <div className={`${FormTheme.formInputContainer}  relative`}>
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
                    placeholder="Enter Password"
                    className={`${
                      isPAsswordTyping
                        ? FormTheme.afterPlaceholder
                        : FormTheme.placeholder
                    }`}
                    onChange={(e) =>
                      handleInputChange(e, setconfirmPassword, setConfirmTyping)
                    }
                    required
                  />
                  <div
                    className="w-6 h-6 absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  >
                    {/* Use the imported EyeOpenSvg component here */}
                    {confirmPasswordVisible ? <ClosedEye /> : <EyeOpenSvg />}
                  </div>
                </div>
                {!validatePasswordMatch() && (
                  <div className="text-red-500 text-xs mt-1">
                    Password and Confirm Password do not match
                  </div>
                )}
              </div>

              <div className={`${FormTheme.formInputContainer} mb-4`}>
                <label
                  htmlFor="specialization"
                  className={`${FormTheme.formInputLabel}  text-sm`}
                >
                  Specialization
                </label>
                <div className={FormTheme.formInput}>
                  <select
                    id="specialization"
                    name="specialization"
                    className={`${
                      isConfirmTyping
                        ? FormTheme.afterPlaceholder
                        : FormTheme.placeholder
                    }`}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        setSpecialization,
                        setSpecialisationTyping
                      )
                    }
                    required
                  >
                    <option value="" disabled selected>
                      Select SpecializationHeart Specialist
                    </option>

                    <option value="pediatricians">pediatricians</option>
                    <option value="cardiologist">cardiologist</option>
                    <option value="dermatologist">dermatologist</option>
                    <option value="Orthopedist">Orthopedist</option>
                    <option value="diabetologist">diabetologist</option>
                  </select>
                </div>
              </div>
              <div className={`${FormTheme.formInputContainer} mb-4`}>
                <label
                  htmlFor="experience"
                  className={`${FormTheme.formInputLabel} mb-2 text-sm`}
                >
                  Enter Your Experience
                </label>
                <div className={FormTheme.formInput}>
                  <input
                    type="number"
                    id="experience"
                    placeholder="Enter Your Experience"
                    className={`${
                      isExperienceTyping
                        ? FormTheme.afterPlaceholder
                        : FormTheme.placeholder
                    }`}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        setExperience,
                        validateExperience,
                        setExperienceTyping
                      )
                    }
                    required
                    min="0"
                    pattern="\d*"
                  />
                </div>
              </div>
              <div className="w-96 h-20 justify-start items-start gap-5 inline-flex mb-4">
                <div className="w-48 flex-col justify-start items-start gap-1 inline-flex mb-4">
                  <div className="text-neutral-800 text-sm font-semibold font-['Montserrat'] leading-tight">
                    Country
                  </div>
                  <div className="self-stretch h-12 px-4 py-3 rounded border border-neutral-200 justify-start items-center gap-2 inline-flex">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className={`${
                        setCountry
                          ? FormTheme.afterPlaceholder
                          : FormTheme.placeholder
                      }`}
                      onClick={(e) => handleInputChange(e, setCountry)}
                      required
                    >
                      <option value="" disabled selected>
                        Select country
                      </option>
                      {countryOptions.map((country, index) => (
                        <option key={index} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="w-48 flex-col justify-start items-start gap-1 inline-flex ">
                  <div className="text-neutral-800 text-sm font-semibold font-['Montserrat'] leading-tight">
                    State
                  </div>
                  <div className="self-stretch h-12 px-4 py-3 rounded border border-neutral-200 justify-start items-center gap-2 inline-flex">
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className={`${
                        setCity
                          ? FormTheme.afterPlaceholder
                          : FormTheme.placeholder
                      }`}
                      onClick={(e) => handleInputChange(e, setState)}
                      required
                    >
                      <option value="" disabled selected>
                        Select state
                      </option>
                      {stateOptions.map((state, index) => (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="w-96 h-20 justify-start items-start gap-5 inline-flex mb-4">
                <div className="w-48 flex-col justify-start items-start gap-1 inline-flex">
                  <div className="text-neutral-800 text-sm font-semibold font-['Montserrat'] leading-tight">
                    City
                  </div>
                  <div className="self-stretch h-12 px-4 py-3 rounded border border-neutral-200 justify-start items-center gap-2 inline-flex">
                    <select
                      value={selectedcity}
                      onChange={(e) => setSelectedcity(e.target.value)}
                      className={`${
                        setCity
                          ? FormTheme.afterPlaceholder
                          : FormTheme.placeholder
                      }`}
                      onClick={(e) => handleInputChange(e, setCity)}
                      required
                    >
                      <option value="" disabled selected>
                        Select city
                      </option>
                      {cityOptions.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="w-48 flex-col justify-start items-start gap-1 inline-flex">
                  <div className="text-neutral-800 text-sm font-semibold font-['Montserrat'] leading-tight">
                    Zipcode
                  </div>
                  <div className="self-stretch h-12 px-4 py-3 rounded border border-neutral-200 justify-start items-center gap-2 inline-flex">
                    <input
                      type="number"
                      placeholder="Enter zip code"
                      className={`${
                        iszipcodeTyping
                          ? FormTheme.afterPlaceholder
                          : FormTheme.placeholder
                      } ${iszipcodeTyping ? "" : FormTheme.inputError}`}
                      onChange={(e) =>
                        handleInputChange(e, setZipcode, setzipcodeTyping)
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <div className={`${FormTheme.formInputContainer} mb-4`}>
                <label
                  htmlFor="email"
                  className={`${FormTheme.formInputLabel} mb-2 text-sm`}
                >
                  Clinic/Hospital Address
                </label>
                <div className={FormTheme.formInput}>
                  <input
                    type="text"
                    id="address"
                    placeholder="Enter address"
                    className={`${
                      isAddressTyping
                        ? FormTheme.afterPlaceholder
                        : FormTheme.placeholder
                    }`}
                    onChange={(e) =>
                      handleInputChange(e, setAddress, setAddressTyping)
                    }
                    required
                  />
                </div>
              </div>
              <div className="w-96 h-20 justify-start items-start gap-5 inline-flex">
                <div className="w-48 flex-col justify-start items-start gap-1 inline-flex">
                  <div className="text-neutral-800 text-sm font-semibold font-['Montserrat'] leading-tight">
                    Latitude
                  </div>
                  <div className="self-stretch h-12 px-4 py-3 rounded border border-neutral-200 justify-start items-center gap-2 inline-flex">
                    <input
                      type="text"
                      placeholder="Enter latitude"
                      required
                      className={`${
                        isLaitudeTyping
                          ? FormTheme.afterPlaceholder
                          : FormTheme.placeholder
                      }`}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          setlatitude,
                          validateLatitude,
                          setLatutudeTyping
                        )
                      }
                      onBlur={(e) =>
                        handleInputChange(
                          e,
                          setlatitude,
                          validateLatitude,
                          setLatutudeTyping
                        )
                      }
                    />
                  </div>
                  {/* {isLaitudeTyping && !isLatitudeValid && (
          <div className="text-red-500 text-xs mt-1">
            Invalid latitude value
          </div>
        )} */}
                </div>
                <div className="w-48 flex-col justify-start items-start gap-1 inline-flex">
                  <div className="text-neutral-800 text-sm font-semibold font-['Montserrat'] leading-tight">
                    Longitude
                  </div>
                  <div className="self-stretch h-12 px-4 py-3 rounded border border-neutral-200 justify-start items-center gap-2 inline-flex">
                    <input
                      type="text"
                      placeholder="Enter longitude"
                      className={`${
                        isLongitudeTyping
                          ? FormTheme.afterPlaceholder
                          : FormTheme.placeholder
                      }`}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          setlongitude,
                          validateLongitude,
                          setLongitudeTyping
                        )
                      }
                      required
                    />
                  </div>
                  {/* {isLongitudeTyping && !isLongitudeValid && (
          <div className="text-red-500 text-xs mt-1">
            Invalid longitude value
          </div>
        )} */}
                </div>
              </div>
            </form>
          </div>
          <div className="w-96 mb-4 flex items-center">
            <div>
              <input
                type="checkbox"
                className="w-4 h-4 justify-start items-center gap-1.5 inline-flex p-0.5 rounded border border-stone-300 bg-white mr-4"
                required
              />
            </div>
            <span className="text-zinc-600 text-xs font-medium font-Montserrat leading-tight">
              Creating an account means you’re okay with our <br />
              <span className="text-blue-600 text-xs font-semibold font-Montserrat leading-tight">
                Terms of service, Privacy Policy.
              </span>
            </span>
          </div>
          <button
            type="submit"
            className={`${
              isFormEnabled ? FormTheme.formenable : FormTheme.formButton
            } w-full h-12 px-6 py-3 text-white rounded-lg ${
              isFormEnabled ? FormTheme.formenable : ""
            }`}
            onClick={(e) => {
              console.log("isFormEnabled:", isFormEnabled); // Log the value
              handleRegister(e);
            }}
            // disabled={!isFormEnabled}
          >
            Sign Up
          </button>
          <div className="w-96 text-center">
            <span className="text-zinc-600 text-xs font-medium font-Montserrat leading-tight">
              Already have an account?{" "}
            </span>
            <span className="text-blue-600 text-xs font-semibold font-Montserrat leading-tight">
              <Link to="/login">Signin</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
