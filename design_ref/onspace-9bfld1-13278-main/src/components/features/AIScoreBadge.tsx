import { cn } from '@/lib/utils';
import { getAIScoreCategory } from '@/constants/config';
import { Sparkles } from 'lucide-react';

interface AIScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function AIScoreBadge({ score, size = 'md', showLabel = false }: AIScoreBadgeProps) {
  const category = getAIScoreCategory(score);

  const sizeClasses = {
    sm: 'size-8 text-xs',
    md: 'size-11 text-sm',
    lg: 'size-14 text-base',
  };

  const ringSize = {
    sm: 'ring-2',
    md: 'ring-[3px]',
    lg: 'ring-4',
  };

  const ringColor = score >= 85
    ? 'ring-emerald-400/40'
    : score >= 70
    ? 'ring-blue-400/40'
    : score >= 50
    ? 'ring-amber-400/40'
    : 'ring-red-400/40';

  const bgColor = score >= 85
    ? 'bg-emerald-50'
    : score >= 70
    ? 'bg-blue-50'
    : score >= 50
    ? 'bg-amber-50'
    : 'bg-red-50';

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full font-semibold tabular-nums',
          sizeClasses[size],
          ringSize[size],
          ringColor,
          bgColor,
          category.color
        )}
      >
        {score}
        {size === 'lg' && (
          <Sparkles className="absolute -right-1 -top-1 size-4 text-amber-500" />
        )}
      </div>
      {showLabel && (
        <span className={cn('text-xs font-medium', category.color)}>{category.label}</span>
      )}
    </div>
  );
}
