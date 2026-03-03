import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, BookOpen, Leaf, Clover, ChevronRight, User } from 'lucide-react';

const KnowledgeBase = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const { data } = await api.get('/knowledge');
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'Remedies', 'Plants', 'General'];

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="relative h-14 w-14">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-4 border-t-emerald-500 border-transparent animate-spin"></div>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Wisdom...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Ancient Wisdom, <span className="text-emerald-600">Verified.</span></h1>
                <p className="text-gray-500 max-w-2xl mx-auto font-medium">Explore our curated repository of Ayurvedic home remedies and medicinal plants, verified by licensed practitioners.</p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search remedies, plants..."
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-gray-400 border border-gray-100 hover:border-emerald-200 hover:text-emerald-600'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.length === 0 ? (
                    <div className="col-span-full py-20 text-center space-y-4 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <BookOpen size={24} />
                        </div>
                        <p className="text-gray-400 font-bold">No articles found matching your criteria</p>
                    </div>
                ) : (
                    filteredArticles.map(article => (
                        <div key={article._id} className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 flex flex-col">
                            <div className="relative h-48 bg-emerald-50 flex items-center justify-center transition-colors group-hover:bg-emerald-100/50">
                                {article.category === 'Plants' ? <Leaf size={48} className="text-emerald-500" /> : <Clover size={48} className="text-emerald-500" />}
                                <div className="absolute top-6 left-6 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm border border-emerald-100">
                                    {article.category}
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col space-y-4">
                                <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{article.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-3 font-medium flex-1">
                                    {article.content}
                                </p>
                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                            <User size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">Dr. {article.author?.user?.name || 'Practitioner'}</span>
                                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Verified Expert</span>
                                        </div>
                                    </div>
                                    <button className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-45">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default KnowledgeBase;
