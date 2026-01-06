import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import RealTimeDetection from "./components/RealTimeDetection";
import Login from "./components/Login";
import Register from "./components/Register";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
import Tutorials from "./components/Tutorials";
import Quizzes from "./components/Quizzes";
import Progress from "./components/Progress";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true
    });
  }, []);

  return (
    <Router>
      <main>
        {/* Gradient image */}
        <img className="absolute top-0 right-0 opacity-60 -z-1" src="/gradient.png" alt="Gradient-img" />
        <div className="h-0 w-[40rem] absolute top-[20%] right-[-5%] shadow-[0_0_900px_20px_#e99b63] -rotate-[30deg]"></div>
        
        <Header />
        
        {/* Routes */}
       <Routes>
  <Route path="/" element={<Hero />} />
  <Route path="/real-time-detection" element={<RealTimeDetection />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route element={<RequireAuth />}>
    <Route path="/tutorials" element={<Tutorials />} />
    <Route path="/quizzes" element={<Quizzes />} />
    <Route path="/progress" element={<Progress />} />
  </Route>
</Routes>

      </main>
    </Router>
  );
}
