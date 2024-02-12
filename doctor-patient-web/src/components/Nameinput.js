import React from 'react';

const NameInput = () => {
  return (
    <div className="w-96 h-20 justify-start items-start gap-5 inline-flex">
      {/* First Name */}
      <div className="w-48 flex-col justify-start items-start gap-1 inline-flex">
        <div className="text-neutral-800 text-sm font-semibold font-Montserrat leading-tight">
          First Name
        </div>
        <div className="self-stretch h-12 px-4 py-3 rounded border border-neutral-200 justify-start items-center gap-2 inline-flex">
          <div className="grow shrink basis-0 self-stretch justify-start items-center gap-2.5 flex">
            <input
              type="text"
              className="w-full h-full text-neutral-400 text-sm font-normal font-Montserrat leading-snug outline-none"
              placeholder="Enter full name"
            />
          </div>
        </div>
      </div>

      {/* Last Name */}
      <div className="w-48 flex-col justify-start items-start gap-1 inline-flex">
        <div className="text-neutral-800 text-sm font-semibold font-Montserrat leading-tight">
          Last Name
        </div>
        <div className="self-stretch h-12 px-4 py-3 rounded border border-neutral-200 justify-start items-center gap-2 inline-flex">
          <div className="grow shrink basis-0 self-stretch justify-start items-center gap-2.5 flex">
            <input
              type="text"
              className="w-full h-full text-neutral-400 text-sm font-normal font-Montserrat leading-snug outline-none"
              placeholder="Enter last name"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameInput;
