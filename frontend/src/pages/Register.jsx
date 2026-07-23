import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Register</h2>
      <p className="mt-2 text-slate-600">Create your candidate or recruiter account.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Full Name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Role</span>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </label>
        {error && <p className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="text-slate-900 underline">Login</Link>
      </p>
    </div>
  );
};

export default Register;
