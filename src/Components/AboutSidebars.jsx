import React from 'react';

export const AboutLeftSidebar = () => {
  const links = [
    { label: 'Read Documentation', icon: '📄' },
    { label: 'Privacy Policy', icon: '🛡️' },
    { label: 'Terms of Service', icon: '📜' },
    { label: 'Support & FAQ', icon: '❓' },
  ];

  return (
    <div className="space-y-4 sticky top-20">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-900/30">
        <h3 className="font-bold text-base mb-4 text-blue-400 flex items-center gap-2">
          <span>🔗</span> Quick Links
        </h3>
        <div className="space-y-2">
          {links.map((item, idx) => (
            <button
              key={idx}
              className="w-full text-left px-3 py-2 bg-gray-700/30 hover:bg-gray-700/80 border border-gray-600/30 hover:border-blue-500/50 rounded-lg text-sm text-gray-300 hover:text-blue-300 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-4 border border-purple-800/50">
        <h3 className="font-bold text-base mb-2 text-purple-400">Our Mission</h3>
        <p className="text-sm text-gray-300">
          To cut through the noise of the modern news cycle by delivering fast, objective, and easily digestible summaries.
        </p>
      </div>
    </div>
  );
};

export const AboutRightSidebar = () => {
  return (
    <div className="space-y-4 sticky top-20 h-fit">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-900/30 text-center">
        <h3 className="font-bold text-base mb-4 text-cyan-400 flex items-center justify-center gap-2">
          <span>👨‍💻</span> Lead Developer
        </h3>
        
        <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/30">
          KV
        </div>
        
        <h4 className="text-lg font-bold text-gray-100">Krish Verma</h4>
        <p className="text-sm text-blue-300 font-medium mb-3">Backend & ML Engineer</p>
        
        <p className="text-xs text-gray-400 mb-4 px-2">
          Building scalable backends and ML features to power NewsCloud's summarization and recommendation engines.
        </p>
        

      </div>
    </div>
  );
};
