import type { Job } from '@/types';
import AIScoreBadge from './AIScoreBadge';
import SkillChip from './SkillChip';
import { MapPin, Clock, Users, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  compact?: boolean;
}

export default function JobCard({ job, onApply, compact = false }: JobCardProps) {
  const typeColors: Record<string, string> = {
    'full-time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'part-time': 'bg-purple-50 text-purple-700 border-purple-200',
    contract: 'bg-orange-50 text-orange-700 border-orange-200',
    internship: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  if (compact) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:card-elevated">
        <img src={job.companyLogo} alt={job.company} className="size-10 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{job.title}</p>
          <p className="text-xs text-muted-foreground">{job.company}</p>
        </div>
        {job.aiMatchScore && <AIScoreBadge score={job.aiMatchScore} size="sm" />}
      </div>
    );
  }

  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:card-elevated hover:border-primary/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <img src={job.companyLogo} alt={job.company} className="size-11 rounded-lg object-cover" />
          <div>
            <h3 className="text-base font-semibold leading-tight">{job.title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{job.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {job.aiMatchScore && <AIScoreBadge score={job.aiMatchScore} size="md" showLabel />}
          <button className="rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100" aria-label="Save job">
            <Bookmark className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5" /> {job.location}
        </span>
        <span className={`rounded-full border px-2 py-0.5 font-medium capitalize ${typeColors[job.type]}`}>
          {job.type}
        </span>
        <span className="font-semibold text-foreground">{job.salary}</span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground text-pretty">{job.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((skill) => (
          <SkillChip key={skill} name={skill} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="size-3.5" /> {formatDate(job.postedAt)}</span>
          <span className="flex items-center gap-1"><Users className="size-3.5" /> {job.applicants} applicants</span>
        </div>
        <Button size="sm" onClick={() => onApply?.(job.id)} className="gradient-azure border-0 text-white">
          Apply Now
        </Button>
      </div>
    </div>
  );
}
