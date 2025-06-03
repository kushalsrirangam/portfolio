const projects = [
  {
    title: "Smart Hat (AI Navigation)",
    slug: "smart-hat",
    year: "2025",
    description: "Smart Hat is an AI-powered wearable...",
    why: "We built Smart Hat to empower visually impaired individuals...",
    features: [
      "Real-time object detection using MobileNetV2 TFLite model on Raspberry Pi 5",
      "Ultrasonic sensors for close-range obstacle detection",
      "Flask backend with browser-based voice alerts using Web Speech API",
      "Firebase integration for real-time logging of detections and sensor data",
      "Interactive React dashboard with analytics, charts, and live controls",
      "Published at IEEE AIIoT 2025 conference"
    ],
    tech: ["Python", "TFLite", "Raspberry Pi", "React", "Firebase", "Flask"],
    img: "/images/smarthat.png",
    demoType: "video",
    demoUrl: "https://drive.google.com/file/d/1pJFi7f7KxPswWCSr2Y3X9ygTWMN5oTGW/preview",
  },
  {
    title: "Laureate Lens (Nobel Storytelling Portal)",
    slug: "laureate-lens",
    year: "2024",
    description: "Laureate Lens is a data storytelling portal...",
    why: "We wanted to present Nobel Prize data in an engaging and interactive way...",
    features: [
      "Tailwind + React frontend with embedded Power BI dashboards",
      "LangChain + FAISS chatbot using OpenAI API",
      "Cleaned Nobel dataset (1901–2024)",
      "Searchable by gender, country, category, and age",
      "RAG-based query answering for laureate insights"
    ],
    tech: ["React", "Power BI", "Python", "LangChain", "FAISS", "OpenAI API"],
    img: "/images/lens.png",
    demoType: "video",
    demoUrl: "https://drive.google.com/file/d/1luRUSKq-we74qa2xD60K0RyAgU2IraKA/preview",
  },
  {
    title: "Resume Analysis Web App (BERT Enhanced)",
    slug: "resume-analyzer",
    year: "2024",
    description: "A powerful AI-driven web app to evaluate and enhance resumes...",
    why: "We wanted to simplify resume screening and enhancement...",
    features: [
      "Uses Sentence-BERT embeddings and classifier",
      "Estimates ATS score using keyword + section match",
      "Keyword highlighting and HTML rendering",
      "Cosine similarity job-description matching",
      "GPT-3.5 suggestions and rewrite",
      "Supports multiple formats and exports",
      "Streamlit UI with sliders, expanders, radio buttons"
    ],
    tech: ["Python", "Streamlit", "Sentence-BERT", "OpenAI API", "FPDF", "Plotly"],
    img: "/images/resume.png",
    demoType: "video",
    demoUrl: "https://drive.google.com/file/d/1lZt6ZzdNQbOinPTlqf74WSRmvfEgKs_J/preview",
  },
  {
    title: "Esports Storytelling Platform",
    slug: "esports-storytelling",
    year: "2023",
    description: "A blog and visualization platform for esports trends and earnings...",
    why: "Esports needed real-time data storytelling for fans and analysts...",
    features: [
      "Power BI dashboards filtered by game, genre, region",
      "Squarespace blog integration",
      "Twitch API for live streams and match data",
      "Embedded YouTube + Twitter for real-time player stats",
      "Short player bios for context"
    ],
    tech: ["Power BI", "Squarespace", "Twitch API"],
    img: "/images/esports.png",
    demoType: "video",
    demoUrl: "https://drive.google.com/file/d/1f_vAqLvoElLiNn7FsmhEjXu34d52n3sq/preview",
  },
];

export default projects;
