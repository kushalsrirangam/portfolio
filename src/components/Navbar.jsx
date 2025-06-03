import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-lg shadow border-b border-white/10 flex justify-center py-3">
      <div className="flex gap-8">
        <a href="#about" className="font-bold text-cyan-300 hover:underline underline-offset-4 transition">About</a>
        <a href="#timeline" className="font-bold text-cyan-300 hover:underline underline-offset-4 transition">Timeline</a>
        <a href="#projects" className="font-bold text-cyan-300 hover:underline underline-offset-4 transition">Projects</a>
        <a href="#skills" className="font-bold text-cyan-300 hover:underline underline-offset-4 transition">Skills</a>
        <a href="#achievements" className="font-bold text-cyan-300 hover:underline underline-offset-4 transition">Achievements</a>
      </div>
    </nav>
  );
}
