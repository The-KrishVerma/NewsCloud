import React from "react";

const About = () => {
  const team = [
    {
      name: "krish verma",
      role: "Backend & ML Engineer",
      bio: "Building scalable backends and ML features to power NewsCloud's summarization and recommendation engines.",
    },
  ];

  return (
    <div>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-blue-900/30 p-6 animate-slide-up mt-0">
        <div className="w-full">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-gradient">About NewsCloud</h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                <strong>NewsCloud</strong> is an AI-powered news platform that delivers concise, trustworthy summaries and personalized news feeds — so you can know what matters in minutes.
              </p>

              <p className="text-gray-300 mb-4">
                We combine high-performance backend pipelines, modern machine learning models, and human curation signals to surface timely, relevant stories while reducing noise. Our system is built for speed, scale, and transparency — turning long-form reporting into clear, actionable summaries.
              </p>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div>
                  <h4 className="text-blue-300 font-semibold mb-2">Core Capabilities</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    <li>Automatic, factual article summarization with contextual highlights</li>
                    <li>Personalized recommendations that learn from your reading patterns</li>
                    <li>Source provenance, timestamps, and confidence indicators for transparency</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-blue-300 font-semibold mb-2">Why NewsCloud</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    <li>Real-time updates and low-latency indexing for breaking news</li>
                    <li>Privacy-first personalization with clear data controls</li>
                    <li>Save summaries for offline reading and quick reference</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-400 italic mt-6">
                Get the headlines in seconds, dig deeper in minutes — NewsCloud helps you stay informed without the overwhelm.
              </p>

          <footer className="mt-8 text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} NewsCloud — Built by Krish Verma.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default About;