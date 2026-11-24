import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  // Pointer position over the card, -0.5..0.5, drives a 3D tilt.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 18 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <Link to={`/projects/${project.slug}`} className="block w-full h-full">
      <motion.div
        className="glass h-full flex flex-col justify-between p-6 items-center group cursor-pointer
          transition-[border-color,box-shadow] duration-300 hover:shadow-cyan-400/30 hover:border-cyan-300/70"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        whileHover={{ scale: 1.04 }}
      >
        <img
          src={project.img || "https://placehold.co/400x220"}
          alt={project.title}
          className="rounded-lg w-full h-48 object-cover border-2 border-[#00ffe7] mb-4"
          style={{ transform: "translateZ(40px)" }}
        />
        <h3 className="text-2xl font-bold text-white mb-2 text-center" style={{ transform: "translateZ(30px)" }}>
          {project.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3 justify-center" style={{ transform: "translateZ(20px)" }}>
          {project.tech.map((tech, index) => (
            <span
              key={index}
              className="bg-[#00ffe7] text-[#181829] px-3 py-1 rounded-lg text-sm font-semibold"
            >
              {tech}
            </span>
          ))}
        </div>

        <p className="text-gray-300 mb-2 text-center line-clamp-3">{project.description}</p>
      </motion.div>
    </Link>
  );
}
