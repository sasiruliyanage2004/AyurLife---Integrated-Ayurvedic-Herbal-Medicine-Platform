import { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, Send, CheckCircle2, AlertCircle, User, Filter, Plus } from 'lucide-react';

const ForumPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAskForm, setShowAskForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ title: '', description: '', category: 'General' });
    const [answerContent, setAnswerContent] = useState({});
    const [toast, setToast] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const { data } = await api.get('/forum');
            setQuestions(data);
        } catch (error) {
            console.error('Error fetching questions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forum', newQuestion);
            setNewQuestion({ title: '', description: '', category: 'General' });
            setShowAskForm(false);
            fetchQuestions();
            setToast('Question posted successfully!');
            setTimeout(() => setToast(''), 3000);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAnswer = async (qId) => {
        if (!answerContent[qId]) return;
        try {
            await api.post(`/forum/${qId}/answer`, { content: answerContent[qId] });
            setAnswerContent({ ...answerContent, [qId]: '' });
            fetchQuestions();
            setToast('Answer submitted!');
            setTimeout(() => setToast(''), 3000);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="relative h-14 w-14">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-4 border-t-indigo-500 border-transparent animate-spin"></div>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Connecting to Community...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10 animate-in fade-in duration-500">
            {toast && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right">
                    <CheckCircle2 size={18} /> <span className="text-sm font-bold">{toast}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Community <span className="text-indigo-600">Forum</span></h1>
                    <p className="text-gray-500 font-medium">Ask questions and get verified answers from Ayurvedic experts.</p>
                </div>
                <button
                    onClick={() => setShowAskForm(!showAskForm)}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                >
                    <Plus size={16} /> {showAskForm ? 'Close Form' : 'Ask Question'}
                </button>
            </div>

            {showAskForm && (
                <form onSubmit={handleAskQuestion} className="bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subject</label>
                        <input
                            type="text"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                            placeholder="e.g., Natural remedy for insomnia?"
                            required
                            value={newQuestion.title}
                            onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Detailed Description</label>
                        <textarea
                            rows="4"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                            placeholder="Provide details about your query..."
                            required
                            value={newQuestion.description}
                            onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                        ></textarea>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all">
                        Post to Community
                    </button>
                </form>
            )}

            <div className="space-y-8">
                {questions.map(q => (
                    <div key={q._id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-8 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-full">{q.category}</span>
                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><User size={10} /> {q.askedBy?.name}</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight uppercase">{q.title}</h2>
                                    <p className="text-gray-500 font-medium leading-relaxed">{q.description}</p>
                                </div>
                                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${q.status === 'open' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                                    <MessageSquare size={18} />
                                </div>
                            </div>

                            {/* Answers Section */}
                            <div className="space-y-4 pt-6 border-t border-gray-50">
                                {q.answers.map((ans, idx) => (
                                    <div key={idx} className={`p-6 rounded-[2rem] ${ans.isVerified ? 'bg-indigo-50/50 border border-indigo-100' : 'bg-gray-50 border border-transparent'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 flex items-center gap-2">
                                                {ans.answeredBy?.name} {ans.isVerified && <CheckCircle2 size={12} className="text-indigo-600" />}
                                            </span>
                                            {ans.isVerified && <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter bg-white px-2 py-0.5 rounded-full border border-indigo-100">Verified Answer</span>}
                                        </div>
                                        <p className="text-sm font-medium text-gray-600 leading-relaxed">{ans.content}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Answer */}
                            <div className="flex gap-4 items-center">
                                <input
                                    type="text"
                                    placeholder="Write a helpful response..."
                                    className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400/20"
                                    value={answerContent[q._id] || ''}
                                    onChange={(e) => setAnswerContent({ ...answerContent, [q._id]: e.target.value })}
                                />
                                <button
                                    onClick={() => handleAnswer(q._id)}
                                    className="bg-indigo-600 text-white h-11 w-11 rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all active:scale-90 shadow-lg shadow-indigo-100"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForumPage;
