import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminTable.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This cannot be undone.`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading user database...</div>;

  return (
    <div className="admin-container fade-in">
      <header className="page-header">
        <button onClick={() => navigate("/admin")} className="back-link-btn mb-4">
           ← Back to Overview
        </button>
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">Inspect and manage all registered platform users.</p>
      </header>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>Role</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="candidate-info">
                    <div className="candidate-avatar">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="candidate-name">{user.name}</div>
                      <div className="candidate-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                   <span className="status-chip accepted">Active</span>
                </td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td className="text-right">
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteUser(user.id, user.name)}
                    disabled={user.role === 'admin'}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

