import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";

export default function Hero() {
  const [doneTyping, setDoneTyping] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 text-center"
    >
      <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] mb-4">
        Hi, I’m{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-text-glow">
          Kushal Sri Rangam
        </span>
      </h1>
      <p className="text-xl md:text-2xl text-cyan-300 font-medium mt-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
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
      <a
        href="#about"
        className="absolute bottom-10 flex flex-col items-center gap-2 text-cyan-300/80 hover:text-cyan-200 transition text-sm tracking-widest uppercase"
      >
        Scroll to fly in
        <span className="block w-5 h-8 rounded-full border-2 border-cyan-300/70 relative">
          <span className="absolute left-1/2 top-1.5 -translate-x-1/2 w-1 h-2 rounded-full bg-cyan-300 animate-bounce" />
        </span>
      </a>
    </section>
  );
}
