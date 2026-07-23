import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-slate-900 text-white shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-4">
        <div>
          <NavLink to="/" className="text-xl font-semibold">
            Job Portal
          </NavLink>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <NavLink to="/" className="hover:underline">
            Home
          </NavLink>
          <NavLink to="/jobs" className="hover:underline">
            Browse Jobs
          </NavLink>
          {user ? (
            <>
              {user.role === "candidate" ? (
                <>
                  <NavLink to="/candidate/dashboard" className="hover:underline">
                    Dashboard
                  </NavLink>
                  <NavLink to="/applications" className="hover:underline">
                    Applications
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/recruiter/dashboard" className="hover:underline">
                    Dashboard
                  </NavLink>
                  <NavLink to="/recruiter/jobs" className="hover:underline">
                    My Jobs
                  </NavLink>
                  <NavLink to="/recruiter/post-job" className="hover:underline">
                    Post Job
                  </NavLink>
                </>
              )}
              <NavLink to="/profile" className="hover:underline">
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="rounded bg-slate-200 px-3 py-2 text-slate-900 transition hover:bg-slate-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:underline">
                Login
              </NavLink>
              <NavLink to="/register" className="hover:underline">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
