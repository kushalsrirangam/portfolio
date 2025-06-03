export default function Footer() {
  return (
    <footer className="bg-[#10101A] text-center py-5 border-t border-white/10 text-gray-400">
      <div className="flex justify-center gap-4 mb-2">
        <a href="https://www.linkedin.com/in/kushal-sri-rangam-a1857b2a0/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition">LinkedIn</a>
        <span>•</span>
        <a href="https://github.com/kushalsrirangam" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition">GitHub</a>
      </div>
      <span>&copy; {new Date().getFullYear()} Kushal Sri Rangam. All rights reserved.</span>
    </footer>
  );
}
