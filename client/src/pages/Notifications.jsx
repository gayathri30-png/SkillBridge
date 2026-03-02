import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, CheckCircle, MessageSquare, Briefcase, 
  Trash2, Filter, MoreVertical, Sparkles, Target,
  Inbox, Settings, Check
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, jobs, messages

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error("Failed to mark all as read");
    }
  };

  const deleteNotification = (id) => {
    // Current backend doesn't have delete, but we could add it.
    // For now, let's just mark read as a compromise or assume it filters out.
    markRead(id); 
  };

  const getIcon = (type) => {
    switch (type) {
      case 'job_match': return <Target className="text-emerald-500" />;
      case 'application': return <Briefcase className="text-blue-500" />;
      case 'message': return <MessageSquare className="text-purple-500" />;
      case 'status_update': return <Sparkles className="text-amber-500" />;
      case 'offer_accepted': return <CheckCircle className="text-emerald-600" />;
      default: return <Bell className="text-slate-400" />;
    }
  };

  const handleAction = (n) => {
    markRead(n.id);
    if (n.type === 'message') navigate(`/chat`);
    else if (n.type === 'job_match' || n.type === 'application') navigate(`/jobs`);
    else if (n.type === 'status_update') navigate(`/applications`);
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'jobs') return n.type === 'job_match' || n.type === 'application' || n.type === 'status_update';
    if (filter === 'messages') return n.type === 'message';
    return true;
  });

  if (loading) return <div className="p-10 text-center text-slate-500 font-bold">Synchronizing alerts...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Bell className="text-blue-600" /> Notifications
          </h1>
          <p className="text-slate-500 font-medium mt-1">Stay updated with your career progress.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={markAllRead}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
            >
                <Check size={18} /> Mark All as Read
            </button>
        </div>
      </header>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'unread', 'jobs', 'messages'].map(f => (
            <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all border ${filter === f ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}
            >
                {f}
            </button>
        ))}
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-50">
            <AnimatePresence mode='popLayout'>
              {filtered.map((n) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key={n.id}
                  className={`p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-all group cursor-pointer ${!n.is_read ? 'bg-blue-50/30' : ''}`}
                  onClick={() => handleAction(n)}
                >
                  <div className={`p-3 rounded-2xl shrink-0 ${!n.is_read ? 'bg-white shadow-sm ring-4 ring-blue-600/5' : 'bg-slate-50'}`}>
                    {getIcon(n.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <h4 className={`text-sm font-bold truncate ${!n.is_read ? 'text-slate-900' : 'text-slate-500'}`}>
                            {n.message}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-widest">
                            {new Date(n.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 first-letter:uppercase">{n.type.replace('_', ' ')}</p>
                  </div>

                  {!n.is_read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  )}

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                        className="p-2 text-slate-300 hover:text-rose-500"
                    >
                        <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-24 text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Inbox size={32} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Clear Skies!</h3>
            <p className="text-slate-500 font-medium">No {filter !== 'all' ? filter : ''} notifications to show right now.</p>
          </div>
        )}
      </div>

      {/* QUICK PREFERENCES */}
      <footer className="bg-slate-900 text-white p-6 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
              <Settings className="text-blue-400" size={20} />
              <p className="text-sm font-medium">Notification preferences are currently managed by AI.</p>
          </div>
          <button className="text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all">
              Manage Settings
          </button>
      </footer>
    </div>
  );
};

export default Notifications;
