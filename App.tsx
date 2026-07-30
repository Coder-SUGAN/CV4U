import React, { useState, useCallback, useEffect } from 'react';
import { CVData, Template, FontFamily, User } from './types';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import { downloadCvAsPdf, downloadCvAsDocx } from './services/pdfService';
import { parseResumePdf } from './services/geminiService';
import { AuthModal } from './components/AuthModal';
import { WelcomeModal } from './components/WelcomeModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Logo } from './components/Logo';
import { 
  LogIn, 
  LogOut, 
  FileSpreadsheet, 
  Upload, 
  Sparkles, 
  User as UserIcon, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Lock,
  Mail,
  ShieldCheck
} from 'lucide-react';

const initialCVData: CVData = {
  personalDetails: {
    fullName: 'Samantha Williams',
    jobTitle: 'Senior Analyst',
    email: 'samantha.williams@example.com',
    phone: '(555) 789-1234',
    address: 'New York, NY, 10001',
    linkedin: 'linkedin.com/in/samanthawilliams',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
  },
  summary: 'Senior Analyst with 5+ years of experience in data analysis, business intelligence, and process optimization. Skilled in driving operational efficiency, forecasting, and leading data-driven strategies to support business decisions and improvements. Strong communicator focused on results.',
  experience: [
    {
      id: crypto.randomUUID(),
      jobTitle: 'Senior Analyst',
      company: 'Loom & Lantern Co.',
      startDate: '2021-07',
      endDate: 'Present',
      description: '• Spearhead data analysis and reporting for key business functions, identifying trends and providing insights to improve company performance and profitability.\n• Conduct in-depth market analysis and competitive benchmarking to inform strategic decisions, resulting in a 15% increase in market share within one year.\n• Develop predictive models to forecast sales performance and customer behavior, contributing to more accurate budgeting and resource allocation.',
    },
    {
      id: crypto.randomUUID(),
      jobTitle: 'Business Analyst',
      company: 'Willow & Wren Ltd.',
      startDate: '2017-08',
      endDate: '2021-05',
      description: '• Analyzed and interpreted large datasets to identify business opportunities and recommend process improvements, leading to a 20% reduction in operational costs.\n• Created detailed financial models and dashboards to track key performance indicators (KPIs), enabling data-driven decision-making across departments.\n• Worked closely with project managers to monitor progress on major initiatives, ensuring projects were delivered on time and within budget.',
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      degree: 'Bachelor of Science in Economics',
      school: 'New York University',
      startDate: '2013',
      endDate: '2017',
    },
  ],
  skills: 'Project Management, Data-driven Decision Making, SQL & Excel, Financial Analysis, Business Intelligence tools, Statistical Modeling',
  languages: [
    { id: crypto.randomUUID(), name: 'English', proficiency: 'Native' },
    { id: crypto.randomUUID(), name: 'Spanish', proficiency: 'Professional Working Proficiency' },
  ],
  customSections: [],
  accentColor: '#d2b48c', // A tan color as default for creative template
};

const colorOptions = [
    { name: 'Tan', color: '#d2b48c' },
    { name: 'Teal', color: '#008080' },
    { name: 'Green', color: '#90EE90' },
    { name: 'Blue', color: '#4682B4' },
    { name: 'Gray', color: '#808080' },
];

const App: React.FC = () => {
  const [cvData, setCvData] = useState<CVData>(initialCVData);
  const [template, setTemplate] = useState<Template>('creative');
  const [font, setFont] = useState<FontFamily>('merriweather');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);

  // Authentication & Management States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showLoginsPanel, setShowLoginsPanel] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pendingDownloadType, setPendingDownloadType] = useState<'pdf' | 'docx' | null>(null);

  // PDF Parser States
  const [isParsingPdf, setIsParsingPdf] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Trigger toast helper
  const triggerToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Sync users with localStorage on mount
  useEffect(() => {
    const adminAccount: User = {
      id: 'admin_suganth',
      fullName: 'Suganth (Administrator)',
      email: 'suganthasuga405@gmail.com',
      password: 'CV4U@suga',
      createdAt: 'Jul 28, 2026'
    };

    const savedUsersStr = localStorage.getItem('cv4u_users');
    let loadedUsers: User[] = [];
    if (savedUsersStr) {
      try {
        loadedUsers = JSON.parse(savedUsersStr);
      } catch (e) {
        loadedUsers = [];
      }
    }

    // Ensure admin user is seeded into the database
    const hasAdmin = loadedUsers.some(u => 
      u.email.toLowerCase() === 'suganthasuga405@gmail.com' || 
      u.email.toLowerCase() === 'suganthansuga405@gmail.com'
    );
    if (!hasAdmin) {
      loadedUsers.unshift(adminAccount);
      localStorage.setItem('cv4u_users', JSON.stringify(loadedUsers));
    }
    setRegisteredUsers(loadedUsers);

    const activeUser = localStorage.getItem('cv4u_current_user');
    if (activeUser) {
      try {
        setCurrentUser(JSON.parse(activeUser));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleOpenAdminDashboard = () => {
    const adminEmails = ['suganthasuga405@gmail.com', 'suganthansuga405@gmail.com'];
    if (currentUser && adminEmails.includes(currentUser.email.toLowerCase())) {
      setShowLoginsPanel(true);
    } else {
      setShowAdminLoginModal(true);
    }
  };

  const handleDataChange = useCallback(<K extends keyof CVData>(section: K, data: CVData[K]) => {
    setCvData(prev => ({
      ...prev,
      [section]: data,
    }));
  }, []);
  
  const handleDownloadPdf = async () => {
    if (!currentUser) {
      setPendingDownloadType('pdf');
      setShowAuthModal(true);
      triggerToast('🔒 Login or Sign Up required to download your resume as PDF.', 'error');
      return;
    }
    setIsDownloading(true);
    await downloadCvAsPdf('cv-preview', `${cvData.personalDetails.fullName.replace(/\s/g, '_')}_CV`);
    setIsDownloading(false);
  };

  const handleDownloadDocx = async () => {
    if (!currentUser) {
      setPendingDownloadType('docx');
      setShowAuthModal(true);
      triggerToast('🔒 Login or Sign Up required to download your resume as Word.', 'error');
      return;
    }
    setIsDownloadingDocx(true);
    await downloadCvAsDocx('cv-preview', `${cvData.personalDetails.fullName.replace(/\s/g, '_')}_CV`);
    setIsDownloadingDocx(false);
  };

  // Auth Handlers
  const handleAuthSuccess = (user: User, isNewUser: boolean) => {
    // 1. Update registered users list
    let updatedUsers = [...registeredUsers];
    if (isNewUser) {
      updatedUsers = [...registeredUsers, user];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('cv4u_users', JSON.stringify(updatedUsers));
    }

    // 2. Set current active user
    setCurrentUser(user);
    localStorage.setItem('cv4u_current_user', JSON.stringify(user));
    setShowAuthModal(false);

    // 3. Pre-fill CV personal details using the login info!
    handleDataChange('personalDetails', {
      ...cvData.personalDetails,
      fullName: user.fullName,
      email: user.email,
    });

    // 4. Trigger Welcome Modal with the customized greeting message
    setShowWelcomeModal(true);
    triggerToast(isNewUser ? 'Registered successfully! Welcome to CV4U.' : 'Signed in successfully! Welcome back.');

    // 5. If user triggered download prior to auth, proceed automatically!
    const targetDownload = pendingDownloadType;
    if (targetDownload) {
      setPendingDownloadType(null);
      setTimeout(async () => {
        if (targetDownload === 'pdf') {
          setIsDownloading(true);
          triggerToast('Downloading your PDF resume...');
          await downloadCvAsPdf('cv-preview', `${user.fullName.replace(/\s/g, '_')}_CV`);
          setIsDownloading(false);
        } else if (targetDownload === 'docx') {
          setIsDownloadingDocx(true);
          triggerToast('Downloading your Word resume...');
          await downloadCvAsDocx('cv-preview', `${user.fullName.replace(/\s/g, '_')}_CV`);
          setIsDownloadingDocx(false);
        }
      }, 600);
    }
  };

  const handleLogOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('cv4u_current_user');
    triggerToast('Logged out successfully.');
  };

  // Excel CSV Exporter for registered accounts
  const handleExportLoginsToExcel = () => {
    if (registeredUsers.length === 0) {
      triggerToast('No logins to export yet!', 'error');
      return;
    }

    // Prepare Excel columns & headers
    const headers = ['User ID', 'Full Name', 'Email Address', 'Password (Plain)', 'Registration Timestamp'];
    const rows = registeredUsers.map(user => [
      user.id,
      user.fullName,
      user.email,
      user.password || 'N/A',
      user.createdAt
    ]);

    // Format fields with quotations to handle spaces and commas cleanly
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cv4u_user_logins_sheet.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Login details database successfully exported to Excel!');
  };

  // Existing CV PDF parsing & filling
  const handlePdfImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      triggerToast("Please upload a valid PDF document.", "error");
      return;
    }

    setIsParsingPdf(true);
    triggerToast("Starting AI Resume extraction. Please wait...", "success");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const result = event.target?.result as string;
        if (!result) {
          throw new Error("Empty PDF file uploaded");
        }
        // Extract raw base64 from data URL safely
        const base64Data = result.split(',')[1];
        if (!base64Data) {
          throw new Error("Failed to encode file to base64");
        }

        const parsedCV = await parseResumePdf(base64Data);
        if (parsedCV) {
          // If a user is logged in, preserve their login details as personal info,
          // or merge them with the newly parsed resume content!
          const mergedPersonal = {
            ...parsedCV.personalDetails,
            fullName: currentUser ? currentUser.fullName : parsedCV.personalDetails.fullName || cvData.personalDetails.fullName,
            email: currentUser ? currentUser.email : parsedCV.personalDetails.email || cvData.personalDetails.email,
          };

          setCvData({
            ...parsedCV,
            personalDetails: mergedPersonal,
            accentColor: cvData.accentColor // Keep the chosen accent color
          });

          triggerToast("Hooray! Gemini successfully extracted and filled out your resume details!");
        } else {
          throw new Error("Could not parse PDF content.");
        }
      } catch (err: any) {
        console.error(err);
        const errMsg = err?.message || "Please ensure it is a text-readable PDF.";
        triggerToast(`Failed to parse resume PDF: ${errMsg}`, "error");
      } finally {
        setIsParsingPdf(false);
        // Reset file input so same file can be uploaded again
        e.target.value = '';
      }
    };
    reader.onerror = () => {
      triggerToast("Failed reading file.", "error");
      setIsParsingPdf(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200 pb-12">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slideIn bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
          {toast.type === 'success' ? (
            <CheckCircle className="text-emerald-500 shrink-0" size={20} />
          ) : (
            <AlertCircle className="text-red-500 shrink-0" size={20} />
          )}
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{toast.message}</span>
        </div>
      )}

      {/* PDF Parsing Overlay Spinner */}
      {isParsingPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="relative inline-flex mb-4">
              <div className="animate-spin h-12 w-12 text-indigo-600 dark:text-indigo-400 border-4 border-indigo-200 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400 rounded-full"></div>
              <Sparkles className="absolute inset-0 m-auto text-indigo-500 animate-pulse" size={18} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Reading Your CV PDF... 📄</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Gemini 3.5 is analyzing structure, experience, and skills to fill out your form. Please wait a moment.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 no-print border-b border-gray-100 dark:border-gray-700">
        <div className="container mx-auto flex justify-between items-center flex-wrap gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <Logo size="lg" />
          </div>

          {/* Settings & Tools Area */}
          <div className="flex items-center space-x-4 flex-wrap gap-2 text-sm">
             <div>
                <label htmlFor="font" className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mr-2">Font</label>
                <select
                    id="font"
                    value={font}
                    onChange={(e) => setFont(e.target.value as FontFamily)}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium"
                >
                    <option value="roboto">Roboto</option>
                    <option value="lato">Lato</option>
                    <option value="montserrat">Montserrat</option>
                    <option value="merriweather">Merriweather</option>
                </select>
            </div>
            <div>
                <label htmlFor="template" className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mr-2">Template</label>
                <select
                    id="template"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value as Template)}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium"
                >
                    <option value="creative">Creative</option>
                    <option value="stylish">Stylish</option>
                    <option value="simple">Simple</option>
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                    <option value="professional">Professional</option>
                </select>
            </div>

            {/* Colors */}
            <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-700 pl-4 py-1">
                 <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Color</span>
                 <div className="flex space-x-1">
                   {colorOptions.map(({ name, color }) => (
                      <button
                          key={name}
                          title={name}
                          onClick={() => handleDataChange('accentColor', color)}
                          className={`h-5 w-5 rounded-full border-2 transition-transform transform hover:scale-110 ${cvData.accentColor === color ? 'border-indigo-500 scale-110 ring-2 ring-indigo-200 dark:ring-indigo-900' : 'border-white dark:border-gray-800'}`}
                          style={{ backgroundColor: color }}
                      />
                   ))}
                 </div>
            </div>

            {/* AI Upload Input */}
            <div className="flex items-center pl-2 border-l border-gray-200 dark:border-gray-700">
              <label 
                className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80 font-bold py-1.5 px-3 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer text-xs"
              >
                <Upload size={14} />
                <span>AI Import Resume (PDF)</span>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handlePdfImport} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* User Dashboard Account & Admin Trigger */}
            <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-700 pl-4 py-1">
              {/* Admin Dashboard trigger */}
              <button
                onClick={handleOpenAdminDashboard}
                title="🔒 Admin Control Center (suganthasuga405@gmail.com)"
                className="bg-slate-900 hover:bg-black text-emerald-400 font-bold py-1.5 px-3 rounded-xl flex items-center space-x-1.5 transition-all text-xs cursor-pointer shadow-sm border border-emerald-500/30"
              >
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>Admin Panel</span>
              </button>

              {currentUser ? (
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                  <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-md">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left text-xs max-w-[110px] truncate">
                    <p className="font-bold text-gray-900 dark:text-white leading-none">{currentUser.fullName}</p>
                    <span className="text-[9px] text-gray-500 dark:text-gray-400">My Profile</span>
                  </div>
                  <button
                    onClick={handleLogOut}
                    title="Sign Out"
                    className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition cursor-pointer"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/10 transition-all text-xs cursor-pointer"
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Export CV buttons */}
            <div className="flex items-center space-x-1.5 border-l border-gray-200 dark:border-gray-700 pl-4 py-1">
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                title={!currentUser ? "Login or Sign Up required to download PDF" : "Download PDF Resume"}
                className="bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white font-bold py-1.5 px-3 rounded-xl flex items-center space-x-1.5 transition-colors disabled:opacity-50 text-xs shadow-md"
              >
                {isDownloading ? (
                  <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                ) : !currentUser ? (
                  <Lock size={13} className="text-amber-400" />
                ) : (
                  <FileText size={14} />
                )}
                <span>PDF</span>
                {!currentUser && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-1 rounded">Lock</span>
                )}
              </button>
              <button
                onClick={handleDownloadDocx}
                disabled={isDownloadingDocx}
                title={!currentUser ? "Login or Sign Up required to download Word" : "Download Word Resume"}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-xl flex items-center space-x-1.5 transition-colors disabled:opacity-50 text-xs shadow-md"
              >
                {isDownloadingDocx ? (
                  <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                ) : !currentUser ? (
                  <Lock size={13} className="text-amber-300" />
                ) : (
                  <FileText size={14} />
                )}
                <span>Word</span>
                {!currentUser && (
                  <span className="text-[10px] bg-blue-400/30 text-blue-100 font-semibold px-1 rounded">Lock</span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-2 lg:gap-8 max-w-7xl">
        <div className="no-print bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/80">
          
          {/* Welcoming Top banner to sign up if not signed in */}
          {!currentUser && (
            <div className="mb-6 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/10 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Build faster with an Account! 🚀</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Log in or sign up to pre-fill details and download your resume.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Create Account
              </button>
            </div>
          )}

          <CVForm cvData={cvData} onDataChange={handleDataChange} />
        </div>
        
        <div className="print-container relative">
          {!currentUser && (
            <div className="no-print mb-4 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center justify-between gap-3 shadow-sm text-xs">
              <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 font-semibold">
                <Lock size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Login or Sign Up required to download this resume (PDF / Word).</span>
              </div>
              <button
                onClick={() => {
                  setPendingDownloadType('pdf');
                  setShowAuthModal(true);
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shrink-0 transition shadow-sm cursor-pointer"
              >
                Sign In to Download
              </button>
            </div>
          )}
          <CVPreview cvData={cvData} template={template} font={font} />
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-6 mt-12 text-xs text-gray-500 dark:text-gray-400">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Logo size="sm" />
            <span>
              Copyright 2026 CV4U. All rights reserved. Developed by{' '}
              <a 
                href="https://www.linkedin.com/in/sugan-chandrasekar2005" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Sugan Chandrasekar
              </a>
            </span>
          </div>

          <div className="flex items-center space-x-6 flex-wrap gap-2">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-indigo-600 transition cursor-pointer">
              My Profile
            </button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-indigo-600 transition cursor-pointer">
              Templates
            </button>
            <button onClick={handleDownloadPdf} className="hover:text-indigo-600 transition cursor-pointer">
              Download PDF
            </button>
            <button onClick={handleDownloadDocx} className="hover:text-indigo-600 transition cursor-pointer">
              Download Word
            </button>
            
            {/* Admin Dashboard shortcut */}
            <button 
              onClick={handleOpenAdminDashboard}
              className="text-gray-400 hover:text-emerald-500 font-medium transition cursor-pointer flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-4"
            >
              <Lock size={12} />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingDownloadType(null);
        }}
        onAuthSuccess={handleAuthSuccess}
        registeredUsers={registeredUsers}
        requiredForDownload={Boolean(pendingDownloadType || !currentUser)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onAdminLoginSuccess={(adminUser) => {
          setCurrentUser(adminUser);
          localStorage.setItem('cv4u_current_user', JSON.stringify(adminUser));
          setShowAdminLoginModal(false);
          setShowLoginsPanel(true);
        }}
        triggerToast={triggerToast}
      />

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        userName={currentUser?.fullName || ''}
      />

      {/* Admin Dashboard Control Panel */}
      <AdminDashboardModal
        isOpen={showLoginsPanel}
        onClose={() => setShowLoginsPanel(false)}
        users={registeredUsers}
        onUpdateUsers={(updatedUsers) => {
          setRegisteredUsers(updatedUsers);
          localStorage.setItem('cv4u_users', JSON.stringify(updatedUsers));
        }}
        onExport={handleExportLoginsToExcel}
        triggerToast={triggerToast}
        currentUser={currentUser}
      />
    </div>
  );
};

export default App;
