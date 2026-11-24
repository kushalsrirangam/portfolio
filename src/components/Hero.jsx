import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";

export default function Hero() {
  const [doneTyping, setDoneTyping] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 text-center"
    >
      <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-black/40 px-4 py-1 text-xs font-display tracking-[0.25em] text-green-300 backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        PLAYER 1 · ONLINE
      </span>
      <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] mb-4 leading-tight">
        Hi, I’m
        <br />
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent animate-text-glow">
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
        className="absolute bottom-10 flex flex-col items-center gap-2 font-display text-fuchsia-300 hover:text-fuchsia-200 transition text-sm tracking-[0.3em] animate-pulse"
      >
        PRESS START
        <span className="text-xs tracking-widest text-cyan-300/80">scroll to enter the room</span>
      </a>
    </section>
  );
}
