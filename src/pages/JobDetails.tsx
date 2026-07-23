import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, Building2, Calendar, DollarSign, ChevronLeft, Send, UploadCloud, Linkedin, Loader2, CheckCircle2 } from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // Application Form
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'jobs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Handle job not found
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !job) return;
    
    setIsApplying(true);
    try {
      await addDoc(collection(db, 'jobApplications'), {
        jobId: job.id,
        userId: user.uid,
        applicantDetails: {
          name,
          email,
          phone,
          linkedinUrl,
          portfolioUrl
        },
        resumeUrl, // In a real app, this would be an actual file uploaded to Storage
        coverLetter,
        status: 'Applied',
        appliedAt: new Date().toISOString()
      });
      setApplySuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setApplySuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error applying for job:", error);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Job not found</h2>
        <button onClick={() => navigate('/career/opportunities')} className="mt-4 text-indigo-600 hover:underline">Back to Opportunities</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 font-sans">
      <Link to="/career/opportunities" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Jobs
      </Link>

      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Building2 className="w-64 h-64" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-bold">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{job.title}</h1>
                  <p className="text-indigo-100 mt-1 text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5" /> {job.company}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium">
                  <MapPin className="w-4 h-4" /> {job.location} ({job.workplace})
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium">
                  <Briefcase className="w-4 h-4" /> {job.type}
                </span>
                {job.salary && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium">
                    <DollarSign className="w-4 h-4" /> {job.salary}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              <button 
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full sm:w-auto px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                Apply Now <Send className="w-4 h-4" />
              </button>
              <p className="text-indigo-100 text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Posted {new Date(job.postedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12">
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400">
            <h3>About the Role</h3>
            <div className="whitespace-pre-wrap text-slate-600 dark:text-slate-300">
              {job.description}
            </div>
          </div>
          
          {job.experience && (
            <div className="mt-8 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-slate-400" /> Required Experience
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">{job.experience}</p>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => !isApplying && !applySuccess && setIsApplyModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {applySuccess ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Submitted!</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    Your application for {job.title} at {job.company} has been received successfully.
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submit Application</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{job.title} at {job.company}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* LinkedIn Quick Apply Mock */}
                    <div className="mb-8 p-5 bg-[#0077b5]/5 border border-[#0077b5]/20 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between">
                      <div>
                        <h4 className="font-bold text-[#0077b5] flex items-center gap-2">
                          <Linkedin className="w-5 h-5" /> Easy Apply with LinkedIn
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Import your profile data automatically. (Requires Configuration)
                        </p>
                      </div>
                      <button type="button" disabled className="px-5 py-2.5 bg-[#0077b5] text-white font-medium rounded-xl hover:bg-[#006396] transition-colors whitespace-nowrap opacity-50 cursor-not-allowed">
                        Apply with LinkedIn
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
                      <span className="text-sm font-medium text-slate-400">OR APPLY MANUALLY</span>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
                    </div>

                    <form id="apply-form" onSubmit={handleApply} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                          <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address *</label>
                          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number *</label>
                          <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">LinkedIn Profile URL</label>
                          <input type="url" placeholder="https://linkedin.com/in/..." value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Resume / CV Link *</label>
                        <div className="relative">
                          <UploadCloud className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type="url" required placeholder="Link to Google Drive, Dropbox, or Portfolio..." value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Please provide a public link to your resume document.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Cover Letter</label>
                        <textarea rows={4} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Why are you a good fit for this role?" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </form>
                  </div>

                  <div className="p-6 border-t border-slate-200 dark:border-white/5 flex justify-end gap-3 bg-slate-50/50 dark:bg-white/[0.02]">
                    <button type="button" onClick={() => setIsApplyModalOpen(false)} className="px-6 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      form="apply-form" 
                      disabled={isApplying}
                      className="px-8 py-2.5 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors shadow-md disabled:opacity-70 flex items-center justify-center gap-2 min-w-[140px]"
                    >
                      {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Application'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
