import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/explore", label: "Explore" },
];

const linkClasses = ({ isActive }) =>
  `text-sm transition-colors ${
    isActive ? "text-slate-900 font-medium" : "text-slate-500 hover:text-slate-900"
  }`;

const VisitorNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="text-lg font-semibold text-slate-900">
          Sociala
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <NavLink
            to="/login"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Log in
          </NavLink>
          <NavLink
            to="/signup"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Sign up
          </NavLink>
        </div>

        <button
          type="button"
          className="text-2xl text-slate-700 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-slate-200 px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClasses}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/login" className={linkClasses} onClick={() => setOpen(false)}>
            Log in
          </NavLink>
          <NavLink to="/signup" className={linkClasses} onClick={() => setOpen(false)}>
            Sign up
          </NavLink>
        </nav>
      )}
    </header>
  );
};

export default VisitorNavbar;