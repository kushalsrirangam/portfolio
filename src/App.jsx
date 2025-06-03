import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroParticles from "./components/HeroParticles";
import AboutMe from "./components/AboutMe";
import Timeline from "./components/Timeline";
import ProjectsSection from "./components/ProjectsSection";
import SkillsCloud from "./components/SkillsCloud";
import AchievementsSection from "./components/AchievementsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ProjectDetails from "./components/pages/ProjectDetails";

// Divider SVG Component
const Divider = ({ fill = "#181829" }) => (
  <div className="overflow-hidden -mb-1">
    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill={fill} d="M0,80 C480,0 960,160 1440,80 L1440,160 L0,160 Z" />
    </svg>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <div className="h-16" />

            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center">
              <HeroParticles />
              <div className="absolute left-10 top-10 w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-400/40 to-blue-500/10 blur-3xl opacity-30 animate-pulse pointer-events-none" />
            </section>
            <Divider fill="#10101A" />

            {/* About Me */}
            <section className="relative bg-gradient-to-br from-[#10101A] to-[#181829] w-full py-12 overflow-hidden">
              <AboutMe />
              <div className="absolute right-10 top-28 w-56 h-56 rounded-full bg-gradient-to-tr from-cyan-400/30 to-blue-800/20 blur-3xl opacity-30 animate-pulse pointer-events-none" />
            </section>
            <Divider fill="#181829" />

            {/* Timeline */}
            <section className="relative bg-[#181829] w-full py-12 overflow-hidden">
              <Timeline />
              <div className="absolute left-20 bottom-16 w-60 h-60 rounded-full bg-gradient-to-br from-cyan-400/40 to-blue-500/10 blur-3xl opacity-30 animate-pulse pointer-events-none" />
            </section>
            <Divider fill="#10101A" />

            {/* Projects */}
            <section className="relative bg-gradient-to-tr from-[#10101A] to-[#21213b] w-full py-12 overflow-hidden">
              <ProjectsSection />
              <div className="absolute right-24 top-1/3 w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-400/30 to-blue-800/10 blur-3xl opacity-20 animate-pulse pointer-events-none" />
            </section>
            <Divider fill="#10101A" />

            {/* Skills */}
            <section className="relative bg-[#10101A] w-full py-12 overflow-hidden">
              <SkillsCloud />
              <div className="absolute left-16 bottom-20 w-52 h-52 rounded-full bg-gradient-to-tr from-cyan-400/30 to-blue-800/10 blur-3xl opacity-30 animate-pulse pointer-events-none" />
            </section>
            <Divider fill="#181829" />

            {/* Achievements */}
            <section className="relative bg-gradient-to-br from-[#181829] to-[#10101A] w-full py-12 overflow-hidden">
              <AchievementsSection />
              <div className="absolute right-24 top-16 w-64 h-64 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/10 blur-3xl opacity-30 animate-pulse pointer-events-none" />
            </section>

            {/* Contact and Footer */}
            <ContactSection />
            <Footer />
          </>
        }
      />

      {/* Dynamic Route for Project Details */}
      <Route path="/projects/:slug" element={<ProjectDetails />} />
    </Routes>
  );
}
