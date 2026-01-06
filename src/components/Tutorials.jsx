export default function Tutorials() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-black text-white">
      <div className="w-full max-w-3xl mt-16 rounded-2xl shadow-lg bg-gradient-to-br from-[#232323] via-black to-[#e99b63]/30 p-8 border-2 border-[#e99b63]/40">
        <h1 className="text-4xl font-semibold text-[#e99b63] mb-6 tracking-wider">Tutorials</h1>
        <p className="text-lg text-gray-200 mb-8">
          Explore curated sign language lessons, ranging from beginner to advanced. Each tutorial features guided videos, step-by-step practice, and real-time feedback.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black bg-opacity-60 rounded-xl border border-[#e99b63]/30 p-6 shadow">
            <h2 className="text-2xl font-semibold mb-4 tracking-wider" style={{ color: "#CAB87E" }}>Getting Started</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>Basics of sign language</li>
              <li>Hand/shapes and positioning</li>
            </ul>
          </div>
          <div className="bg-black bg-opacity-60 rounded-xl border border-[#e99b63]/30 p-6 shadow">
            <h2 className="text-2xl font-semibold mb-4 tracking-wider" style={{ color: "#CAB87E" }}>Intermediate</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>Common phrases & conversation</li>
              <li>Practice exercises</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
