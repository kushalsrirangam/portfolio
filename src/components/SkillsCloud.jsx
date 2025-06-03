import skills from "../data/skills";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SkillsCloud() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-16 bg-[#10101A]" id="skills">
      <motion.h2
        className="text-4xl font-bold text-center text-white mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Skills
      </motion.h2>
      <div className="flex flex-wrap gap-6 justify-center items-center mb-10">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            className={`relative bg-[#181829] px-6 py-3 rounded-2xl shadow-lg flex flex-col items-center cursor-pointer transition-all
              ${selected === i ? "ring-2 ring-[#00ffe7]" : "hover:scale-110 hover:ring-2 hover:ring-[#00ffe7]"}`}
            whileHover={{ scale: 1.1 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => setSelected(selected === i ? null : i)}
          >
            <span className="text-3xl mb-1">{skill.icon}</span>
            <span className="text-lg font-bold text-white">{skill.name}</span>
            <span className="text-xs text-[#00ffe7]">{skill.type}</span>
            <AnimatePresence>
              {selected === i && (
                <motion.div
                  className="absolute left-1/2 top-full -translate-x-1/2 mt-4 bg-[#21213b] rounded-lg shadow-xl p-4 z-30 min-w-[180px] border border-[#00ffe7]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <div className="text-base text-white font-semibold mb-1">Projects:</div>
                  <ul className="text-[#00ffe7] text-sm">
                    {skill.projects.map(p => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <div className="text-center text-gray-400 text-sm mt-8">
        Click a skill to see where it shines!
      </div>
    </section>
  );
}
