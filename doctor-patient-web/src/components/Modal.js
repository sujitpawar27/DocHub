import React from "react";
import { useNavigate } from "react-router-dom";
import ForgotModalComponent from "./ForgotPasswordModal";

const Modal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleBackgroundClick = () => {
    onClose();
    navigate("/forgot-password"); // Replace '/forgot-password' with the actual path of your forgot password page
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
      <div className="bg-white p-8 rounded-lg z-10">
        {/* Add your modal content here */}
        <ForgotModalComponent />
        {/* <div>Reset link sent successfully!</div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Close
        </button> */}
      </div>
    </div>
  );
};

export default Modal;
