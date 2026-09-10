import { NavLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-slate-400">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-500">
        The page you're looking for doesn't exist or has moved.
      </p>
      <NavLink
        to="/"
        className="mt-6 rounded-md bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
      >
        Back home
      </NavLink>
    </section>
  );
};

export default PageNotFound;