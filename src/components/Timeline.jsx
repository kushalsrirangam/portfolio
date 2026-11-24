import { motion } from "framer-motion";

import milestones from "../data/timeline";

export default function Timeline() {
  return (
    <section className="section-3d text-white" id="timeline">
      <h2 className="section-title">Milestones</h2>
      <div className="mx-auto flex flex-col gap-6 max-w-2xl w-full">
        {milestones.map((item, i) => (
          <motion.div
            key={item.title}
            className="flex gap-4 items-start"
            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <div className="w-14 sm:w-20 text-base sm:text-lg flex-shrink-0 text-[#00ffe7] font-bold text-right drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{item.date}</div>
            <div className="glass p-4 flex-1 min-w-0 text-left">
              <div className="font-semibold text-xl">{item.title}</div>
              <div className="text-[#00ffe7] font-medium">{item.org}</div>
              <div className="text-gray-300 text-md mt-1">{item.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
