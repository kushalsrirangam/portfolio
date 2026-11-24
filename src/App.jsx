import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutMe from "./components/AboutMe";
import Timeline from "./components/Timeline";
import ProjectsSection from "./components/ProjectsSection";
import SkillsCloud from "./components/SkillsCloud";
import AchievementsSection from "./components/AchievementsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ProjectDetails from "./components/pages/ProjectDetails";

// The 3D office loads separately so the text appears first.
const Scene3D = lazy(() => import("./three/Scene3D"));

function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>
      <Navbar />
      {/* Sections scroll over the fixed 3D scene; the camera follows them. */}
      <main className="relative z-10 overflow-x-clip">
        {/* Each panel sits opposite the part of the office the camera shows. */}
        <div className="side-left"><Hero /></div>
        <div className="side-right"><AboutMe /></div>
        <div className="side-right"><Timeline /></div>
        <div className="side-left"><ProjectsSection /></div>
        <div className="side-left"><SkillsCloud /></div>
        <div className="side-left"><AchievementsSection /></div>
        <div className="side-right"><ContactSection /></div>
        <Footer />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects/:slug" element={<ProjectDetails />} />
    </Routes>
  );
}
