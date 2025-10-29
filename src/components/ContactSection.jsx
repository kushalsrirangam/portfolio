import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function ContactSection() {
  return (
    <section id="contact" className="relative bg-gradient-to-br from-[#10101A] to-[#181829] w-full py-12 overflow-hidden">
      <motion.div
        className="max-w-2xl mx-auto bg-white/10 border border-cyan-400/30 rounded-2xl shadow-xl p-8 backdrop-blur-md text-center relative z-10"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-white mb-2">Contact</h2>
        <p className="text-gray-300 mb-6">
          Let's connect! Feel free to reach out for opportunities, collaboration, or just a tech chat.
        </p>

        <div className="flex justify-center gap-6 mb-6">
          <a
            href="mailto:k_srirangam@u.pacific.edu"
            className="text-cyan-300 text-2xl hover:text-white transition"
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://www.linkedin.com/in/kushal-sri-rangam-a1857b2a0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 text-2xl hover:text-white transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/kushalsrirangam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 text-2xl hover:text-white transition"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </div>

        <a
          href="/videos/RESUME (2).pdf"
          download
          className="inline-block mt-2 px-6 py-3 bg-cyan-400 text-[#181829] font-semibold rounded-lg shadow-lg hover:bg-cyan-300 transition-all"
        >
          📄 Download Resume
        </a>
      </motion.div>

      {/* Optional animated blob */}
      <div className="absolute left-12 bottom-12 w-60 h-60 rounded-full bg-gradient-to-tr from-cyan-400/30 to-blue-800/10 blur-3xl opacity-25 animate-pulse pointer-events-none" />
    </section>
  );
}
