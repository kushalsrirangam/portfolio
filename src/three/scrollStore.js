// Shared, non-React state read every frame by the 3D scene.
// Keeping it outside React means scrolling never triggers re-renders.

// Section ids in page order. Each one has a matching 3D "station".
export const SECTION_IDS = [
  "home",
  "about",
  "timeline",
  "projects",
  "skills",
  "achievements",
  "contact",
];

export const scrollStore = {
  // Fractional station index (0 = home, 6 = contact) the camera should be at.
  station: 0,
  // Normalised pointer position, -1..1 on each axis.
  pointer: { x: 0, y: 0 },
};

let centers = [];

function measure() {
  centers = SECTION_IDS.map((id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY + rect.height / 2;
  }).filter((c) => c !== null);
}

function update() {
  if (centers.length < 2) {
    scrollStore.station = 0;
    return;
  }
  // The point of the page currently in the middle of the screen.
  const y = window.scrollY + window.innerHeight / 2;
  if (y <= centers[0]) {
    scrollStore.station = 0;
    return;
  }
  const last = centers.length - 1;
  if (y >= centers[last]) {
    scrollStore.station = last;
    return;
  }
  for (let i = 0; i < last; i++) {
    if (y < centers[i + 1]) {
      scrollStore.station = i + (y - centers[i]) / (centers[i + 1] - centers[i]);
      return;
    }
  }
}

// Starts tracking scroll and pointer. Returns a cleanup function.
export function startTracking() {
  const onScroll = () => update();
  const onResize = () => {
    measure();
    update();
  };
  const onPointer = (e) => {
    scrollStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    scrollStore.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };

  measure();
  update();

  // Section heights change as images and fonts load, so re-measure then too.
  const ro = new ResizeObserver(onResize);
  ro.observe(document.body);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onPointer, { passive: true });

  return () => {
    ro.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointer);
  };
}
