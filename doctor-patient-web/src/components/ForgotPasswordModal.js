import React from "react";
import LinkSvg from "../assets/svg/Linksvg";

const ForgotModalComponent = () => {
  const handleResendLink = () => {
    // Add the logic to resend the link
    console.log("Resending link...");
  };

  return (
    <div className="w-96 h-72 flex-col justify-start items-start inline-flex">
      {/* Top part of the modal */}
      <div className="p-8 bg-white rounded-tl rounded-tr flex-col justify-start items-center gap-6 flex">
        <div className="p-3 bg-indigo-50 rounded-full border border-blue-600 justify-start items-start gap-2.5 inline-flex">
          <div className="w-8 h-8 justify-center items-center flex">
            {/* You can place your SVG icon or any content here */}
            <div className="w-8 h-8 relative">
              <LinkSvg />
            </div>

            <div className="w-8 h-8 relative">{/* Your content */}</div>
          </div>
        </div>
        <div className="w-80 text-center text-neutral-800 text-lg font-semibold font-['Montserrat'] leading-loose">
          Resent link has been sent <br /> to your email!
        </div>
      </div>

      {/* Bottom part of the modal */}
      <div className="w-96 px-2.5 py-6 bg-zinc-100 rounded-bl rounded-br justify-center items-center gap-2.5 inline-flex">
        <div className="justify-center items-center gap-1 flex">
          <div className="text-center text-neutral-800 text-base font-medium font-['Montserrat'] leading-snug">
            Didn’t receive an email?
          </div>

          {/* Make Resend Link clickable */}
          <button
            className="text-center text-blue-600 text-base font-medium font-['Montserrat'] leading-snug"
            onClick={handleResendLink}
          >
            Resend Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotModalComponent;
