import { cn } from '../../lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ name, size = 'sm' }: AvatarProps): JSX.Element {
  const initials = name
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  const sizes = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
  };

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 font-semibold text-indigo-800 dark:border-indigo-800',
        sizes[size],
      )}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
