import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, UserCheck } from "lucide-react";
import "./AdminTable.css";

const AdminVerify = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingRecruiters();
  }, []);

  const fetchPendingRecruiters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Verification queue from reportStats
      setRecruiters(response.data.verificationQueue || []);
    } catch (error) {
      console.error("Error fetching pending recruiters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/admin/users/${id}/verify`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Recruiter ${status === 'approve' ? 'verified' : 'rejected'} successfully`);
      fetchPendingRecruiters();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading verification queue...</div>;

  return (
    <div className="admin-container fade-in">
      <header className="page-header">
        <button onClick={() => navigate("/admin")} className="back-link-btn mb-4">
           ← Back to Overview
        </button>
        <h1 className="page-title">Recruiter Verification</h1>
        <p className="page-subtitle">Verify pending recruiter accounts to maintain platform integrity.</p>
      </header>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Recruiter</th>
              <th>Email</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recruiters.length === 0 ? (
                <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-400">No pending verifications.</td>
                </tr>
            ) : (
                recruiters.map((rec) => (
                    <tr key={rec.id}>
                        <td>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {rec.name?.charAt(0)}
                                </div>
                                <span className="font-medium text-slate-800">{rec.name}</span>
                            </div>
                        </td>
                        <td>{rec.email}</td>
                        <td className="text-xs text-slate-500">{new Date(rec.created_at).toLocaleDateString()}</td>
                        <td className="text-right">
                            <div className="flex justify-end gap-2">
                                <button 
                                    className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md text-xs font-bold hover:bg-green-100 flex items-center gap-1"
                                    onClick={() => handleVerify(rec.id, 'approve')}
                                >
                                    <CheckCircle size={14} /> Approve
                                </button>
                                <button 
                                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-bold hover:bg-red-100 flex items-center gap-1"
                                    onClick={() => handleVerify(rec.id, 'reject')}
                                >
                                    <XCircle size={14} /> Reject
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
  );
};

export default AdminVerify;
