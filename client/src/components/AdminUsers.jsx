import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminTable.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/users/${id}/verify`, { is_verified: status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating verification:", error);
    }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Role", "Status", "Joined"];
    const rows = filteredUsers.map(u => [
      u.name,
      u.email,
      u.role,
      u.is_verified ? "Verified" : "Pending",
      new Date(u.created_at || Date.now()).toLocaleDateString()
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `skillbridge_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="p-8 text-slate-500 text-center">Loading Secure User Directory...</div>;

  return (
    <div className="admin-container fade-in p-8">
      <header className="page-header mb-8 flex justify-between items-end">
        <div>
          <button onClick={() => navigate("/admin")} className="text-slate-400 hover:text-primary mb-4 block text-sm">
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900 m-0">User Management</h1>
        </div>
      </header>

      {/* FILTERS & SEARCH */}
      <div className="table-controls bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex justify-between items-center gap-4">
        <div className="flex gap-4 flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-slate-200 rounded-lg bg-white"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="recruiter">Recruiters</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all" onClick={exportToCSV}>
          Export CSV 📥
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="admin-table w-full text-left border-collapse">
          <thead className="bg-slate-50 border-bottom border-slate-100">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-900">{user.name}</td>
                <td className="p-4 text-slate-500">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold tracking-wide uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'recruiter' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.is_verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                    {user.is_verified ? '• Verified' : '• Pending'}
                  </span>
                </td>
                <td className="p-4 text-slate-400 text-sm">
                  {new Date(user.created_at || Date.now()).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {user.role === 'recruiter' && !user.is_verified && (
                      <button className="text-green-600 hover:text-green-700 text-xl" title="Approve" onClick={() => handleVerify(user.id, true)}>✓</button>
                    )}
                    {user.role === 'recruiter' && user.is_verified && (
                      <button className="text-amber-600 hover:text-amber-700 text-xl" title="Revoke" onClick={() => handleVerify(user.id, false)}>✗</button>
                    )}
                    <button className="text-slate-400 hover:text-slate-600 text-xl" title="Edit">✎</button>
                    <button className="text-red-400 hover:text-red-600 text-xl" title="Delete" onClick={() => deleteUser(user.id, user.name)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-slate-400">No users found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

