import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#07070f]/60 backdrop-blur-lg shadow border-b border-white/10 flex justify-center py-3">
      <div className="font-display font-medium flex gap-4 sm:gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 text-sm sm:text-base whitespace-nowrap">
        <a href="#home" className="font-bold text-cyan-300 hover:underline underline-offset-4 transition">Home</a>
        <a href="#about" className="font-bold text-cyan-300 hover:underline underline-offset-4 transition">About</a>
        <a href="#timeline" className="font-bold text-cyan-300 hover:underline underline-offset-4 transition">Timeline</a>
        <a href="#projects" className="font-bold text-cyan-300 hover:underline underline-offset-4 transition">Projects</a>
        <a href="#skills" className="font-bold text-cyan-300 hover:underline underline-offset-4 transition">Skills</a>
        <a href="#achievements" className="font-bold text-cyan-300 hover:underline underline-offset-4 transition">Achievements</a>
        <a href="#contact" className="font-bold text-cyan-300 hover:underline underline-offset-4 transition">Contact</a>
      </div>
    </nav>
  );
}
