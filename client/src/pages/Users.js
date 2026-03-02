import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Trash2, Shield, Search } from "lucide-react";
import { toast } from "react-hot-toast"; // Assuming we have this or wil add it, otherwise fallback to alert

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/users", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
    } catch (err) {
        console.error(err);
        // alert("Failed to fetch users");
    } finally {
        setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/api/users/${userId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_verified: res.data.is_verified } : user
      ));
      
    //   toast.success(res.data.message);
    } catch (error) {
      console.error("Verification failed", error);
    //   toast.error("Failed to update verification.");
    }
  };

  const handleDelete = async (userId) => {
      if(!window.confirm("Are you sure you want to delete this user?")) return;

      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
          console.error("Delete failed", error);
      }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-slate-500">Loading users...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
            <p className="text-slate-500">Manage students, recruiters, and admins.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-semibold text-slate-600">User</th>
              <th className="p-4 font-semibold text-slate-600">Role</th>
              <th className="p-4 font-semibold text-slate-600">Status</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
                <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">No users found.</td>
                </tr>
            ) : (
                filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                    <div className="font-medium text-slate-900">{user.name}</div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                    </td>
                    <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                              user.role === 'recruiter' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {user.role}
                        </span>
                    </td>
                    <td className="p-4">
                        {user.role === 'recruiter' ? (
                            <div className="flex items-center space-x-2">
                                {user.is_verified ? (
                                    <span className="flex items-center text-green-600 text-sm">
                                        <CheckCircle className="h-4 w-4 mr-1" /> Verified
                                    </span>
                                ) : (
                                    <span className="flex items-center text-amber-600 text-sm">
                                        <Shield className="h-4 w-4 mr-1" /> Pending
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-slate-400 text-sm">-</span>
                        )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                        {user.role === 'recruiter' && (
                            <button 
                                onClick={() => handleVerify(user.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                    user.is_verified 
                                    ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                                title={user.is_verified ? "Unverify User" : "Verify User"}
                            >
                                {user.is_verified ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </button>
                        )}
                        <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete User"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
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

export default Users;
