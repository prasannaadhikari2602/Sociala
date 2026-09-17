import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

import {
  FiHome,
  FiInfo,
  FiMail,
  FiLogIn,
  FiUserPlus,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { TbSocial } from "react-icons/tb";

const VisitorNavbar = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", icon: <FiHome /> },
    { name: "About", path: "/about", icon: <FiInfo /> },
    { name: "Contact", path: "/contact", icon: <FiMail /> },
  ];

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 text-sm transition-colors duration-200 ${
      isActive
        ? "text-slate-900 font-medium"
        : "text-slate-500 hover:text-slate-900"
    }`;

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      {/* Main Navbar */}
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5 shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <TbSocial size={21} />
          </div>

          <span className="text-xl font-semibold tracking-tight text-slate-900">
            Socia<span className="text-blue-600">la</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={linkClasses}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-4 md:flex">
          <NavLink
            to="/login"
            className="flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900"
          >
            <FiLogIn size={16} />
            Log in
          </NavLink>

          <NavLink
            to="/signup"
            className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            <FiUserPlus size={16} />
            Sign up
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - Overlay */}
      {open && (
        <div className="absolute left-0 right-0 top-20 z-50 border-t border-slate-200 bg-white shadow-lg md:hidden">
          <nav className="mx-auto max-w-6xl px-6 py-4">

            {/* Navigation Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-center gap-3 rounded-md px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-slate-100 font-medium text-slate-900"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </div>

            {/* Divider */}
            <div className="my-4 h-px bg-slate-200" />

            {/* Authentication */}
            <div className="grid grid-cols-2 gap-3">
              <NavLink
                to="/login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <FiLogIn size={17} />
                Log in
              </NavLink>

              <NavLink
                to="/signup"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                <FiUserPlus size={17} />
                Sign up
              </NavLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default VisitorNavbar;