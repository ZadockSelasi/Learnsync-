import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Briefcase, Plus, Search, MoreVertical, Trash2, Edit, Loader2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-time');
  const [workplace, setWorkplace] = useState('On-site');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Open');

  // Applications State
  const [viewingJob, setViewingJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'jobs'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (job?: any) => {
    if (job) {
      setCurrentJob(job);
      setTitle(job.title || '');
      setCompany(job.company || '');
      setLocation(job.location || '');
      setType(job.type || 'Full-time');
      setWorkplace(job.workplace || 'On-site');
      setSalary(job.salary || '');
      setExperience(job.experience || '');
      setDescription(job.description || '');
      setStatus(job.status || 'Open');
    } else {
      setCurrentJob(null);
      setTitle('');
      setCompany('');
      setLocation('');
      setType('Full-time');
      setWorkplace('On-site');
      setSalary('');
      setExperience('');
      setDescription('');
      setStatus('Open');
    }
    setIsModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobData = {
      title,
      company,
      location,
      type,
      workplace,
      salary,
      experience,
      description,
      status,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (currentJob) {
        await updateDoc(doc(db, 'jobs', currentJob.id), jobData);
      } else {
        await addDoc(collection(db, 'jobs'), {
          ...jobData,
          postedAt: new Date().toISOString(),
        });
      }
      setIsModalOpen(false);
      fetchJobs();
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteDoc(doc(db, 'jobs', jobId));
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const handleViewApplicants = async (job: any) => {
    setViewingJob(job);
    setLoadingApps(true);
    try {
      const q = query(collection(db, 'jobApplications'), where('jobId', '==', job.id));
      const snapshot = await getDocs(q);
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoadingApps(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Jobs Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage job postings and applications.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </button>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Job Title</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No jobs found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{job.title}</div>
                      <div className="text-xs text-slate-500">{job.location}</div>
                    </td>
                    <td className="px-6 py-4">{job.company}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {job.type} • {job.workplace}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'Open' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleViewApplicants(job)} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors" title="View Applicants">
                          <Users className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenModal(job)} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors" title="Edit Job">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteJob(job.id)} className="p-1 text-slate-400 hover:text-rose-600 transition-colors" title="Delete Job">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-200 dark:border-white/5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentJob ? 'Edit Job' : 'Post New Job'}
                </h3>
              </div>
              <div className="p-6 overflow-y-auto">
                <form id="job-form" onSubmit={handleSaveJob} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                      <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
                      <input type="text" required value={company} onChange={e => setCompany(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                      <input type="text" required value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Employment Type</label>
                      <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Graduate Program">Graduate Program</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Workplace Type</label>
                      <select value={workplace} onChange={e => setWorkplace(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                      <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Salary Range (Optional)</label>
                      <input type="text" placeholder="e.g. $50k - $70k" value={salary} onChange={e => setSalary(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Experience Level</label>
                      <input type="text" placeholder="e.g. 2+ years" value={experience} onChange={e => setExperience(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description & Requirements</label>
                    <textarea required rows={6} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter full job description, responsibilities, and requirements..." />
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-slate-200 dark:border-white/5 flex justify-end gap-3 bg-slate-50 dark:bg-[#0B0F19]">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" form="job-form" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">
                  {currentJob ? 'Save Changes' : 'Post Job'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Applicants Modal */}
      <AnimatePresence>
        {viewingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setViewingJob(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#111827] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-[#0B0F19]">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Applicants for {viewingJob.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{viewingJob.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-sm font-medium">
                    {applications.length} Total
                  </span>
                </div>
              </div>
              <div className="p-0 overflow-y-auto flex-1">
                {loadingApps ? (
                  <div className="flex justify-center items-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                    No applications received yet for this role.
                  </div>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 sticky top-0">
                      <tr>
                        <th className="px-6 py-4 font-medium">Applicant</th>
                        <th className="px-6 py-4 font-medium">Contact</th>
                        <th className="px-6 py-4 font-medium">Applied</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Links</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                            {app.applicantDetails?.name}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">{app.applicantDetails?.email}</div>
                            <div className="text-xs text-slate-500">{app.applicantDetails?.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              {app.applicantDetails?.linkedinUrl && (
                                <a href={app.applicantDetails.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">LinkedIn</a>
                              )}
                              {app.resumeUrl && (
                                <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">Resume</a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="p-4 border-t border-slate-200 dark:border-white/5 flex justify-end bg-slate-50 dark:bg-[#0B0F19]">
                <button onClick={() => setViewingJob(null)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
