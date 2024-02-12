import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { storage } from "../firebase";
import frame from "../assets/svg/Frame 427321061.png";

const ProfilePictureUploader = ({ setProfilePicUrl }) => {
  const [src, setSrc] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const isValidImage = (file) => {
    return (
      file.type.startsWith("image/") &&
      ["jpeg", "png", "gif", "jpg"].includes(file.type.split("/")[1])
    );
  };

  const onSelectFile = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (isValidImage(file) && file.size <= 10 * 1024 * 1024) {
        setError(null);
        setLoading(true); // Set loading to true when starting the upload
        const storageRef = ref(storage, `doctor/images/${file.name}`);

        try {
          await uploadBytes(storageRef, file);

          const url = await getDownloadURL(storageRef);
          setSrc(url);
          setProfilePicUrl(url);
          setLoading(false); // Set loading to false when upload is completed
        } catch (error) {
          console.error("Error uploading file:", error);
          setLoading(false); // Set loading to false in case of an error
          setError("Error uploading image. Please try again.");
        }
      } else {
        setError(
          "Please select a valid image type (jpg, jpeg, png, gif) with a size less than 10 MB"
        );
      }
    }
  };

  return (
    <div className="w-96 h-24 justify-start items-center gap-5 inline-flex">
      <label htmlFor="fileInput" className="cursor-pointer">
        {loading ? (
          <div className="w-24 h-24 flex items-center justify-center">
            <div className="animate-spin rounded-full border-t-4 border-blue-500 border-solid border-8 h-16 w-16"></div>
          </div>
        ) : (
          <img
            className="w-24 h-24 rounded-full"
            src={src || frame}
            alt="Uploaded Profile"
          />
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          style={{ display: "none" }}
        />
      </label>
      <div className="flex-col justify-start items-start gap-4 inline-flex">
        <div className="text-neutral-800 text-sm font-semibold font-Montserrat leading-tight">
          Upload Profile Picture
        </div>
        <label htmlFor="fileInput" className="cursor-pointer">
          <div className="w-16 h-7 px-3.5 py-1.5 bg-blue-600 rounded flex items-center justify-center gap-2.5">
            <div className="text-white text-xs font-medium font-Montserrat leading-tight">
              Upload
            </div>
          </div>
          {error && <div className="text-red-500 text-xs">{error}</div>}
        </label>
      </div>
    </div>
  );
};

export default ProfilePictureUploader;
