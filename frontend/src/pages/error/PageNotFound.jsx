import React from "react";
import { Link } from "react-router-dom";

import {
  FiArrowLeft,
  FiHome,
  FiSearch,
} from "react-icons/fi";

import { TbSocial } from "react-icons/tb";

const NotFound = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white text-slate-900">

      {/* =========================================================
          BACKGROUND
      ========================================================== */}
      <div className="pointer-events-none absolute inset-0">

        {/* Blue Glow */}
        <div className="absolute left-[15%] top-[15%] h-72 w-72 rounded-full bg-blue-500/10 blur-[130px]" />

        <div className="absolute bottom-[10%] right-[10%] h-96 w-96 rounded-full bg-blue-400/5 blur-[150px]" />

        {/* Center Glow */}
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]" />

      </div>


      {/* =========================================================
          CONTENT
      ========================================================== */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-12 sm:py-16">

        <div className="flex flex-col items-center text-center">


          {/* =====================================================
              ICON
          ====================================================== */}
          <div className="relative">

            {/* Icon Glow */}
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-100 bg-blue-50 text-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.08)] sm:h-24 sm:w-24">

              <TbSocial
                size={42}
                strokeWidth={1.5}
              />

            </div>

          </div>


          {/* =====================================================
              404
          ====================================================== */}
          <div className="relative mt-8">

            <p
              className="
                select-none
                text-[110px]
                font-black
                leading-none
                tracking-[-0.08em]
                text-slate-900/[0.035]
                sm:text-[150px]
                md:text-[190px]
                lg:text-[220px]
              "
            >
              404
            </p>


            {/* Blue Line */}
            <div className="absolute bottom-3 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-blue-600" />

          </div>


          {/* =====================================================
              MESSAGE
          ====================================================== */}
          <div className="relative -mt-8 sm:-mt-12 md:-mt-16">

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
              Page not found.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Looks like this page wandered away from the
              conversation. Don't worry — let's get you back
              to where you belong.
            </p>


            {/* =================================================
                BUTTONS
            ================================================== */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">

              {/* Home */}
              <Link
                to="/"
                className="
                  group
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-6
                  py-3.5
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-slate-700
                  sm:w-auto
                "
              >

                <FiHome size={18} />

                Back to Home

                <FiArrowLeft
                  size={17}
                  className="
                    order-first
                    transition-transform
                    group-hover:-translate-x-1
                  "
                />

              </Link>

            </div>


            {/* =================================================
                SEARCH SUGGESTION
            ================================================== */}
            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-400">

              <FiSearch size={15} />

              <span>
                Try exploring something new
              </span>

            </div>


            {/* =================================================
                BRAND MESSAGE
            ================================================== */}
            <div className="mt-8 flex items-center justify-center gap-3">

              <div className="h-px w-12 bg-slate-200" />

              <span className="text-xs uppercase tracking-widest text-slate-400">
                Create · Connect · Share · Discover
              </span>

              <div className="h-px w-12 bg-slate-200" />

            </div>

          </div>

        </div>

      </div>


      {/* =========================================================
          DECORATIVE CORNERS
      ========================================================== */}

      <div className="absolute left-8 top-8 h-12 w-12 border-l border-t border-slate-200/70" />

      <div className="absolute right-8 top-8 h-12 w-12 border-r border-t border-slate-200/70" />

      <div className="absolute bottom-8 left-8 h-12 w-12 border-b border-l border-slate-200/70" />

      <div className="absolute bottom-8 right-8 h-12 w-12 border-b border-r border-slate-200/70" />

    </section>
  );
};

export default NotFound;