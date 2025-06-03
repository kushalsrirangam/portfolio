import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function HeroParticles() {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#090913]">
      <Particles
        className="absolute inset-0 z-0"
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "#090913" } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" } },
            modes: { repulse: { distance: 100, duration: 0.4 } }
          },
          particles: {
            color: { value: "#00ffe7" },
            links: { enable: true, color: "#00ffe7", distance: 150, opacity: 0.5, width: 1 },
            move: { enable: true, speed: 1, outModes: "out" },
            number: { value: 70, density: { enable: true, area: 900 } },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } }
          }
        }}
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4">
          Hi, I’m <span className="text-[#00ffe7]">Kushal Sri Rangam</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-medium">
          Building Next-Gen AI, Data & Cloud Solutions
        </p>
      </div>
    </div>
  );
}
