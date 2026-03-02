import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Loader } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (error) {
      console.error("Error fetching reports", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-slate-50">
        <Loader className="animate-spin h-8 w-8 text-indigo-600" />
    </div>
  );

  if (!data) return <div className="p-8">Failed to load data.</div>;

  // Prepare Data for Charts
  const userRoleData = Object.keys(data.users || {}).map(role => ({
      name: role.charAt(0).toUpperCase() + role.slice(1),
      value: data.users[role]
  }));

  const jobStatusData = Object.keys(data.jobs || {}).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: data.jobs[status]
  }));

  const appStatusData = Object.keys(data.applications || {}).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: data.applications[status]
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto fade-in">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">System Analytics</h1>
            <p className="text-slate-500">Real-time insights into SkillBridge platform usage.</p>
        </div>

        {/* Global Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 text-sm font-medium uppercase">Total Users</h3>
                <div className="text-3xl font-bold text-slate-800 mt-2">{data.totalUsers}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 text-sm font-medium uppercase">Total Jobs</h3>
                <div className="text-3xl font-bold text-slate-800 mt-2">{data.totalJobs}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 text-sm font-medium uppercase">Applications</h3>
                <div className="text-3xl font-bold text-slate-800 mt-2">{data.totalApplications}</div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* User Distribution Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">User Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={userRoleData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {userRoleData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Application Status Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Application Status</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={appStatusData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Recent Activity Table */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">Recent Registrations</h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-slate-600">User</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Role</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {data.recentUsers && data.recentUsers.map((u, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="p-4 text-slate-800 font-medium">{u.name}</td>
                            <td className="p-4">
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600 uppercase">
                                    {u.role}
                                </span>
                            </td>
                            <td className="p-4 text-slate-500 text-sm">
                                {new Date(u.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default Reports;
