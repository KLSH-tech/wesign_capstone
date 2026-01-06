import { useState } from "react";
import { Link } from "react-router-dom";
import Spline from '@splinetool/react-spline';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    // Only one function!
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (data.user.role === 'admin') {
                    window.location.href = '/admin/dashboard';
                } else {
                    window.location.href = '/dashboard';
                }
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Connection error');
        }
    };

    return (
        <div className="flex h-screen w-full bg-black text-white relative overflow-hidden">
            {/* Left Side - Spline */}
            <div className="w-full hidden md:flex items-center justify-center bg-black relative animate-slideInFromRight">
                <Spline 
                    className='absolute inset-0 w-full h-full pointer-events-none'
                    scene="https://prod.spline.design/ZTnmgvkJYdhQGsIj/scene.splinecode"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/50 pointer-events-none"></div>
            </div>
            {/* Right Side - Login Form */}
            <div className="w-full flex flex-col items-center justify-center px-6 bg-black z-10 relative animate-slideInFromLeft">
                <form onSubmit={handleSubmit} className="md:w-96 w-80 flex flex-col items-center justify-center">
                    <h2 className="text-4xl font-medium">Sign In</h2>
                    <p className="text-sm text-gray-400 mt-3">Welcome back! Please sign in to continue</p>
                    {/* Email Input */}
                    <div className="flex items-center mt-8 w-full bg-transparent border border-gray-600 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-gray-400 transition-colors">
                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#9CA3AF"/>
                        </svg>
                        <input 
                            type="email" 
                            placeholder="Email address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent text-white placeholder-gray-500 outline-none text-sm w-full h-full pr-6" 
                            required 
                        />                 
                    </div>
                    {/* Password Input */}
                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-600 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-gray-400 transition-colors">
                        <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#9CA3AF"/>
                        </svg>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent text-white placeholder-gray-500 outline-none text-sm w-full h-full pr-6" 
                            required 
                        />
                    </div>
                    {/* Remember Me & Forgot Password */}
                    <div className="w-full flex items-center justify-between mt-8 text-gray-400">
                        <div className="flex items-center gap-2">
                            <input 
                                className="h-4 w-4 cursor-pointer accent-[#e99b63]" 
                                type="checkbox" 
                                id="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label className="text-sm cursor-pointer" htmlFor="checkbox">Remember me</label>
                        </div>
                        <Link to="/forgot-password" className="text-sm hover:text-[#e99b63] transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                    {/* Login Button */}
                    <button 
                        type="submit" 
                        className="mt-8 w-full h-11 rounded-full text-black font-medium bg-[#a7a7a7] hover:bg-white transition-all duration-300"
                    >
                        Login
                    </button>
                    {/* Sign Up Link */}
                    <p className="text-gray-400 text-sm mt-4">
                        Don't have an account? {" "}
                        <Link to="/register" className="text-[#e99b63] hover:text-[#d88952] hover:underline transition-colors">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
