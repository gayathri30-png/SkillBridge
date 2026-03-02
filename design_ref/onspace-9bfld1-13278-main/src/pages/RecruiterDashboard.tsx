import MetricCard from '@/components/features/MetricCard';
import ApplicantRow from '@/components/features/ApplicantRow';
import { MOCK_RECRUITER_METRICS, MOCK_APPLICANTS, MOCK_JOBS } from '@/constants/mockData';
import { useAuthStore } from '@/stores/authStore';
import { Users, Briefcase, UserCheck, TrendingUp, Plus, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function RecruiterDashboard() {
  const { userName } = useAuthStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredApplicants = MOCK_APPLICANTS.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const recruiterJobs = MOCK_JOBS.slice(0, 4);

  const metricIcons = [
    <Briefcase className="size-5" />,
    <Users className="size-5" />,
    <UserCheck className="size-5" />,
    <TrendingUp className="size-5" />,
  ];

  const statuses = ['all', 'new', 'reviewing', 'shortlisted', 'interview', 'rejected'];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[Outfit] text-2xl font-bold">Welcome back, {userName.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your job postings and review applicants.</p>
        </div>
        <Button className="gradient-azure border-0 text-white">
          <Plus className="mr-2 size-4" /> Post New Job
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {MOCK_RECRUITER_METRICS.map((m, i) => (
          <MetricCard key={m.label} metric={m} icon={metricIcons[i]} />
        ))}
      </div>

      {/* Main Grid: 8 + 4 */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Applicant Pipeline */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-[Outfit] text-lg font-semibold">Applicant Pipeline</h2>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-56">
                  <Input
                    placeholder="Search applicants..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-1.5 size-3.5" /> Filter
                </Button>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    statusFilter === s
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {s} {s !== 'all' && (
                    <span className="ml-1 tabular-nums">
                      ({MOCK_APPLICANTS.filter((a) => a.status === s).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredApplicants.map((applicant) => (
                <ApplicantRow key={applicant.id} applicant={applicant} />
              ))}
              {filteredApplicants.length === 0 && (
                <div className="py-12 text-center">
                  <Users className="mx-auto size-10 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">No applicants match your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Jobs */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[Outfit] text-base font-semibold">Your Active Jobs</h2>
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                View All <ArrowRight className="ml-1 size-3" />
              </Button>
            </div>
            <div className="space-y-3">
              {recruiterJobs.map((job) => (
                <div key={job.id} className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.location} · {job.type}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${job.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="size-3" /> {job.applicants} applicants
                    </span>
                    <span>{job.salary}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 font-[Outfit] text-base font-semibold">Pipeline Summary</h2>
            <div className="space-y-3">
              {[
                { label: 'New Applications', count: MOCK_APPLICANTS.filter((a) => a.status === 'new').length, color: 'bg-blue-500' },
                { label: 'Under Review', count: MOCK_APPLICANTS.filter((a) => a.status === 'reviewing').length, color: 'bg-amber-500' },
                { label: 'Shortlisted', count: MOCK_APPLICANTS.filter((a) => a.status === 'shortlisted').length, color: 'bg-emerald-500' },
                { label: 'In Interview', count: MOCK_APPLICANTS.filter((a) => a.status === 'interview').length, color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
