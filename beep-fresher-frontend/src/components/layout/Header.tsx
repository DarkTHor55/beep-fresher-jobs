import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../../lib/theme';

export function Header(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16 px-3 md:px-4 gap-4">
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="Beep Fresher Jobs home"
        >
          <span className="text-accent-600 dark:text-accent-400 font-bold text-xl tracking-tight">
            Beep
          </span>
          <span className="text-sm font-semibold text-text-secondary dark:text-text-muted">
            Fresher Jobs
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2.5 rounded-sm hover:bg-bg-tertiary text-text-secondary dark:text-text-muted"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-sm hover:bg-bg-tertiary text-text-secondary dark:text-text-muted"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        {menuOpen && (
          <div
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-xs bg-bg-secondary border-l border-border shadow-lg flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="p-4 flex items-center justify-between border-b border-border">
              <span className="text-sm font-semibold">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-sm hover:bg-bg-tertiary"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4 space-y-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-sm text-text-secondary dark:text-text-muted hover:bg-bg-tertiary hover:text-text"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="block px-3 py-2 rounded-sm text-text-secondary dark:text-text-muted hover:bg-bg-tertiary hover:text-text"
                onClick={() => setMenuOpen(false)}
              >
                Browse Jobs
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
