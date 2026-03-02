import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminTable.css";

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState({ title: "", message: "", type: "info" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get("/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const createNotification = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/notifications", newNote, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchNotifications();
            setNewNote({ title: "", message: "", type: "info" });
            alert("Notification sent successfully");
        } catch (error) {
            console.error("Error creating notification:", error);
            alert("Failed to send notification");
        }
    };

    const deleteNotification = async (id) => {
        if (!window.confirm("Delete this notification?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchNotifications();
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    if (loading) return <div className="p-8 text-slate-500">Loading alerts...</div>;

    return (
        <div className="admin-container fade-in">
            <header className="page-header">
                <button onClick={() => navigate("/admin")} className="back-link-btn mb-4">
                    ← Back to Overview
                </button>
                <h1 className="page-title">System Notifications</h1>
                <p className="page-subtitle">Broadcaast system-wide alerts and updates.</p>
            </header>

            <div className="card mb-8 p-6" style={{ background: '#f8fafc' }}>
                <h3 className="mb-4">New Notification</h3>
                <form onSubmit={createNotification} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newNote.title}
                        onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                        required
                        className="p-2 border rounded"
                    />
                    <textarea
                        placeholder="Message"
                        value={newNote.message}
                        onChange={e => setNewNote({ ...newNote, message: e.target.value })}
                        required
                        className="p-2 border rounded h-24"
                    />
                    <div className="flex gap-4 items-center">
                        <select
                            value={newNote.type}
                            onChange={e => setNewNote({ ...newNote, type: e.target.value })}
                            className="p-2 border rounded"
                        >
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="success">Success</option>
                            <option value="urgent">Urgent</option>
                        </select>
                        <button type="submit" className="btn btn-primary">Send Alert</button>
                    </div>
                </form>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Alert</th>
                            <th>Type</th>
                            <th>Created</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((note) => (
                            <tr key={note.id}>
                                <td>
                                    <div className="font-bold">{note.title}</div>
                                    <div className="text-xs text-slate-500">{note.message}</div>
                                </td>
                                <td>
                                    <span className={`status-chip ${note.type}`}>
                                        {note.type}
                                    </span>
                                </td>
                                <td>
                                    <div className="text-xs">
                                        {new Date(note.created_at).toLocaleString()}
                                    </div>
                                </td>
                                <td className="text-right">
                                    <button className="delete-btn" onClick={() => deleteNotification(note.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminNotifications;
