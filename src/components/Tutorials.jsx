export default function Tutorials() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-black text-white">
      <div className="w-full max-w-3xl mt-16 rounded-2xl shadow-lg bg-gradient-to-br from-[#232323] via-black to-[#e99b63]/30 p-8 border-2 border-[#e99b63]/40">
        <h1 className="text-4xl font-semibold text-[#e99b63] mb-6 tracking-wider">Tutorials</h1>
        <p className="text-lg text-gray-200 mb-8">
          Tuklasin ang mga piling aralin sa sign language, mula sa panimulang antas hanggang sa mas mataas na antas. 
          
        </p>

        {/* Beginner & Intermediate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Beginner Card */}
          <div className="bg-black bg-opacity-60 rounded-xl border border-[#e99b63]/30 p-8 shadow-lg hover:shadow-[0_0_20px_rgba(233,155,99,0.3)] transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 tracking-wider" style={{ color: "#CAB87E" }}>🥳 Beginner Level</h2>
            <ul className="space-y-4 text-gray-300">
              <li>
                <a href="https://www.youtube.com/watch?v=36GlmDTYs6s" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-[#e99b63] hover:text-[#CAB87E] font-semibold hover:underline group">
                  • Basic FSL Tutorial 
                  <span className="ml-2 text-xs bg-[#e99b63]/20 px-2 py-1 rounded-full group-hover:bg-[#CAB87E]/30 transition">
                    12min
                  </span>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=IlxBht3wVGU" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-[#e99b63] hover:text-[#CAB87E] font-semibold hover:underline group">
                  • FSL Alphabet Basics
                  <span className="ml-2 text-xs bg-[#e99b63]/20 px-2 py-1 rounded-full group-hover:bg-[#CAB87E]/30 transition">
                    5min
                  </span>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=iYpTJ5cEl9Y" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-[#e99b63] hover:text-[#CAB87E] font-semibold hover:underline group">
                  • Complete FSL Alphabet
                  <span className="ml-2 text-xs bg-[#e99b63]/20 px-2 py-1 rounded-full group-hover:bg-[#CAB87E]/30 transition">
                    8min
                  </span>
                </a>
              </li>
              <li>
                <a href="https://deafphilippines.wordpress.com/2010/05/02/download-filipino-sign-language-font-for-free/" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-[#e99b63] hover:text-[#CAB87E] font-semibold hover:underline">
                  • Free FSL Font Download (PDF/TTF)
                </a>
              </li>
            </ul>
          </div>

          {/* Intermediate Card */}
          <div className="bg-black bg-opacity-60 rounded-xl border border-[#e99b63]/30 p-8 shadow-lg hover:shadow-[0_0_20px_rgba(233,155,99,0.3)] transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 tracking-wider" style={{ color: "#CAB87E" }}>⚡ Intermediate Level</h2>
            <ul className="space-y-4 text-gray-300">
              <li>
                <a href="https://www.youtube.com/watch?v=BuGUnvUSAZg" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-[#e99b63] hover:text-[#CAB87E] font-semibold hover:underline group">
                  • 25 Essential FSL Signs (Part 1)
                  <span className="ml-2 text-xs bg-[#e99b63]/20 px-2 py-1 rounded-full group-hover:bg-[#CAB87E]/30 transition">
                    15min
                  </span>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=yfxBeSeDY3c" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-[#e99b63] hover:text-[#CAB87E] font-semibold hover:underline group">
                  • FSL Basic Phrases
                  <span className="ml-2 text-xs bg-[#e99b63]/20 px-2 py-1 rounded-full group-hover:bg-[#CAB87E]/30 transition">
                    10min
                  </span>
                </a>
              </li>
              <li>
                <a href="https://data.mendeley.com/datasets/48y2y99mb9/2" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-[#e99b63] hover:text-[#CAB87E] font-semibold hover:underline">
                  • FSL-105 Dataset (2130 Videos)
                </a>
              </li>
              <li>
                <a href="https://kakamaymovement.com/videos" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center text-[#e99b63] hover:text-[#CAB87E] font-semibold hover:underline">
                  • Emotions & Daily Phrases
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* FSL Resources Table */}
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-6 tracking-wider text-[#e99b63] border-b border-[#e99b63]/30 pb-4">
            📚 Complete FSL Resource Library
          </h2>
          <p className="text-gray-300 mb-6">Free tutorials, datasets, and printable materials for all skill levels.</p>
          
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="w-full text-sm border-collapse border border-[#e99b63]/20 bg-black/50 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-[#e99b63]/20 via-[#CAB87E]/10 to-[#e99b63]/20">
                  <th className="p-4 text-left font-semibold text-[#e99b63] border-r border-[#e99b63]/20">Category</th>
                  <th className="p-4 text-left font-semibold text-[#e99b63] border-r border-[#e99b63]/20">Resource</th>
                  <th className="p-4 text-left font-semibold text-[#e99b63]">Link</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-[#e99b63]/10 transition-all duration-200 border-t border-[#e99b63]/10">
                  <td className="p-4 font-medium text-gray-200 border-r border-[#e99b63]/10">Alphabet</td>
                  <td className="p-4 text-gray-300">DEAFinitely Beautiful - FSL Alphabet</td>
                  <td className="p-4">
                    <a href="https://www.youtube.com/watch?v=IlxBht3wVGU" target="_blank" rel="noopener noreferrer" 
                       className="text-[#e99b63] hover:text-[#CAB87E] underline font-semibold flex items-center">
                      🎥 Watch →
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-[#e99b63]/10 transition-all duration-200 border-t border-[#e99b63]/10">
                  <td className="p-4 font-medium text-gray-200 border-r border-[#e99b63]/10">Alphabet</td>
                  <td className="p-4 text-gray-300">Olivia Aguila - FSL Alphabet</td>
                  <td className="p-4">
                    <a href="https://www.youtube.com/watch?v=jVLJ63NkRPs" target="_blank" rel="noopener noreferrer" 
                       className="text-[#e99b63] hover:text-[#CAB87E] underline font-semibold flex items-center">
                      🎥 Watch →
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-[#e99b63]/10 transition-all duration-200 border-t border-[#e99b63]/10">
                  <td className="p-4 font-medium text-gray-200 border-r border-[#e99b63]/10">Basics</td>
                  <td className="p-4 text-gray-300">Rai Zason - Basic FSL Tutorial</td>
                  <td className="p-4">
                    <a href="https://www.youtube.com/watch?v=36GlmDTYs6s" target="_blank" rel="noopener noreferrer" 
                       className="text-[#e99b63] hover:text-[#CAB87E] underline font-semibold flex items-center">
                      🎥 Watch →
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-[#e99b63]/10 transition-all duration-200 border-t border-[#e99b63]/10">
                  <td className="p-4 font-medium text-gray-200 border-r border-[#e99b63]/10">Greetings</td>
                  <td className="p-4 text-gray-300">Rai Zason - "How Are You?"</td>
                  <td className="p-4">
                    <a href="https://www.youtube.com/watch?v=2qCecWd88H4" target="_blank" rel="noopener noreferrer" 
                       className="text-[#e99b63] hover:text-[#CAB87E] underline font-semibold flex items-center">
                      🎥 Watch →
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-[#e99b63]/10 transition-all duration-200 border-t border-[#e99b63]/10">
                  <td className="p-4 font-medium text-gray-200 border-r border-[#e99b63]/10">Phrases</td>
                  <td className="p-4 text-gray-300">Olivia Aguila - Basic Phrases</td>
                  <td className="p-4">
                    <a href="https://www.youtube.com/watch?v=yfxBeSeDY3c" target="_blank" rel="noopener noreferrer" 
                       className="text-[#e99b63] hover:text-[#CAB87E] underline font-semibold flex items-center">
                      🎥 Watch →
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-[#e99b63]/10 transition-all duration-200 border-t border-[#e99b63]/10">
                  <td className="p-4 font-medium text-gray-200 border-r border-[#e99b63]/10">Dataset</td>
                  <td className="p-4 text-gray-300">FSL-105 (2130 Videos)</td>
                  <td className="p-4">
                    <a href="https://data.mendeley.com/datasets/48y2y99mb9/2" target="_blank" rel="noopener noreferrer" 
                       className="text-[#e99b63] hover:text-[#CAB87E] underline font-semibold flex items-center">
                      📥 Download
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Quick Practice Button */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/real-time-detection" className="bg-gradient-to-r from-[#e99b63] to-[#CAB87E] text-black font-bold py-4 px-8 rounded-xl hover:shadow-[0_0_25px_rgba(233,155,99,0.4)] transition-all duration-300 text-center">
              🚀 Practice Now with Real-Time Detection
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
