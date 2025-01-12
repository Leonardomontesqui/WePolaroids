import React from "react";

export default function Header() {
  return (
    <div className="flex flex-col justify-between p-4 bg-gray-800 text-white absolute z-50 mt-4 mx-4 gap-6 bg-[#33343F] rounded-xl w-[240px]">
      <h1 className="text-[40px] font-bold leading-tight">
        Spotting Dinasours
      </h1>
      <div className="flex flex-col gap-2">
        <p className="justify-left">1. Click a point on the map</p>
        <p className="justify-left">2. Share a memory</p>
      </div>

      {/* <button className="w-full border rounded-lg bg-[#38409C] border-[#4D5AEE] py-2 disabled:opacity-50">
        Report
      </button> */}
    </div>
  );
}
