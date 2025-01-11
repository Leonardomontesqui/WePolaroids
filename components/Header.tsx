import React from "react";

export default function Header() {
  return (
    <div className="flex flex-col justify-between items-center p-4 bg-gray-800 text-white absolute z-50 mt-4 mx-6 gap-6 w-[360px] bg-[#33343F] rounded-xl">
      <h1 className="text-[42px] font-bold leading-tight">
        Keep the Streets Clean
      </h1>
      <p className="justify-left">
        Click a point on the map to make a hazard aware to other citizens
      </p>
      <button className="w-full border rounded-lg bg-[#38409C] border-[#4D5AEE] py-2 disabled:opacity-50">
        Report
      </button>
    </div>
  );
}
