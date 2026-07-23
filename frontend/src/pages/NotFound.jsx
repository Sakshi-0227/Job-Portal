import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="rounded-xl bg-white p-8 shadow-sm text-center">
    <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
    <p className="mt-4 text-slate-600">The page you are looking for does not exist.</p>
    <Link to="/" className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800">
      Return home
    </Link>
  </div>
);

export default NotFound;
