import React from "react";
import { Link } from "react-router-dom";

import {
  FiArrowUpRight,
  FiHeart,
  FiArrowUp,
} from "react-icons/fi";

import { TbSocial } from "react-icons/tb";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative w-full border-t border-slate-200 bg-white text-slate-900 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-blue-50 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-slate-100 blur-[130px]" />
      </div>

      {/* Main Footer */}
      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-8">

        {/* Top Content */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">

          {/* Brand */}
          <div className="sm:col-span-2">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              {/* Logo */}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition-all duration-300 group-hover:bg-slate-800">
                <TbSocial size={25} />
              </div>

              {/* Name */}
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Socia<span className="text-blue-600">la</span>
              </span>
            </Link>

            <p className="mt-6 max-w-md leading-relaxed text-slate-500">
              A place to share ideas, connect with people, join conversations,
              and discover new perspectives.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">
              Platform
            </h3>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/explore"
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  Explore
                </Link>
              </li>

              <li>
                <Link
                  to="/signup"
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">
              Company
            </h3>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="relative mt-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-50 blur-[100px]" />

          <div className="relative flex flex-col gap-7 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-9">

            <div>
              <div className="mb-3 inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" />

                <span className="text-xs font-medium uppercase tracking-widest text-blue-600">
                  Join the community
                </span>
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                Have something to share?
              </h3>

              <p className="mt-2 text-sm text-slate-500 md:text-base">
                Share your ideas and become part of the conversation.
              </p>
            </div>

            <Link
              to="/signup"
              className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-slate-900 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-slate-700"
            >
              Create Account

              <FiArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-slate-200 pt-7 md:flex-row">

          {/* Copyright */}
          <p className="text-center text-xs text-slate-400 sm:text-sm md:text-left">
            © {new Date().getFullYear()} Sociala. All rights reserved.
          </p>

          {/* Made With */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 sm:text-sm">
            <span>Made with</span>

            <FiHeart
              className="text-blue-600"
              size={13}
              fill="currentColor"
            />

            <span>for meaningful connections.</span>
          </div>

          {/* Back To Top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-xs text-slate-500 transition-colors hover:text-slate-900 sm:text-sm"
          >
            Back to top

            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white transition-all group-hover:border-slate-300 group-hover:bg-slate-50">
              <FiArrowUp
                size={14}
                className="transition-transform group-hover:-translate-y-0.5"
              />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;