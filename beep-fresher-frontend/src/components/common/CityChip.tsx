interface CityChipProps {
  city: string | null;
}

export function CityChip({ city }: CityChipProps): JSX.Element | null {
  if (!city) return null;

  return (
    <span
      className="inline-flex min-h-7 items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700"
    >
      {city}
    </span>
  );
}
