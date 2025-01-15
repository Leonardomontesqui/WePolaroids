import mapboxgl from "mapbox-gl";

export const createCustomMarker = (memory: {
  image_url: any;
  title: any;
  description: any;
}) => {
  const el = document.createElement("div");
  el.className = "memory-marker";
  el.innerHTML = `
    <div class="marker-container">
      <div class="bg-white flex flex-col justify-center items-center rounded-lg shadow-lg p-2 border border-gray-200 w-[80px] h-[100px] hover:shadow-xl transition-all duration-300 my-auto">
        <img src="${memory.image_url}" 
             alt="${memory.title}"
             class="w-28 h-32 object-cover rounded-lg mb-1" />
      </div>

      <!-- Hover Card -->
        <div class="hover-card opacity-0 invisible pointer-events-none absolute left-1/2 bottom-full mb-2 w-64 bg-white rounded-lg shadow-xl p-4 transform -translate-x-1/2 transition-all duration-300">
          <h3 class="text-lg font-semibold mb-2">${memory.title}</h3>
          <p class="text-sm text-gray-600 mb-2">${
            memory.description || "No description available"
          }</p>
          <div class="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
            <div class="w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-200"></div>
          </div>
        </div>
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

  return new mapboxgl.Marker({ element: el, anchor: "bottom" });
};
