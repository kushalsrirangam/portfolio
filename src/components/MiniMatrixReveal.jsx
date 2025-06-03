import React, { useEffect, useState } from "react";

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export default function MiniMatrixReveal({ text = "Smart Hat", speed = 50 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let interval;
    let frame = 0;

    const randomChar = () => charset[Math.floor(Math.random() * charset.length)];
    const target = text.split("");

    interval = setInterval(() => {
      const next = target.map((char, i) => {
        if (frame > i * 3) return char;
        return randomChar();
      }).join("");

      setDisplayed(next);
      frame++;

      if (frame > target.length * 3) {
        clearInterval(interval);
        setDisplayed(text);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="w-full text-center bg-[#0f0f17] p-4 rounded-lg border border-cyan-400 font-mono text-cyan-300 text-xl sm:text-2xl tracking-widest">
      {displayed}
    </div>
  );
}
