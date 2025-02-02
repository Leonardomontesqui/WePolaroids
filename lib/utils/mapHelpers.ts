import mapboxgl from "mapbox-gl";
import { Post } from "../types";

export const createCustomMarker = (
  memory: {
    image_url: string;
    title: string;
    description: string;
  },
  onClick: (memory: Post) => void
) => {
  const el = document.createElement("div");
  el.className = "memory-marker";

  el.innerHTML = `
    <div class="marker-container">
      <div class="bg-white flex flex-col justify-center items-center rounded-lg shadow-lg p-2 border border-gray-200 w-[80px] h-[100px] hover:shadow-xl transition-all duration-300 my-auto">
        <img src="${memory.image_url}" 
             alt="${memory.title}"
             class="w-28 h-32 object-cover rounded-lg mb-1" />
      </div>
  `;

  const container = el.querySelector(".marker-container");
  const hoverCard = el.querySelector(".hover-card");

  container?.addEventListener("mouseenter", () => {
    hoverCard?.classList.remove("opacity-0", "invisible");
    hoverCard?.classList.add("opacity-100", "visible");
    el.style.zIndex = "1000";
  });

  container?.addEventListener("mouseleave", () => {
    hoverCard?.classList.add("opacity-0", "invisible");
    hoverCard?.classList.remove("opacity-100", "visible");
    el.style.zIndex = "auto";
  });

  container?.addEventListener("click", () => {
    onClick(memory as Post);
  });

  return new mapboxgl.Marker({ element: el, anchor: "bottom" });
};
