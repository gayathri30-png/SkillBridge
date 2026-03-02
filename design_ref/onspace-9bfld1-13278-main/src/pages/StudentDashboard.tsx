import MetricCard from '@/components/features/MetricCard';
import JobCard from '@/components/features/JobCard';
import SkillChip from '@/components/features/SkillChip';
import AIScoreBadge from '@/components/features/AIScoreBadge';
import { MOCK_STUDENT_METRICS, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_SKILLS, MOCK_NOTIFICATIONS } from '@/constants/mockData';
import { useAuthStore } from '@/stores/authStore';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Eye, Sparkles, Briefcase, Calendar, Bell, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentDashboard() {
  const { userName } = useAuthStore();
  const topJobs = MOCK_JOBS.filter((j) => (j.aiMatchScore ?? 0) >= 70).slice(0, 3);
  const recentApps = MOCK_APPLICATIONS.slice(0, 4);
  const topSkills = MOCK_SKILLS.slice(0, 6);

  const statusColors: Record<string, string> = {
    applied: 'bg-blue-50 text-blue-700',
    reviewing: 'bg-amber-50 text-amber-700',
    shortlisted: 'bg-emerald-50 text-emerald-700',
    interview: 'bg-purple-50 text-purple-700',
    offered: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-600',
  };

  const metricIcons = [
    <Eye className="size-5" />,
    <Sparkles className="size-5" />,
    <Briefcase className="size-5" />,
    <Calendar className="size-5" />,
  ];

  return (
    <div className="p-4 lg:p-6">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="font-[Outfit] text-2xl font-bold">Welcome back, {userName.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's what's happening with your career journey.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {MOCK_STUDENT_METRICS.map((m, i) => (
          <MetricCard key={m.label} metric={m} icon={metricIcons[i]} />
        ))}
      </div>

      {/* Main Grid: 8 + 4 */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Left Column: Jobs + Applications */}
        <div className="space-y-6 lg:col-span-8">
          {/* Top AI Matches */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-amber-500" />
                <h2 className="font-[Outfit] text-lg font-semibold">Top AI Matches</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                View All <ArrowRight className="ml-1 size-3" />
              </Button>
            </div>
            <div className="space-y-4">
              {topJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[Outfit] text-lg font-semibold">Recent Applications</h2>
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                View All <ArrowRight className="ml-1 size-3" />
              </Button>
            </div>
            <div className="space-y-3">
              {recentApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <AIScoreBadge score={app.aiScore} size="sm" />
                    <div>
                      <p className="text-sm font-medium">{app.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">{app.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', statusColors[app.status])}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills + Notifications */}
        <div className="space-y-6 lg:col-span-4">
          {/* Skills Panel */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[Outfit] text-base font-semibold">Your Skills</h2>
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                <TrendingUp className="mr-1 size-3" /> Analyze
              </Button>
            </div>
            <div className="space-y-3">
              {topSkills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full gradient-azure transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {topSkills.map((s) => (
                <SkillChip key={s.id} name={s.name} level={s.level} />
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="size-4" />
                <h2 className="font-[Outfit] text-base font-semibold">Notifications</h2>
              </div>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600 tabular-nums">
                {MOCK_NOTIFICATIONS.filter((n) => !n.read).length} new
              </span>
            </div>
            <div className="space-y-3">
              {MOCK_NOTIFICATIONS.map((notif) => {
                const typeColors: Record<string, string> = {
                  match: 'bg-amber-100 text-amber-700',
                  success: 'bg-emerald-100 text-emerald-700',
                  info: 'bg-blue-100 text-blue-700',
                  warning: 'bg-orange-100 text-orange-700',
                };
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      'rounded-lg border border-border p-3 transition-colors',
                      !notif.read && 'border-primary/20 bg-primary/[0.02]'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium capitalize', typeColors[notif.type])}>
                            {notif.type}
                          </span>
                          {!notif.read && <span className="size-1.5 rounded-full bg-primary" />}
                        </div>
                        <p className="mt-1 text-sm font-medium">{notif.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{notif.message}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">{formatRelativeTime(notif.createdAt)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
