export default function Progress() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-black text-white">
      <div className="w-full max-w-2xl mt-16 rounded-2xl shadow-lg bg-gradient-to-br from-[#232323] via-black to-[#e99b63]/30 p-8 border-2 border-[#e99b63]/40">
        <h1 className="text-4xl font-semibold text-[#e99b63] mb-6 tracking-wider">Track Progress</h1>
        <p className="text-lg text-gray-200 mb-8">
          See your learning journey in real-time, milestones achieved, completed tutorials, and quiz scores.
        </p>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-black rounded-xl border border-[#e99b63]/30 p-6 shadow">
            <h2 className="text-xl font-semibold mb-2" style={{ color: "#CAB87E" }}>Your Milestones</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>0 tutorials completed</li>
              <li>0 quizzes taken</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
    