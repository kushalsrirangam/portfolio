import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";

export default function Hero() {
  const [doneTyping, setDoneTyping] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 text-center"
    >
      {/* Darkens the left of the office photo-real scene so the text reads. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#0b0d12]/85 via-[#0b0d12]/45 to-transparent" />
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-black/40 px-4 py-1.5 text-sm font-display text-emerald-300 backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        Open to opportunities
      </span>
      <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] mb-4 leading-[1.05]">
        Kushal
        <br />
        <span className="bg-gradient-to-r from-cyan-300 to-sky-500 bg-clip-text text-transparent">Sri Rangam</span>
      </h1>
      <p className="text-xl md:text-2xl text-slate-200 font-medium mt-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
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
        className="absolute bottom-10 flex flex-col items-center gap-2 font-display text-slate-300 hover:text-white transition text-sm tracking-widest uppercase"
      >
        Take the office tour
        <span className="block h-8 w-[1px] bg-gradient-to-b from-slate-300 to-transparent animate-pulse" />
      </a>
    </section>
  );
}
