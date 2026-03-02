import type { Applicant } from '@/types';
import AIScoreBadge from './AIScoreBadge';
import SkillChip from './SkillChip';
import { Button } from '@/components/ui/button';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Eye, UserCheck, X, FileDown } from 'lucide-react';

interface ApplicantRowProps {
  applicant: Applicant;
  onShortlist?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function ApplicantRow({ applicant, onShortlist, onReject }: ApplicantRowProps) {
  const statusColors: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700',
    reviewing: 'bg-amber-50 text-amber-700',
    shortlisted: 'bg-emerald-50 text-emerald-700',
    interview: 'bg-purple-50 text-purple-700',
    rejected: 'bg-red-50 text-red-600',
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:card-elevated sm:flex-row sm:items-center">
      <div className="flex items-center gap-3 sm:w-56">
        <img
          src={applicant.avatar}
          alt={applicant.name}
          className="size-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{applicant.name}</p>
          <p className="truncate text-xs text-muted-foreground">{applicant.title}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-4">
        <AIScoreBadge score={applicant.aiMatchScore} size="sm" />

        <div className="hidden flex-wrap gap-1 lg:flex">
          {applicant.skills.slice(0, 3).map((s) => (
            <SkillChip key={s} name={s} variant="outline" />
          ))}
        </div>

        <span className="text-xs text-muted-foreground">{applicant.experience} exp.</span>

        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', statusColors[applicant.status])}>
          {applicant.status}
        </span>

        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(applicant.appliedAt)}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="size-8" aria-label="View profile">
          <Eye className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-8" aria-label="Download resume">
          <FileDown className="size-3.5" />
        </Button>
        {applicant.status !== 'shortlisted' && applicant.status !== 'rejected' && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
              onClick={() => onShortlist?.(applicant.id)}
              aria-label="Shortlist"
            >
              <UserCheck className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => onReject?.(applicant.id)}
              aria-label="Reject"
            >
              <X className="size-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
