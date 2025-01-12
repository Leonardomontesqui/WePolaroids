import React from "react";

export default function Header() {
  return (
    <div className="flex flex-col md:p-5 p-3 absolute z-20 mt-4 mx-4 gap-2 items-center rounded-xl w-[200px] md:w-[274px]  bg-cream">
      <h1 className="md:text-[96px] text-[32px] text-[#7A7A7A] text-blue font-bold leading-none w-full">
        We.
      </h1>
      <p className="justify-left text-[#63635D] md:text-[20px] text-[14px] font-semibold w-full">
        everyones photo album
      </p>
    </div>
  );
}
