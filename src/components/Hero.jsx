import { GiMagnifyingGlass } from 'react-icons/gi';
import { FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';
import Spline from '@splinetool/react-spline';
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <main className="flex lg:mt-20 flex-col lg:flex-row items-center justify-between min-h-[calc(90vh-6rem)]">
      <div className="max-w-xl ml-[5%] z-10 mt-[90%] md:mt-[60%] lg:mt-0">
        {/* Real-Time Detection Badge/Button */}
        <div className="relative w-auto inline-flex h-12 bg-gradient-to-r from-gray-600 via-[#e99b63] to-gray-600 shadow-[0_0_15px_rgba(233,155,99,0.5),0_0_30px_rgba(233,155,99,0.3),0_0_45px_rgba(233,155,99,0.1)] rounded-full p-[2.5px] hover:shadow-[0_0_20px_rgba(233,155,99,0.7),0_0_40px_rgba(233,155,99,0.4),0_0_60px_rgba(233,155,99,0.2)] transition-all duration-500 mb-6">
          <div className="relative inset-0 bg-black rounded-full flex items-center justify-center gap-3 px-7 py-2.5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e99b63]/10 to-transparent rounded-full"></div>
            <GiMagnifyingGlass className="relative text-[#e99b63] text-xl drop-shadow-[0_0_12px_rgba(233,155,99,1)] animate-pulse" />
            <span className="relative text-white text-sm font-semibold tracking-[0.2em] uppercase">
              Real-time Detection
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wider my-8">
          Break Barriers,
          <br />
          Connect Through Signs
        </h1>

        <p className="text-base sm:text-lg tracking-wider text-gray-400 max-w-[25rem] lg:max-w-[30rem] mb-10">
          Learn sign language with real-time AI detection. Practice anywhere, get instant feedback, master communication, and connect confidently. Start free today
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Primary Button - Start Learning */}
          <Link 
            to="/tutorials"
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#e99b63] to-[#d88952] px-8 py-4 rounded-full text-base font-semibold tracking-wider text-white shadow-[0_0_20px_rgba(233,155,99,0.4)] hover:shadow-[0_0_30px_rgba(233,155,99,0.6)] hover:scale-105 transition-all duration-300"
          >
            <span>Start Learning</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          {/* Secondary Button - Use WeSign */}
          <Link 
            to="/real-time-detection"
            className="group relative inline-flex items-center justify-center gap-3 bg-transparent border-2 border-[#2a2a2a] px-8 py-4 rounded-full text-base font-semibold tracking-wider text-white hover:border-[#e99b63] hover:bg-[#e99b63]/10 hover:shadow-[0_0_20px_rgba(233,155,99,0.2)] transition-all duration-300"
          >
            <span>Use WeSign</span>
            <FaExternalLinkAlt className="text-sm group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
          </Link>
        </div>
      </div>
      <Spline 
        className='absolute lg:top-0 top-[-20%] bottom-0 lg:left-[25%] sm:left-[-2%] h-full'
        scene="https://prod.spline.design/ZTnmgvkJYdhQGsIj/scene.splinecode"
      />
    </main>
  );
};

export default Hero;
