import { motion } from "framer-motion";

export default function AboutMe() {
  return (
    <section className="section-3d items-center text-center" id="about">
      <div className="glass max-w-2xl w-full mx-auto p-8 flex flex-col items-center">
      <motion.img
        src="/images/my.JPG"
        alt="Kushal Sri Rangam"
        className="w-40 h-40 object-cover rounded-full border-4 border-[#00ffe7] shadow-2xl mb-4"
        initial={{ opacity: 0, scale: 0.8, y: 80 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.h2
        className="text-4xl font-bold mb-2 text-white"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        About Me
      </motion.h2>
      <motion.p
        className="text-lg text-gray-300 max-w-xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        I’m Kushal Sri Rangam, passionate about AI, ML, and building smart, user-focused solutions.
        I recently completed my Master’s in Computer Science at University of the Pacific and have
        built award-winning projects like Smart Hat (for visually impaired navigation), Resume Analysis AI,
        and Laureate Lens. Always exploring tech that makes a difference!
      </motion.p>
      <div className="flex flex-wrap gap-4 mt-6 justify-center">
        <motion.div
          className="bg-[#181829] text-[#00ffe7] rounded-xl px-6 py-2 font-semibold text-lg shadow-lg"
          whileHover={{ scale: 1.08, backgroundColor: "#00ffe7", color: "#10101A" }}
        >
          🏆 IEEE AIIoT 2025
        </motion.div>
        <motion.div
          className="bg-[#181829] text-[#00ffe7] rounded-xl px-6 py-2 font-semibold text-lg shadow-lg"
          whileHover={{ scale: 1.08, backgroundColor: "#00ffe7", color: "#10101A" }}
        >
          🛠️ Smart Hat Project Lead
        </motion.div>
        <motion.div
          className="bg-[#181829] text-[#00ffe7] rounded-xl px-6 py-2 font-semibold text-lg shadow-lg"
          whileHover={{ scale: 1.08, backgroundColor: "#00ffe7", color: "#10101A" }}
        >
          💡 Hackathon Winner @ MIT RAISE
        </motion.div>
      </div>
      </div>
    </section>
  );
}
