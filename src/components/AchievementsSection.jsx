import achievements from "../data/achievements";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function AchievementsSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-16 pb-32 bg-[#10101A]" id="achievements">
      <motion.h2
        className="text-4xl font-bold text-center text-white mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Achievements & Certifications
      </motion.h2>
      <div className="flex flex-wrap gap-8 justify-center">
        {achievements.map((ach, i) => (
          <motion.div
            key={ach.title}
            className="relative bg-[#181829] border-2 border-yellow-400 shadow-yellow-400/40 
              rounded-2xl shadow-lg flex flex-col items-center px-7 py-6 cursor-pointer transition-all hover:shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setOpen(open === i ? null : i)}
            whileHover={{ scale: 1.07 }}
          >
            <span className={`text-4xl mb-2 ${ach.rare ? "animate-pulse" : ""}`}>{ach.icon}</span>
            <span className="text-xl font-bold text-white mb-1">{ach.title}</span>
            <span className="text-[#00ffe7] text-sm">{ach.date}</span>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  className="absolute left-1/2 top-full -translate-x-1/2 mt-4 bg-[#21213b] border border-[#00ffe7] rounded-lg shadow-2xl p-4 z-30 min-w-[210px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <div className="font-semibold text-white mb-1">{ach.description}</div>
                  {ach.proof && (
                    <a
                      href={ach.proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00ffe7] underline"
                    >
                      View Proof
                    </a>
                  )}
                  <div className="text-gray-400 text-xs mt-2">{ach.type}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <div className="text-center text-gray-400 text-sm mt-8">
        Click any badge to learn more!
      </div>
    </section>
  );
}
