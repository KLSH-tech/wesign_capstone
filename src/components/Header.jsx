import { Link, useNavigate } from "react-router-dom";
import { RiMenu5Fill } from "react-icons/ri";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center py-4 px-4 lg:px-20">
      <Link to="/" className="text-3xl md:text-4xl lg:text-5xl font-light transition-colors hover:text-gray-300 cursor-pointer">
        WeSign
      </Link>
      <nav className="hidden md:flex items-center gap-12">
        <Link className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" to="/real-time-detection">REAL-TIME DETECTION</Link>
        <Link className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" to="/tutorials">TUTORIALS</Link>
        <Link className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" to="/quizzes">QUIZZES</Link>
        <Link className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" to="/progress">TRACK PROGRESS</Link>
      </nav>
      {!token ? (
        <Link to="/login" className="hidden md:block bg-[#a7a7a7] text-black py-3 px-8 rounded-full border-none font-medium transition-all duration-500 hover:bg-white cursor-pointer z-50">
          Sign IN
        </Link>
      ) : (
        <button
          onClick={handleLogout}
          className="hidden md:block bg-gradient-to-r from-[#e99b63] to-[#c7a247] text-black py-3 px-8 rounded-full border-none font-medium transition-all duration-500 hover:bg-black hover:text-[#e99b63] cursor-pointer z-50"
        >
          Log Out
        </button>
      )}
      <button onClick={toggleMobileMenu} className="md:hidden text-3xl p-2 z-50">
        <RiMenu5Fill />
      </button>
      {mobileMenuOpen && (
        <div id="mobileMenu" className="fixed top-16 bottom-0 right-0 left-0 p-5 md:hidden z-40 bg-black bg-opacity-65 backdrop-blur-md">
          <nav className="flex flex-col gap-6 items-center">
            <Link className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" onClick={toggleMobileMenu} to="/real-time-detection">REAL-TIME DETECTION</Link>
            <Link className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" onClick={toggleMobileMenu} to="/tutorials">TUTORIALS</Link>
            <Link className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" onClick={toggleMobileMenu} to="/quizzes">QUIZZES</Link>
            <Link className="text-base tracking-wider transition-colors hover:text-gray-300 z-50" onClick={toggleMobileMenu} to="/progress">TRACK PROGRESS</Link>
            {!token ? (
              <Link to="/login" className="bg-[#e99b63] text-black px-4 py-2 rounded-full font-semibold mt-4" onClick={toggleMobileMenu}>
                Sign In
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                className="bg-[#e99b63] text-black px-4 py-2 rounded-full font-semibold mt-4"
              >
                Log Out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
