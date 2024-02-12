import React from "react";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-2xl mt-4">Page Not Found</p>
        <p className="text-lg mt-2">The requested page does not exists.</p>
      </div>
    </div>
  );
};

export default PageNotFound;
