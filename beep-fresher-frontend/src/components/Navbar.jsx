import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, List, BarChart3, RefreshCw } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-silzila-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">J</span>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              Jobs<span className="text-silzila-600">India</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <navLink
              to="/"
              label="Jobs"
              icon={<Home className="w-4 h-4" />}
              activeClass="text-silzila-600"
            />
            <navLink
              to="/stats"
              label="Stats"
              icon={<BarChart3 className="w-4 h-4" />}
              activeClass="text-silzila-600"
            />
            <a
              href="/admin/refresh"
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin/refresh");
              }}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </a>
          </div>

          <button
            className="md:hidden flex items-center gap-1 p-2 text-slate-600 hover:bg-slate-100 rounded-md"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-4 space-y-4">
            <navLink
              to="/"
              label="Jobs"
              icon={<Home className="w-4 h-4" />}
              onClick={() => setIsOpen(false)}
            />
            <navLink
              to="/stats"
              label="Stats"
              icon={<BarChart3 className="w-4 h-4" />}
              onClick={() => setIsOpen(false)}
            />
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/admin/refresh");
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Data
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function navLink({
  to,
  label,
  icon,
  activeClass,
  onClick,
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(to);
        onClick?.();
      }}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
        activeClass || "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
