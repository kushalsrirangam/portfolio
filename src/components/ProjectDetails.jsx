// src/pages/ProjectDetails.jsx
import { useParams } from "react-router-dom";
import projects from "../data/projects"; // make sure your projects.js is here

export default function ProjectDetails() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <div className="text-white p-10 text-xl">❌ Project not found</div>;

  return (
    <div className="min-h-screen bg-[#10101A] text-white p-10">
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
      <p className="mb-4 text-lg">{project.description}</p>

      {project.demoType === "video" && project.demoUrl && (
        <video
          src={project.demoUrl}
          controls
          className="mb-6 w-full max-w-4xl rounded-lg shadow-lg"
        />
      )}

      <h2 className="text-2xl font-semibold mt-6 mb-2">🔧 Features</h2>
      <ul className="list-disc ml-6 space-y-1 text-base">
        {project.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">🛠️ Tech Stack</h2>
      <p>{project.tech.join(", ")}</p>

      <div className="mt-8 space-x-4">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline"
          >
            View on GitHub
          </a>
        )}
        {project.tryIt && (
          <a
            href={project.tryIt}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 underline"
          >
            Try it live
          </a>
        )}
      </div>
    </div>
  );
}
