import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Leaf, ArrowRight } from 'lucide-react';
import api from '../services/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [usedEmails, setUsedEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('usedEmails') || '[]');
        setUsedEmails(history);
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) navigate('/dashboard');
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/users/login', { email, password });
            const history = JSON.parse(localStorage.getItem('usedEmails') || '[]');
            if (!history.includes(email)) { history.push(email); localStorage.setItem('usedEmails', JSON.stringify(history)); }
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.15),_transparent_60%)]"></div>
                <div className="absolute top-16 right-16 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
                <div className="absolute bottom-24 left-12 h-48 w-48 rounded-full bg-teal-300/20 blur-2xl"></div>
                <div className="relative z-10 flex flex-col justify-center px-16 py-20 text-white">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <span className="text-2xl">🌿</span>
                        </div>
                        <span className="text-2xl font-black tracking-tight">AyurLife</span>
                    </div>
                    <h1 className="text-5xl font-black leading-tight mb-6">
                        Your Wellness<br />Journey Starts<br />
                        <span className="text-emerald-100">Here</span>
                    </h1>
                    <p className="text-white/70 text-lg font-medium leading-relaxed max-w-sm">
                        Ancient Ayurvedic wisdom meets modern healthcare technology.
                    </p>
                    <div className="mt-12 grid grid-cols-3 gap-4">
                        {[['🏥', 'Doctors'], ['🌿', 'Herbs'], ['💆', 'Wellness']].map(([emoji, label]) => (
                            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                                <div className="text-2xl mb-1">{emoji}</div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/70">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🌿</span>
                        </div>
                        <span className="text-xl font-black text-gray-800">AyurLife</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back</h2>
                        <p className="text-gray-400 font-medium mt-2">Sign in to your AyurLife account</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-5">
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                list="email-suggestions"
                                required
                                className="block w-full px-5 py-3.5 bg-white border border-gray-200 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all placeholder:text-gray-300 text-sm font-medium shadow-sm"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <datalist id="email-suggestions">
                                {usedEmails.map((savedEmail, i) => <option key={i} value={savedEmail} />)}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full px-5 pr-12 py-3.5 bg-white border border-gray-200 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all placeholder:text-gray-300 text-sm font-medium shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="button" className="absolute inset-y-0 right-4 flex items-center text-gray-300 hover:text-emerald-500 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
                                <span className="text-red-400">⚠</span> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-black rounded-2xl shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100"
                        >
                            {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><span>Sign In</span><ArrowRight size={16} /></>}
                        </button>

                        <p className="text-sm text-center text-gray-400 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-emerald-600 font-black hover:text-emerald-500 transition-colors">Create one</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
