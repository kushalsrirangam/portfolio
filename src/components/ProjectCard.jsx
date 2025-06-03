import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="w-full">
      <motion.div
        className="h-full flex flex-col justify-between bg-white/10 border border-cyan-400/30 rounded-2xl shadow-xl p-6
        items-center group cursor-pointer transition-all duration-300 hover:shadow-cyan-400/30 hover:border-cyan-300/70 backdrop-blur-md"
        whileHover={{ y: -8, scale: 1.05 }}
      >
        <img
          src={project.img || "https://placehold.co/400x220"}
          alt={project.title}
          className="rounded-lg w-full h-48 object-cover border-2 border-[#00ffe7] mb-4"
        />
        <h3 className="text-2xl font-bold text-white mb-2 text-center">
          {project.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3 justify-center">
          {project.tech.map((tech, index) => (
            <span
              key={index}
              className="bg-[#00ffe7] text-[#181829] px-3 py-1 rounded-lg text-sm font-semibold"
            >
              {tech}
            </span>
          ))}
        </div>

        <p className="text-gray-300 mb-2 text-center line-clamp-3">
          {project.description}
        </p>
      </motion.div>
    </Link>
  );
}
