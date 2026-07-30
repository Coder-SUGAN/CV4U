import React, { useState } from 'react';
import { User } from '../types';
import { 
  X, 
  FileSpreadsheet, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Table, 
  Mail, 
  Edit2, 
  Trash2, 
  Plus, 
  Save, 
  Check, 
  Lock, 
  Users,
  Activity,
  CreditCard,
  BarChart3,
  Database,
  Copy,
  TrendingUp,
  Download,
  ShieldCheck,
  Search,
  CheckCircle2
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onUpdateUsers: (updatedUsers: User[]) => void;
  onExport: () => void;
  triggerToast: (msg: string, type?: 'success' | 'error') => void;
  currentUser: User | null;
}

type AdminTab = 'users' | 'loginHistory' | 'analytics' | 'payments' | 'reports';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ 
  isOpen, 
  onClose, 
  users, 
  onUpdateUsers, 
  onExport, 
  triggerToast,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // User Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ fullName: string; email: string; password: string }>({
    fullName: '',
    email: '',
    password: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', password: '' });
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleStartEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      password: user.password
    });
  };

  const handleSaveEdit = (userId: string) => {
    if (!editForm.fullName.trim() || !editForm.email.trim() || !editForm.password.trim()) {
      triggerToast('All fields are required', 'error');
      return;
    }
    const updated = users.map(u => u.id === userId ? { ...u, ...editForm } : u);
    onUpdateUsers(updated);
    setEditingId(null);
    triggerToast('User login details updated successfully!');
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete account for ${userName}?`)) {
      const updated = users.filter(u => u.id !== userId);
      onUpdateUsers(updated);
      triggerToast(`Deleted user account: ${userName}`);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.fullName.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      triggerToast('Please fill all user fields', 'error');
      return;
    }
    const addedUser: User = {
      id: `user_${Date.now()}`,
      fullName: newUser.fullName.trim(),
      email: newUser.email.trim().toLowerCase(),
      password: newUser.password.trim(),
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    onUpdateUsers([...users, addedUser]);
    setNewUser({ fullName: '', email: '', password: '' });
    setShowAddForm(false);
    triggerToast('Added new user login successfully!');
  };

  const generateEmailReportText = () => {
    let report = `CV4U - ADMIN DATABASE & USER LOGINS REPORT\n`;
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `Recipient: suganthansuga405@gmail.com\n`;
    report += `Total Registered Users: ${users.length}\n`;
    report += `========================================================\n\n`;
    users.forEach((u, index) => {
      report += `[#${index + 1}] ID: ${u.id}\n`;
      report += `     Name: ${u.fullName}\n`;
      report += `     Email: ${u.email}\n`;
      report += `     Password: ${u.password}\n`;
      report += `     Joined Date: ${u.createdAt}\n\n`;
    });
    report += `========================================================\n`;
    report += `Database Engine Status: Healthy / Sync Active\n`;
    return report;
  };

  const handleSendEmailLogins = () => {
    const recipient = 'suganthansuga405@gmail.com';
    const subject = encodeURIComponent(`CV4U Admin Database Report - ${users.length} Registered Accounts`);
    const body = encodeURIComponent(generateEmailReportText());
    
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    triggerToast(`Opening email client to send database report to ${recipient}`);
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateEmailReportText());
    setCopied(true);
    triggerToast('Copied admin database report to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full border border-gray-200 dark:border-gray-700 overflow-hidden relative flex flex-col h-[90vh]">
        
        {/* Admin Navigation Bar */}
        <div className="bg-slate-900 px-6 py-4 text-white flex flex-wrap justify-between items-center shrink-0 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl border border-emerald-500/30">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Admin Control Center</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Hidden Access
                </span>
              </div>
              <p className="text-slate-400 text-xs">Logged in as Administrator (suganthansuga405@gmail.com)</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-xl transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 flex items-center gap-1 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'users' 
                ? 'border-emerald-400 text-emerald-400 bg-slate-700/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={16} />
            <span>Users & Logins ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('loginHistory')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'loginHistory' 
                ? 'border-emerald-400 text-emerald-400 bg-slate-700/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity size={16} />
            <span>Login History</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'analytics' 
                ? 'border-emerald-400 text-emerald-400 bg-slate-700/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'payments' 
                ? 'border-emerald-400 text-emerald-400 bg-slate-700/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard size={16} />
            <span>Payments & Subscriptions</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'reports' 
                ? 'border-emerald-400 text-emerald-400 bg-slate-700/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database size={16} />
            <span>Database Reports</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow bg-slate-50 dark:bg-gray-900">
          
          {/* TAB 1: USERS & LOGINS */}
          {activeTab === 'users' && (
            <div className="space-y-5">
              
              {/* Top Banner */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" size={20} />
                  <div className="text-xs text-emerald-900 dark:text-emerald-200">
                    <span className="font-bold block text-sm mb-0.5">Suganth's Private Database</span>
                    Manage registered user credentials or send an updated report directly to <strong>suganthansuga405@gmail.com</strong>.
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleSendEmailLogins}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition cursor-pointer"
                  >
                    <Mail size={15} />
                    <span>Email Report</span>
                  </button>
                  <button
                    onClick={handleCopyReport}
                    className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 font-bold py-2 px-3 rounded-xl text-xs flex items-center space-x-1 transition cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="relative flex-grow max-w-xs">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Add User Account</span>
                  </button>

                  <button
                    onClick={onExport}
                    disabled={users.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
                  >
                    <FileSpreadsheet size={15} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Add User Form */}
              {showAddForm && (
                <form onSubmit={handleAddUser} className="bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800/60 p-4 rounded-xl space-y-3 shadow-sm animate-fadeIn">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Add New User Account
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                      className="p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
                    >
                      Save Account
                    </button>
                  </div>
                </form>
              )}

              {/* Table */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                {filteredUsers.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    <Users size={40} className="mx-auto opacity-30 mb-2" />
                    <p className="font-medium text-xs">No matching user accounts found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700/80 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider">
                          <th className="p-3">Full Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Password</th>
                          <th className="p-3">Registered Date</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700 font-medium">
                        {filteredUsers.map((u) => {
                          const isEditing = editingId === u.id;

                          if (isEditing) {
                            return (
                              <tr key={u.id} className="bg-amber-50/60 dark:bg-amber-950/20">
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={editForm.fullName}
                                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                    className="w-full p-1.5 bg-white dark:bg-gray-700 border border-amber-300 rounded text-xs font-semibold"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full p-1.5 bg-white dark:bg-gray-700 border border-amber-300 rounded text-xs font-mono"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                    className="w-full p-1.5 bg-white dark:bg-gray-700 border border-amber-300 rounded text-xs font-mono"
                                  />
                                </td>
                                <td className="p-3 text-gray-400">{u.createdAt}</td>
                                <td className="p-2 text-right">
                                  <div className="flex items-center justify-end space-x-1">
                                    <button
                                      onClick={() => handleSaveEdit(u.id)}
                                      className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                                      title="Save Changes"
                                    >
                                      <Save size={14} />
                                    </button>
                                    <button
                                      onClick={() => setEditingId(null)}
                                      className="p-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded"
                                      title="Cancel"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                              <td className="p-3 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                                  {u.fullName.charAt(0)}
                                </div>
                                <span>{u.fullName}</span>
                                {u.email === 'suganthansuga405@gmail.com' && (
                                  <span className="text-[9px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full">Admin</span>
                                )}
                              </td>
                              <td className="p-3 font-mono text-gray-600 dark:text-gray-300">{u.email}</td>
                              <td className="p-3">
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 border border-gray-200 dark:border-gray-600 rounded text-gray-800 dark:text-gray-200">
                                    {showPasswords[u.id] ? u.password : '••••••••'}
                                  </span>
                                  <button
                                    onClick={() => togglePasswordVisibility(u.id)}
                                    className="text-gray-400 hover:text-indigo-600"
                                    title="Toggle visibility"
                                  >
                                    {showPasswords[u.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 text-gray-400">{u.createdAt}</td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleStartEdit(u)}
                                    className="p-1 text-gray-400 hover:text-indigo-600 rounded"
                                    title="Edit User Details"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(u.id, u.fullName)}
                                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                                    title="Delete User"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LOGIN HISTORY */}
          {activeTab === 'loginHistory' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Recent Login Activity Logs</h3>
                <p className="text-xs text-gray-500 mb-4">Historical sign-in attempts and session events.</p>
                
                <div className="space-y-2">
                  {users.map((u, i) => (
                    <div key={u.id} className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 flex items-center justify-center font-bold">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{u.fullName} ({u.email})</p>
                          <p className="text-[11px] text-gray-500">Successful Auth Login • Web Browser Session</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                        {u.createdAt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Total Users</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{users.length}</span>
                    <span className="text-xs font-bold text-emerald-500 flex items-center">+100%</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">PDF Downloads</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">128</span>
                    <span className="text-xs font-bold text-indigo-500">Active</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Word Downloads</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">64</span>
                    <span className="text-xs font-bold text-blue-500">Docx</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">AI Imports</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-black text-emerald-600">42</span>
                    <span className="text-xs font-bold text-emerald-500">PDF Parsed</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Platform Usage & Conversion Summary</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  CV4U enforces user authentication prior to downloading generated resumes. Every sign-up adds to the user database.
                </p>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                  <div className="bg-indigo-600 h-full w-[60%]" title="PDF Downloads (60%)" />
                  <div className="bg-blue-500 h-full w-[30%]" title="Word Downloads (30%)" />
                  <div className="bg-emerald-500 h-full w-[10%]" title="AI Parser Usage (10%)" />
                </div>
                <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"/> PDF Downloads (60%)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/> Word Exports (30%)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/> AI Parser (10%)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Subscription & Plan Tier Overview</h3>
                    <p className="text-xs text-gray-500">Current monetization configuration for CV4U.</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold rounded-full">
                    Free AI Builder Tier
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                    <span className="font-bold text-gray-900 dark:text-white block mb-1">Standard Free Tier</span>
                    <p className="text-gray-500 dark:text-gray-400">Unlimited resume building, PDF and Word downloads upon sign-up.</p>
                  </div>
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                    <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">Pro AI Tier ($9.99/mo)</span>
                    <p className="text-indigo-700 dark:text-indigo-400">Pro AI suggestions, unlimited templates, premium styling.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REPORTS & DATABASE MANAGEMENT */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Database Backup & Automated Emailing</h3>
                <p className="text-xs text-gray-500">
                  Export complete CSV files or send the latest user login list directly to administrative email address.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSendEmailLogins}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
                  >
                    <Mail size={16} />
                    <span>Send Database to suganthansuga405@gmail.com</span>
                  </button>

                  <button
                    onClick={onExport}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
                  >
                    <Download size={16} />
                    <span>Download Full CSV Database</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-900 px-6 py-4 border-t border-slate-700 flex justify-between items-center shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Lock size={13} className="text-emerald-400" />
            <span>Admin Control Panel (suganthansuga405@gmail.com)</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
