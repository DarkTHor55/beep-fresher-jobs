import { useParams, useNavigate } from 'react-router-dom';

export function JobDetailPage(): JSX.Element {
  const { id: _id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-bg-secondary">
      <div className="container px-4 py-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-accent-600 dark:text-accent-400"
        >
          Back
        </button>
      </div>
    </div>
  );
}
