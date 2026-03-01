import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Calendar, Settings, Package, Leaf, Users, Clock, CheckCircle2, XCircle } from 'lucide-react';

const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
);

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({ specialization: '', licenseNumber: '' });
    const [toast, setToast] = useState('');
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apptsRes, profileRes] = await Promise.all([api.get('/appointments/doctor'), api.get('/doctors')]);
                setAppointments(apptsRes.data);
                const myProfile = profileRes.data.find(d => d.user._id === userInfo._id);
                if (myProfile) { setDoctorProfile(myProfile); setProfileData({ specialization: myProfile.specialization || '', licenseNumber: myProfile.licenseNumber || '' }); }
            } catch (error) { console.error('Error fetching data', error); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [userInfo._id]);

    const updateProfileHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/doctors', profileData);
            setDoctorProfile(data);
            setToast('Profile updated successfully!');
            setTimeout(() => setToast(''), 3000);
        } catch (error) { console.error(error); }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="relative h-14 w-14"><div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping"></div><div className="absolute inset-2 rounded-full border-4 border-t-blue-500 border-transparent animate-spin"></div></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading your console...</p>
        </div>
    );

    const upcomingAppointments = appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled');
    const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-[200] flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-200 animate-in slide-in-from-right">
                    <CheckCircle2 size={18} /> <span className="text-sm font-bold">{toast}</span>
                </div>
            )}

            {/* Hero Header */}
            <div className="relative rounded-[2.5rem] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_70%)]"></div>
                <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5 blur-2xl"></div>
                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-2 bg-white/20 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                            <Stethoscope size={10} /> Doctor Console
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Dr. <span className="text-blue-100">{userInfo?.name}</span>
                        </h1>
                        <p className="text-white/60 text-sm mt-1 font-medium">{doctorProfile?.specialization || 'Ayurvedic Physician'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:min-w-[240px]">
                        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                            <p className="text-3xl font-black text-white">{upcomingAppointments.length}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mt-1">Upcoming</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                            <p className="text-3xl font-black text-white">{pastAppointments.length}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mt-1">Completed</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Upcoming Queue */}
                    <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-gray-800 flex items-center gap-3">
                                <span className="h-8 w-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Calendar size={16} /></span>
                                Upcoming Queue
                            </h2>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm shadow-blue-200">
                                {upcomingAppointments.length} Active
                            </span>
                        </div>

                        {upcomingAppointments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/50">
                                <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 mb-4"><Clock size={28} /></div>
                                <p className="text-sm text-gray-400 font-semibold italic">No pending appointments in your queue</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {upcomingAppointments.map((appt) => (
                                    <div key={appt._id} className="group p-5 rounded-3xl border border-gray-100 bg-white shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-11 w-11 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-sm">
                                                        {appt.patient?.name?.charAt(0) || 'P'}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-black text-gray-900">{appt.patient?.name}</h3>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID: {appt.patient?._id?.substring(0, 6)}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                                    {appt.status}
                                                </span>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-2">
                                                <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                                                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500" /> Date</span>
                                                    <span className="text-gray-800">{new Date(appt.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                                                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-blue-500" /> Time</span>
                                                    <span className="text-gray-800">{appt.time}</span>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Chief Complaint</p>
                                                <p className="text-sm font-bold text-gray-700 line-clamp-2 italic">"{appt.reason}"</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/prescription/${appt._id}`)}
                                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md shadow-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                        >
                                            <Stethoscope size={14} /> Start Consultation
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Past History */}
                    {pastAppointments.length > 0 && (
                        <div className="bg-gray-50 rounded-3xl p-7 border border-gray-100">
                            <h2 className="text-sm font-black text-gray-400 mb-5 flex items-center gap-2 uppercase tracking-widest">
                                <HistoryIcon /> Recent History
                            </h2>
                            <div className="space-y-3">
                                {pastAppointments.map((appt) => (
                                    <div key={appt._id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between opacity-70 hover:opacity-100 transition-all shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${appt.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                                                {appt.status === 'completed' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-800">{appt.patient?.name}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(appt.date).toLocaleDateString()} · {appt.time}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => navigate(`/prescription/${appt._id}`)} className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors px-3">
                                            View
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="xl:col-span-1 space-y-5">
                    {/* Queue Status Card */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-7 text-white shadow-lg shadow-blue-200">
                        <div className="absolute -right-6 -top-6 opacity-10"><Users size={120} /></div>
                        <h3 className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-6">Queue Status</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <span className="text-6xl font-black leading-none">{upcomingAppointments.length}</span>
                            <span className="text-sm font-bold text-white/70 mb-2">Patients</span>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Ready for consultation</p>
                    </div>

                    {/* Profile Settings */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-9 w-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600"><Settings size={17} /></div>
                            <h2 className="text-base font-black text-gray-800">My Preferences</h2>
                        </div>
                        <form onSubmit={updateProfileHandler} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Specialization</label>
                                <input
                                    type="text" value={profileData.specialization}
                                    onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                                    className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 outline-none transition-all"
                                    placeholder="e.g. Ayurveda General"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Medical License</label>
                                <input
                                    type="text" value={profileData.licenseNumber}
                                    onChange={(e) => setProfileData({ ...profileData, licenseNumber: e.target.value })}
                                    className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 outline-none transition-all"
                                    placeholder="SLMC Number"
                                />
                            </div>
                            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-md shadow-amber-100 hover:scale-[1.02] transition-all">
                                Update Profile
                            </button>
                        </form>
                    </div>

                    {/* Clinical Tools */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Clinical Tools</span>
                        {[{ icon: Package, label: 'Formulae Reference', sub: 'Ayurvedic DB' }, { icon: Leaf, label: 'Herb Inventory', sub: 'Live Tracking' }].map(({ icon: Icon, label, sub }) => (
                            <button key={label} className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-2xl transition-all group">
                                <div className="h-9 w-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-all shadow-sm"><Icon size={17} /></div>
                                <div className="text-left">
                                    <p className="text-xs font-black text-gray-800 group-hover:text-blue-700 transition-colors">{label}</p>
                                    <p className="text-[10px] text-gray-400 font-bold">{sub}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
