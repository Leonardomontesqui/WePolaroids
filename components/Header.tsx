import React from "react";

export default function Header() {
  return (
    <div className="flex flex-col p-5 absolute z-50 mt-4 mx-4 gap-2 items-center rounded-xl w-[274px]  bg-cream">
      <h1 className="text-[96px] text-[#7A7A7A] text-blue font-bold leading-none w-full">
        We.
      </h1>
      <p className="justify-left text-[#63635D] text-[20px] font-semibold w-full">
        everyones photo album
      </p>
    </div>
  );
}
