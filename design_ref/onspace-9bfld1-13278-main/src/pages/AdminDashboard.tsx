import MetricCard from '@/components/features/MetricCard';
import { MOCK_ADMIN_METRICS, MOCK_USERS, MOCK_SYSTEM_LOGS } from '@/constants/mockData';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Users, Briefcase, Activity, Gauge, Shield, Settings, Search, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function AdminDashboard() {
  const [userSearch, setUserSearch] = useState('');
  const [logFilter, setLogFilter] = useState<string>('all');

  const filteredUsers = MOCK_USERS.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredLogs = logFilter === 'all' ? MOCK_SYSTEM_LOGS : MOCK_SYSTEM_LOGS.filter((l) => l.type === logFilter);

  const metricIcons = [
    <Users className="size-5" />,
    <Briefcase className="size-5" />,
    <Activity className="size-5" />,
    <Gauge className="size-5" />,
    <Shield className="size-5" />,
    <Settings className="size-5" />,
  ];

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700',
    inactive: 'bg-muted text-muted-foreground',
    suspended: 'bg-red-50 text-red-600',
  };

  const logTypeColors: Record<string, string> = {
    auth: 'bg-blue-50 text-blue-700',
    data: 'bg-purple-50 text-purple-700',
    system: 'bg-slate-100 text-slate-700',
    security: 'bg-red-50 text-red-600',
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="font-[Outfit] text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform overview and management tools.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {MOCK_ADMIN_METRICS.map((m, i) => (
          <MetricCard key={m.label} metric={m} icon={metricIcons[i]} />
        ))}
      </div>

      {/* Main Grid: Users + Logs */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* User Management */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-[Outfit] text-lg font-semibold">User Management</h2>
              <div className="relative sm:w-56">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="h-9 pl-9 text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground">User</th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Role</th>
                    <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.slice(0, 10).map((user) => (
                    <tr key={user.id} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={user.avatar} alt={user.name} className="size-8 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">{user.role}</span>
                      </td>
                      <td className="py-3">
                        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', statusColors[user.status])}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="icon" className="size-8" aria-label="More actions">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Showing {Math.min(filteredUsers.length, 10)} of {filteredUsers.length} users
            </p>
          </div>
        </div>

        {/* System Logs */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[Outfit] text-lg font-semibold">System Logs</h2>
            </div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {['all', 'auth', 'data', 'system', 'security'].map((t) => (
                <button
                  key={t}
                  onClick={() => setLogFilter(t)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    logFilter === t ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="max-h-[500px] space-y-2 overflow-y-auto">
              {filteredLogs.map((log) => (
                <div key={log.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium capitalize', logTypeColors[log.type])}>
                          {log.type}
                        </span>
                        <p className="truncate text-sm font-medium">{log.action}</p>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{log.details}</p>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{log.user}</span>
                    <span>{formatRelativeTime(log.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
