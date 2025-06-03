import { motion } from "framer-motion";

const milestones = [
  {
    date: "2024",
    title: "Esports Storytelling Platform",
    org: "Data Visualization Developer",
    desc: "Designed a Squarespace-integrated Power BI blog with Twitch, YouTube, and Twitter APIs to showcase global esports insights.",
  },
  {
    date: "2025",
    title: "Smart Hat (AI Navigation)",
    org: "Research Assistant",
    desc: "Built an AI-powered wearable navigation system using Raspberry Pi, TFLite, and Firebase. Published at IEEE AIIoT 2025.",
  },
  {
    date: "2025",
    title: "Laureate Lens (Nobel Storytelling Portal)",
    org: "Full Stack Developer",
    desc: "Created a Power BI + React platform to analyze Nobel trends with an integrated AI chatbot using LangChain + FAISS + OpenAI.",
  },
  {
    date: "2025",
    title: "Resume Analyzer (AI-Powered Resume Feedback Tool)",
    org: "AI/NLP Engineer",
    desc: "Built a BERT-based resume evaluation tool with ATS scoring, job-role prediction, and GPT-enhanced suggestions using Streamlit.",
  },
  {
    date: "2025",
    title: "Global AI Hackathon Winner",
    org: "MIT RAISE",
    desc: "Awarded for VisionCap — an IoT + AI solution focused on assistive vision and real-world impact.",
  },
  {
    date: "May 2025",
    title: "M.S. in Computer Science",
    org: "University of the Pacific",
    desc: "Specialized in AI/ML, Data Analytics, and Cloud Security.",
  }
];

export default function Timeline() {
  return (
    <section className="relative py-16 bg-[#0d0d15] text-white" id="timeline">
      <h2 className="text-3xl font-bold text-center mb-12">Milestones</h2>
      <div className="mx-auto flex flex-col gap-8 max-w-2xl">
        {milestones.map((item, i) => (
          <motion.div
            key={item.title}
            className="flex gap-4 items-start"
            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <div className="w-16 flex-shrink-0 text-[#00ffe7] font-bold text-lg">{item.date}</div>
            <div className="bg-[#181829] rounded-xl p-4 flex-1 shadow-md">
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
