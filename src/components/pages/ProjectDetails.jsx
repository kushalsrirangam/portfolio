import { useParams, Link } from "react-router-dom";
import projects from "../../data/projects";
import { motion } from "framer-motion";
import MiniMatrixReveal from "../MiniMatrixReveal";

export default function ProjectDetails() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#10101A] text-white">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <Link to="/" className="text-cyan-400 underline hover:opacity-75">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10101A] text-white px-6 pt-28 pb-12 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10"
      >
        {/* Animated Matrix Title */}
        <div className="flex justify-center">
          <MiniMatrixReveal text={project.title} height={200} color="#00ffe7" />
        </div>

        {/* Why We Did This Project */}
        {project.why && (
          <div className="text-center text-md text-cyan-200 max-w-3xl mx-auto italic">
            {project.why}
          </div>
        )}

        {/* Actual Image */}
        {project.img && (
          <div className="flex justify-center">
            <img
              src={project.img}
              alt={project.title}
              className="rounded-xl border-2 border-cyan-500 w-full max-w-4xl object-contain max-h-[480px] mt-4"
            />
          </div>
        )}

        {/* Video Preview or Embedded Player */}
        {project.demoType === "video" && project.demoUrl && (
          <div className="flex justify-center">
            {project.demoUrl.includes("drive.google.com") ? (
              <iframe
                src={project.demoUrl.replace("/view?usp=sharing", "/preview")}
                width="100%"
                height="480"
                allow="autoplay"
                allowFullScreen
                className="rounded-xl border-2 border-cyan-500 max-w-4xl"
                title="Project Demo"
              />
            ) : (
              <video
                src={project.demoUrl}
                controls
                className="rounded-xl border-2 border-cyan-500 w-full max-w-4xl"
              />
            )}
          </div>
        )}

        {/* Live App Preview */}
        {project.demoType === "interactive" && project.tryIt && (
          <iframe
            src={project.tryIt}
            title="Live Demo"
            className="w-full h-[500px] rounded-xl border-2 border-cyan-500"
            allow="fullscreen"
          />
        )}

        {/* Divider */}
        <div className="h-[2px] bg-gradient-to-r from-cyan-500/20 via-cyan-500 to-cyan-500/20 rounded-full" />

        {/* Features */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">✨ Key Features</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            {project.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">🛠 Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {project.tech.map((t, i) => (
              <span
                key={i}
                className="bg-[#181829] border border-cyan-400 text-cyan-100 px-3 py-1 rounded-full text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-6 mt-6">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition"
            >
              🔗 GitHub Repo
            </a>
          )}
          {project.tryIt && (
            <a
              href={project.tryIt}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-green-500 text-black rounded hover:bg-green-400 transition"
            >
              🚀 Try it Live
            </a>
          )}
        </div>

        {/* Back Link */}
        <div className="pt-10 text-center">
          <Link
            to="/"
            className="text-cyan-400 underline hover:opacity-75 transition text-lg"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
