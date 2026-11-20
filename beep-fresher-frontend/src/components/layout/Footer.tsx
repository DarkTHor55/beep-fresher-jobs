export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-border bg-bg-secondary py-8 mt-auto">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-text-muted dark:text-text-muted">
        <p>
          Jobs are collected from public sources and link back to the original
          listing.
        </p>
        <p className="text-text-muted dark:text-text-muted/70">Beep Fresher Jobs &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
