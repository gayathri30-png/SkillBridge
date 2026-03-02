import { cn } from '@/lib/utils';

interface SkillChipProps {
  name: string;
  level?: number;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md';
}

export default function SkillChip({ name, level, variant = 'default', size = 'sm' }: SkillChipProps) {
  const baseClasses = 'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors';

  const variantClasses = {
    default: 'bg-primary/8 text-primary border border-primary/15',
    outline: 'border border-border text-muted-foreground',
    filled: 'bg-primary text-primary-foreground',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], sizeClasses[size])}>
      {name}
      {level !== undefined && (
        <span className="tabular-nums opacity-70">{level}%</span>
      )}
    </span>
  );
}
