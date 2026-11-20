interface RoleChipProps {
  role: string | null;
}

const ROLE_TONES: Record<string, string> = {
  'Software Developer': 'role-indigo',
  'Web Developer': 'role-indigo',
  'Frontend Developer': 'role-indigo',
  'Backend Developer': 'role-indigo',
  'Full Stack Developer': 'role-indigo',
  'Mobile Developer': 'role-indigo',
  'Android Developer': 'role-indigo',
  'iOS Developer': 'role-indigo',
  SWE: 'role-indigo',
  'Data Scientist': 'role-teal',
  'Data Analyst': 'role-teal',
  'Data Engineer': 'role-teal',
  'Machine Learning Engineer': 'role-teal',
  'AI Engineer': 'role-teal',
  'DevOps Engineer': 'role-sky',
  'Cloud Engineer': 'role-sky',
  'QA Engineer': 'role-amber',
  'Test Automation Engineer': 'role-amber',
  'UX Designer': 'role-pink',
  'UI Designer': 'role-pink',
  'Graphic Designer': 'role-pink',
  'Digital Marketing': 'role-orange',
  'SEO Specialist': 'role-orange',
  'Content Writer': 'role-orange',
  'Sales Executive': 'role-green',
  'Customer Support': 'role-green',
  Operations: 'role-slate',
  'HR Recruiter': 'role-violet',
  'Product Manager': 'role-violet',
  'Project Manager': 'role-violet',
  'Business Analyst': 'role-violet',
  Finance: 'role-lime',
  Other: 'role-gray',
};

export function RoleChip({ role }: RoleChipProps): JSX.Element | null {
  if (!role) return null;
  const tone = ROLE_TONES[role] ?? 'role-gray';

  return <span className={`role-chip ${tone}`}>{role}</span>;
}
