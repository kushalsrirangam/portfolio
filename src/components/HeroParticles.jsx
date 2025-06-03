import { useCallback, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Typewriter } from "react-simple-typewriter";

export default function HeroParticles() {
  const [doneTyping, setDoneTyping] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div
      id="home"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#090913]"
    >
      <Particles
        className="absolute inset-0 z-0"
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "#090913" } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" } },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
          particles: {
            color: { value: "#00ffe7" },
            links: {
              enable: true,
              color: "#00ffe7",
              distance: 150,
              opacity: 0.5,
              width: 1,
            },
            move: { enable: true, speed: 1, outModes: "out" },
            number: { value: 70, density: { enable: true, area: 900 } },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } },
          },
        }}
      />
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4">
          Hi, I’m{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-text-glow">
            Kushal Sri Rangam
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-cyan-300 font-medium mt-2">
          {!doneTyping ? (
            <Typewriter
              words={["AI/ML Developer", "Cloud Engineer", "Data Storyteller"]}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={0}
              delaySpeed={1000}
              onLoopDone={() => setDoneTyping(true)}
              onType={() => setDoneTyping(false)}
            />
          ) : (
            "AI/ML Developer"
          )}
        </p>
      </div>
    </div>
  );
}
