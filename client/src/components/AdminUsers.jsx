import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminTable.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    
    if (search) {
      result = result.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      result = result.filter(u => u.role === roleFilter);
    }

    setFilteredUsers(result);
  }, [search, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Role", "Status", "Joined"];
    const rows = filteredUsers.map(u => [
      u.name, 
      u.email, 
      u.role, 
      u.is_verified ? "Verified" : "Pending", 
      new Date(u.created_at).toLocaleDateString()
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

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This cannot be undone.`)) return;

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const toggleVerification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/api/admin/users/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      fetchUsers();
    } catch (error) {
      console.error("Error updating verification:", error);
      alert("Failed to update verification status");
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading user database...</div>;

  return (
    <div className="admin-container fade-in">
      <header className="page-header">
        <button onClick={() => navigate("/admin")} className="back-link-btn mb-4">
           ← Back to Overview
        </button>
        <div className="flex justify-between items-end">
           <div>
              <h1 className="page-title">User Management</h1>
              <p className="page-subtitle">Inspect and manage all registered platform users.</p>
           </div>
           <button onClick={exportToCSV} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors flex items-center gap-2">
              📥 Export CSV
           </button>
        </div>
      </header>

      {/* SEARCH & FILTERS */}
      <div className="filter-bar bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
         <div className="flex-1 min-w-[200px] relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
               type="text" 
               placeholder="Search by name or email..." 
               className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <select 
            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
         >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="recruiter">Recruiters</option>
            <option value="admin">Admins</option>
         </select>
         <div className="text-xs text-slate-400 font-bold uppercase ml-auto">
            Showing {filteredUsers.length} users
         </div>
      </div>

      <div className="table-wrapper shadow-xl rounded-xl border border-slate-100 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">
                       {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td className="text-slate-500">{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td>
                   <span className={`status-chip ${user.is_verified ? 'accepted' : 'pending'}`}>
                      {user.is_verified ? 'Verified' : 'Pending'}
                   </span>
                </td>
                <td className="text-xs text-slate-400">
                   {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    {user.role === 'recruiter' && (
                      <button 
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-colors ${
                          user.is_verified 
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                        }`}
                        onClick={() => toggleVerification(user.id)}
                      >
                        {user.is_verified ? "Revoke" : "Verify"}
                      </button>
                    )}
                    <button 
                      className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-[10px] font-bold uppercase hover:bg-red-100 disabled:opacity-30" 
                      onClick={() => deleteUser(user.id, user.name)}
                      disabled={user.role === 'admin'}
                    >
                      Delete
                    </button>
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

