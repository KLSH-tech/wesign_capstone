export default function Quizzes() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-black text-white">
      <div className="w-full max-w-3xl mt-16 rounded-2xl shadow-lg bg-gradient-to-br from-black via-[#e99b63]/10 to-[#232323] p-8 border-2 border-[#e99b63]/40">
        <h1 className="text-4xl font-semibold text-[#e99b63] mb-6 tracking-wider">Quizzes</h1>
        <p className="text-lg text-gray-200 mb-8">
          Challenge your progress with interactive quizzes designed for sign language mastery. Instantly know your strengths and areas to improve.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black rounded-xl border border-[#e99b63]/30 p-6 shadow">
            <h2 className="text-xl font-semibold mb-2" style={{ color: "#CAB87E" }}>Beginner Quiz</h2>
            <p className="text-gray-400">Test your understanding of basic signs and handforms.</p>
          </div>
          <div className="bg-black rounded-xl border border-[#e99b63]/30 p-6 shadow">
            <h2 className="text-xl font-semibold mb-2" style={{ color: "#CAB87E" }}>Communication Skills</h2>
            <p className="text-gray-400">Quiz yourself on phrases, questions, and conversational responses.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
