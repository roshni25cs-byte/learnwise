import React, { useState } from 'react';
import { X, Shield, Check, Ban, Clock, User, AlertCircle } from 'lucide-react';

export default function AdminApprovalModal({ isOpen, onClose }) {
  const [pendingFaculty, setPendingFaculty] = useState([
    {
      id: 'fac-101',
      full_name: 'Dr. Sarah Connor',
      email: 's.connor@university.edu',
      department: 'Computer Science & AI',
      requested_at: '2 hours ago',
      status: 'PENDING',
    },
    {
      id: 'fac-102',
      full_name: 'Prof. Marcus Brody',
      email: 'm.brody@university.edu',
      department: 'Data Engineering',
      requested_at: '5 hours ago',
      status: 'PENDING',
    },
  ]);

  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!isOpen) return null;

  const handleApprove = (id, name) => {
    setPendingFaculty(prev => prev.filter(f => f.id !== id));
    setFeedbackMsg(`Approved faculty credentials for ${name}. Account is now fully active.`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleReject = (id, name) => {
    setPendingFaculty(prev => prev.filter(f => f.id !== id));
    setFeedbackMsg(`Rejected faculty registration for ${name}.`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Administrator Faculty Verification Portal</h2>
              <p className="text-xs text-purple-200">Review, approve, or reject registered faculty accounts</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {feedbackMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center">
              <Check className="w-4 h-4 mr-2 text-emerald-600" />
              {feedbackMsg}
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Pending Faculty Registrations ({pendingFaculty.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">RBAC Security Policy Active</span>
          </div>

          {pendingFaculty.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
              <Shield className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No Pending Approvals</p>
              <p className="text-xs text-slate-400 mt-0.5">All faculty accounts have been verified by administrators.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingFaculty.map(f => (
                <div key={f.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                      {f.full_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{f.full_name}</h4>
                      <p className="text-xs text-slate-500">{f.email} • {f.department}</p>
                      <span className="text-[10px] text-slate-400 font-medium flex items-center mt-0.5">
                        <Clock className="w-3 h-3 mr-1" /> Requested {f.requested_at}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      onClick={() => handleReject(f.id, f.full_name)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center space-x-1 transition-colors"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(f.id, f.full_name)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Faculty</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900">
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
}
