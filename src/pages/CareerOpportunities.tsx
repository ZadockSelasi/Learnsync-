import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, Building2, Filter, BookmarkPlus, ExternalLink, Loader2 } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

export default function CareerOpportunities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), where('status', '==', 'Open'));
      const snapshot = await getDocs(q);
      const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOpportunities(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpps = opportunities.filter(opp => {
    const title = opp.title || '';
    const company = opp.company || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || opp.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 font-sans pb-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Opportunity Hub</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Discover internships, graduate roles, and national service placements.</p>
      </header>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by role, company..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Graduate Program'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === type 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
          <button className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
            <Filter className="h-4 w-4" /> More Filters
          </button>
        </div>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOpps.map((opp, i) => (
            <Link to={`/career/job/${opp.id}`} key={opp.id}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all flex flex-col h-full overflow-hidden group cursor-pointer"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xl text-slate-500 dark:text-slate-400">
                      {opp.company?.charAt(0) || 'C'}
                    </div>
                    <button className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" onClick={(e) => { e.preventDefault(); /* Save Job Logic */ }}>
                      <BookmarkPlus className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {opp.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium mb-4 flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> {opp.company}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="h-4 w-4 mr-2" /> {opp.location} ({opp.workplace})
                    </div>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <Briefcase className="h-4 w-4 mr-2" /> {opp.type}
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {opp.postedAt ? new Date(opp.postedAt).toLocaleDateString() : 'Recently'}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                      View Details <ExternalLink className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
      
      {!loading && filteredOpps.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <Search className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No opportunities found</h3>
          <p className="text-slate-500 dark:text-slate-400">Check back later for new postings.</p>
        </div>
      )}
    </div>
  );
}
