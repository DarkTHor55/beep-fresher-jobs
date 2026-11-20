import { ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ApplyButtonProps {
  url: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function ApplyButton({ url, disabled, size = 'md', onClick }: ApplyButtonProps): JSX.Element {
  const base = 'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const sizes = {
    sm: 'px-3.5 py-2',
    md: 'px-4 py-2.5',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(base, sizes[size], disabled && 'opacity-50 pointer-events-none')}
      aria-label={`Apply at external site`}
    >
      Apply <ExternalLink className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
    </a>
  );
}
