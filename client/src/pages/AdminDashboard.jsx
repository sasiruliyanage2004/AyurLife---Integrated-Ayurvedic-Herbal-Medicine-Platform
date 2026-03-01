import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Trash2, UserCheck, Shield, Users, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const roles = ['patient', 'doctor', 'supplier', 'producer', 'wellness_staff', 'admin'];

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try { const { data } = await api.get('/admin/users'); setUsers(data); }
        catch (error) { console.error('Error fetching users', error); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try { await api.delete(`/admin/users/${id}`); setUsers(users.filter(u => u._id !== id)); }
        catch (error) { console.error('Error deleting user', error); }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await api.put(`/admin/users/${id}/verify`, { role: newRole });
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
            setToast('User role updated!');
            setTimeout(() => setToast(''), 3000);
        } catch (error) { console.error(error); }
    };

    const roleColor = {
        admin: 'bg-violet-100 text-violet-700',
        doctor: 'bg-emerald-100 text-emerald-700',
        wellness_staff: 'bg-amber-100 text-amber-700',
        supplier: 'bg-orange-100 text-orange-700',
        producer: 'bg-teal-100 text-teal-700',
        patient: 'bg-blue-100 text-blue-700',
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="relative h-14 w-14"><div className="absolute inset-0 rounded-full border-4 border-violet-100 animate-ping"></div><div className="absolute inset-2 rounded-full border-4 border-t-violet-500 border-transparent animate-spin"></div></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading admin panel...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-[200] flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-200 animate-in slide-in-from-right">
                    <CheckCircle2 size={18} /> <span className="text-sm font-bold">{toast}</span>
                </div>
            )}

            {/* Hero */}
            <div className="relative rounded-[2.5rem] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_70%)]"></div>
                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-2 bg-white/20 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3"><Shield size={10} /> Admin Console</span>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">User Administration</h1>
                        <p className="text-white/60 text-sm mt-1 font-medium">Managing AyurLife ecosystem access</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 md:min-w-[300px]">
                        {[
                            { label: 'Total Users', value: users.length, color: 'bg-white/15' },
                            { label: 'Doctors', value: users.filter(u => u.role === 'doctor').length, color: 'bg-white/15' },
                            { label: 'Patients', value: users.filter(u => u.role === 'patient').length, color: 'bg-white/15' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className={`${color} backdrop-blur-sm border border-white/20 rounded-2xl p-3 text-center`}>
                                <p className="text-2xl font-black text-white">{value}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-7 border-b border-gray-100">
                    <h2 className="text-lg font-black text-gray-800 flex items-center gap-3">
                        <span className="h-8 w-8 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center"><UserCheck size={16} /></span>
                        User Authority Management
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                {['User Profile', 'Contact Email', 'Access Role', 'Actions'].map((col, i) => (
                                    <th key={col} className={`px-7 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest ${i === 3 ? 'text-right' : 'text-left'}`}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-violet-50/40 transition-colors group">
                                    <td className="px-7 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${roleColor[user.role] || 'bg-gray-100 text-gray-600'}`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-black text-gray-800">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-7 py-5 text-sm font-bold text-gray-500">{user.email}</td>
                                    <td className="px-7 py-5">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-[10px] font-black uppercase tracking-widest text-gray-700 focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 outline-none transition-all cursor-pointer disabled:opacity-50"
                                            disabled={user._id === userInfo._id}
                                        >
                                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-7 py-5 text-right">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90 disabled:opacity-30"
                                            disabled={user._id === userInfo._id}
                                            title="Remove User"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
