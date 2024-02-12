import React from "react";
import Comp from "../assets/svg/Component 7.svg";

const Layout = ({ rightSideContent }) => {
  return (
    <div className="relative flex flex-col md:flex-row">
      {/* Left side container */}
      <div className="w-full md:w-1/2 bg-p-8 h-fit relative hidden md:block">
        {/* WelcomeComponent positioned above the image */}
        <div className="absolute bottom-0 left-0 right-0 bg-p-8 text-center text-neutral-950 text-2xl font-semibold font-montserrat leading-9 md:mb-20">
          Welcome to MBDocHub
          <div className="text-stone-900 text-sm font-medium font-montserrat leading-tight mt-4">
            Lorem ipsum dolor sit amet consectetur. Est nunc arcu fermentum
            risus <br />
            maecenas lectus enim. Fringilla ultrices netus ac semper lectus eget{" "}
            <br /> adipiscing ullamcorper at. Nulla aliquam urna interdum
            tincidunt habitasse <br />
            adipiscing id pulvinar. Lacus varius leo tincidunt cursus orci nunc.
            Mi mauris <br />
            elementum.
          </div>
        </div>
        {/* Image (Comp) */}
        <img
          className="object-cover w-full h-screen"
          src={Comp}
          alt="Left Side Image"
        />
      </div>
      {/* Right side container */}
      <div className="w-full md:w-1/2 bg-p-8 h-fit relative flex items-center justify-center">
        <div className="w-full max-w-screen-md mx-auto p-4 sm:p-0">
          {/* Right-side content passed as a prop */}
          {rightSideContent}
        </div>
      </div>
    </div>
  );
};
export default Layout;
