import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
        Connect. Share. Belong.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-slate-500">
        Sociala is where your community keeps up with each other — join in a
        couple of minutes.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <NavLink
          to="/signup"
          className="rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700"
        >
          Get started
        </NavLink>
        <NavLink
          to="/explore"
          className="rounded-md border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Explore
        </NavLink>
      </div>
    </section>
  );
};

export default Home;