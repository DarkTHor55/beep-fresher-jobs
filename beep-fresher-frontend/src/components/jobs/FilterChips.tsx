import { useState } from 'react';
import { Check, MapPin, SlidersHorizontal, X } from 'lucide-react';

interface FilterChipProps {
  roles: string[];
  cities: string[];
  selectedRole: string | null;
  selectedCity: string | null;
  onRoleChange: (role: string | null) => void;
  onCityChange: (city: string | null) => void;
  onClearAll: () => void;
}

export function FilterChips({
  roles,
  cities,
  selectedRole,
  selectedCity,
  onRoleChange,
  onCityChange,
  onClearAll,
}: FilterChipProps): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasActiveFilters = Boolean(selectedRole || selectedCity);

  const roleOptions = (value: string, label: string) => {
    const active = selectedRole === value || (!value && !selectedRole);
    return (
      <button
        key={label}
        type="button"
        onClick={() => onRoleChange(value || null)}
        aria-pressed={active}
        className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors focus-ring ${active ? 'border-indigo-600 bg-indigo-50 text-indigo-800 dark:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-200' : 'border-slate-200 bg-surface text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-indigo-950/30'}`}
      >
        {active && <Check className="h-3.5 w-3.5" />}
        {label}
      </button>
    );
  };

  const cityOptions = (value: string, label: string) => {
    const active = selectedCity === value || (!value && !selectedCity);
    return (
      <button
        key={label}
        type="button"
        onClick={() => onCityChange(value || null)}
        aria-pressed={active}
        className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors focus-ring ${active ? 'border-indigo-600 bg-indigo-50 text-indigo-800 dark:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-200' : 'border-slate-200 bg-surface text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:hover:bg-indigo-950/30'}`}
      >
        {active && <Check className="h-3.5 w-3.5" />}
        {label}
      </button>
    );
  };

  return (
    <div>
      <div className="hidden space-y-4 sm:block">
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-600">Role</p>
          <div className="flex flex-wrap gap-2">
            {roleOptions('', 'All roles')}
            {roles.map((role) => roleOptions(role, role))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-600">Location</p>
          <div className="flex flex-wrap gap-2">
            {cityOptions('', 'Anywhere')}
            {cities.map((city) => cityOptions(city, city))}
          </div>
        </div>
        {hasActiveFilters && <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">{selectedRole && <button type="button" onClick={() => onRoleChange(null)} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-indigo-50 px-3 text-xs font-semibold text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200">{selectedRole}<X className="h-3.5 w-3.5" /></button>}{selectedCity && <button type="button" onClick={() => onCityChange(null)} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-indigo-50 px-3 text-xs font-semibold text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200">{selectedCity}<X className="h-3.5 w-3.5" /></button>}<button type="button" onClick={onClearAll} className="min-h-9 px-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">Clear all</button></div>}
      </div>

      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-surface px-4 text-sm font-semibold text-slate-800 dark:border-slate-700"
          aria-haspopup="dialog"
        >
          <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-indigo-600" />Filters</span>
          {hasActiveFilters && <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100">{Number(Boolean(selectedRole)) + Number(Boolean(selectedCity))} selected</span>}
        </button>
        {hasActiveFilters && <div className="mt-3 flex flex-wrap gap-2">{selectedRole && <button type="button" onClick={() => onRoleChange(null)} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-indigo-50 px-3 text-xs font-semibold text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200">{selectedRole}<X className="h-3.5 w-3.5" /></button>}{selectedCity && <button type="button" onClick={() => onCityChange(null)} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-indigo-50 px-3 text-xs font-semibold text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200">{selectedCity}<X className="h-3.5 w-3.5" /></button>}<button type="button" onClick={onClearAll} className="min-h-9 px-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">Clear all</button></div>}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] flex items-end bg-slate-950/40 sm:hidden" onClick={() => setMobileOpen(false)}>
          <section className="w-full rounded-t-3xl border border-slate-200 bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl dark:border-slate-700" role="dialog" aria-modal="true" aria-labelledby="mobile-filters-title" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300" />
            <div className="mb-5 flex items-center justify-between">
              <div><h2 id="mobile-filters-title" className="font-display text-lg font-semibold">Filter opportunities</h2><p className="mt-1 text-xs text-slate-600">Choose a role or a location.</p></div>
              <button type="button" onClick={() => setMobileOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close filters"><X className="h-5 w-5" /></button>
            </div>
            <label className="mb-4 block"><span className="mb-2 block text-xs font-semibold text-slate-600">Role</span><select value={selectedRole ?? ''} onChange={(event) => onRoleChange(event.target.value || null)} className="select min-h-12 rounded-xl border-slate-200 bg-slate-100 dark:border-slate-700"><option value="">All roles</option>{roles.map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
            <label className="block"><span className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600"><MapPin className="h-3.5 w-3.5" />Location</span><select value={selectedCity ?? ''} onChange={(event) => onCityChange(event.target.value || null)} className="select min-h-12 rounded-xl border-slate-200 bg-slate-100 dark:border-slate-700"><option value="">Anywhere</option>{cities.map((city) => <option key={city} value={city}>{city}</option>)}</select></label>
            <div className="mt-6 flex gap-3"><button type="button" onClick={onClearAll} className="min-h-12 flex-1 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 dark:border-slate-700">Clear all</button><button type="button" onClick={() => setMobileOpen(false)} className="min-h-12 flex-1 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700">Show results</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
