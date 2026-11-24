import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function ContactSection() {
  return (
    <section id="contact" className="section-3d">
      <motion.div
        className="glass max-w-2xl w-full mx-auto p-8 text-center relative z-10"
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

    </section>
  );
}
