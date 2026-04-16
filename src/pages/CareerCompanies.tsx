import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Globe, Users, ExternalLink, BookmarkPlus, Building2, Loader2, PlusCircle } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

export default function CareerCompanies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'companies'), where('status', '==', 'approved'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => 
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans pb-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Company Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Explore top companies hiring students and graduates.</p>
        </div>
        <Link 
          to="/company/register"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Partner with us
        </Link>
      </header>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search companies by name or industry..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Companies List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCompanies.map((company, i) => (
            <motion.div 
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all p-6 flex flex-col sm:flex-row gap-6 group"
            >
              <div className="w-20 h-20 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-3xl text-slate-400 dark:text-slate-500 overflow-hidden">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  company.name.charAt(0)
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {company.name}
                  </h3>
                  <button className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <BookmarkPlus className="h-5 w-5" />
                  </button>
                </div>
                
                <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-3">{company.industry}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{company.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  {company.website && (
                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <Globe className="h-4 w-4" /> Website
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredCompanies.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <Building2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No companies found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
}
