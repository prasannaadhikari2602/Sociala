import React from "react";
import { NavLink } from "react-router-dom";

import {
  FiArrowRight,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiUsers,
  FiCompass,
  FiEdit3,
  FiUserPlus,
} from "react-icons/fi";

import { HiOutlineSparkles } from "react-icons/hi2";
import { TbSocial } from "react-icons/tb";

const Home = () => {
  return (
    <div className="w-full min-w-0 bg-white text-slate-900 overflow-x-hidden">

      {/* =========================================================
          01. HERO SECTION
      ========================================================== */}
      <section className="relative min-h-[calc(100vh-80px)] w-full bg-white flex items-center overflow-hidden">

        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[140px]" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full min-w-0 px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-w-0">

            {/* LEFT CONTENT */}
            <div className="min-w-0">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-sm font-medium">
                <HiOutlineSparkles size={16} />
                <span>Connect. Share. Discover.</span>
              </div>

              {/* Heading */}
              <h1 className="mt-7 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                Your ideas
                <br />
                <span className="text-blue-600">deserve to be</span>
                <br />
                shared.
              </h1>

              {/* Description */}
              <p className="mt-7 max-w-xl text-lg text-slate-500 leading-relaxed">
                Create posts, share your thoughts, comment on ideas, react to
                content, follow interesting people, and discover new
                perspectives.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-9">

                <NavLink
                  to="/signup"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-700 transition"
                >
                  Get Started
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </NavLink>

                <NavLink
                  to="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  Explore
                  <FiCompass />
                </NavLink>

              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-6 mt-10 text-sm text-slate-500">

                <div className="flex items-center gap-2">
                  <FiUsers className="text-blue-600" />
                  Follow people
                </div>

                <div className="flex items-center gap-2">
                  <FiMessageCircle className="text-blue-600" />
                  Comment on posts
                </div>

              </div>
            </div>

            {/* RIGHT POST PREVIEW */}
            <div className="relative hidden md:block min-w-0">

              <div className="absolute -inset-8 bg-blue-500/10 blur-3xl rounded-full" />

              <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">

                {/* User */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      JD
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        John Doe
                      </h3>

                      <p className="text-sm text-slate-400">
                        @johndoe · 2h
                      </p>
                    </div>

                  </div>

                  <button className="text-slate-400 hover:text-slate-600">
                    •••
                  </button>

                </div>

                {/* Post */}
                <div className="mt-6">

                  <h2 className="text-xl font-semibold text-slate-900">
                    Building something meaningful 🚀
                  </h2>

                  <p className="mt-3 text-slate-500 leading-relaxed">
                    Great ideas become even better when people share their
                    thoughts, leave comments, and build on each other's ideas.
                  </p>

                </div>

                {/* Post Image */}
                <div className="relative mt-6 h-52 rounded-2xl overflow-hidden border border-blue-100 bg-linear-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">

                  <div className="absolute w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

                  <div className="relative text-center">

                    <HiOutlineSparkles
                      className="mx-auto text-blue-600"
                      size={45}
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Ideas grow when shared.
                    </p>

                  </div>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 mt-5 pt-5 border-t border-slate-100">

                  <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition">
                    <FiHeart size={19} />
                    <span className="text-sm">128</span>
                  </button>

                  <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition">
                    <FiMessageCircle size={19} />
                    <span className="text-sm">32</span>
                  </button>

                  <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition">
                    <FiShare2 size={19} />
                    <span className="text-sm">18</span>
                  </button>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          02. WHAT IS THE PLATFORM?
      ========================================================== */}
      <section className="relative min-h-[calc(100vh-80px)] w-full bg-slate-50 flex items-center border-t border-slate-200 overflow-hidden">

        <div className="max-w-7xl mx-auto w-full min-w-0 px-6 lg:px-8 py-20">

          <div className="grid lg:grid-cols-2 gap-16 items-center min-w-0">

            {/* LEFT CONTENT */}
            <div className="min-w-0">

              <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">
                What is Sociala?
              </span>

              <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                A place where
                <br />
                <span className="text-blue-600">
                  ideas are shared.
                </span>
              </h2>

              <p className="mt-7 text-lg text-slate-600 leading-relaxed max-w-xl">
                Sociala is a social platform built around sharing,
                discovering, and connecting through public interactions.
              </p>

              <p className="mt-5 text-slate-500 leading-relaxed max-w-xl">
                Create posts, respond through comments, react to content,
                follow people you find interesting, share posts, and discover
                new topics and perspectives.
              </p>

              <NavLink
                to="/signup"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-700 transition"
              >
                Join Sociala
                <FiArrowRight />
              </NavLink>

            </div>

            {/* RIGHT FEATURES */}
            <div className="grid sm:grid-cols-2 gap-5 min-w-0">

              {/* Create */}
              <div className="p-7 rounded-3xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition min-w-0">

                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiEdit3 size={27} />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Create
                </h3>

                <p className="mt-3 text-slate-500 leading-relaxed">
                  Share your thoughts, stories, questions, and ideas with the
                  community.
                </p>

              </div>

              {/* Comment */}
              <div className="p-7 rounded-3xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition sm:mt-8 min-w-0">

                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiMessageCircle size={27} />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Comment
                </h3>

                <p className="mt-3 text-slate-500 leading-relaxed">
                  Share your thoughts and participate in public discussions
                  under posts.
                </p>

              </div>

              {/* Connect */}
              <div className="p-7 rounded-3xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition min-w-0">

                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiUsers size={27} />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Connect
                </h3>

                <p className="mt-3 text-slate-500 leading-relaxed">
                  Follow people and build your network around shared
                  interests.
                </p>

              </div>

              {/* Discover */}
              <div className="p-7 rounded-3xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition sm:mt-8 min-w-0">

                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiCompass size={27} />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Discover
                </h3>

                <p className="mt-3 text-slate-500 leading-relaxed">
                  Explore new people, posts, topics, and perspectives.
                </p>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          03. HOW IT WORKS
      ========================================================== */}
      <section className="relative min-h-[calc(100vh-80px)] w-full bg-white flex items-center border-t border-slate-200 overflow-hidden">

        <div className="max-w-7xl mx-auto w-full min-w-0 px-6 lg:px-8 py-20">

          {/* Heading */}
          <div className="max-w-3xl mx-auto text-center">

            <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">
              How it works
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold">
              Start sharing in
              <br />
              <span className="text-blue-600">
                four simple steps.
              </span>
            </h2>

            <p className="mt-5 text-lg text-slate-500">
              Create your account, share your ideas, interact with posts, and
              build your network.
            </p>

          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 min-w-0">

            {/* 01 */}
            <div className="relative p-7 rounded-3xl border border-slate-200 bg-white hover:shadow-md transition min-w-0">

              <div className="flex items-center justify-between">

                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiUserPlus size={25} />
                </div>

                <span className="text-5xl font-bold text-slate-100">
                  01
                </span>

              </div>

              <h3 className="mt-7 text-xl font-semibold">
                Create an account
              </h3>

              <p className="mt-3 text-slate-500 leading-relaxed">
                Sign up and create your profile to become part of the Sociala
                community.
              </p>

            </div>

            {/* 02 */}
            <div className="relative p-7 rounded-3xl border border-slate-200 bg-white hover:shadow-md transition min-w-0">

              <div className="flex items-center justify-between">

                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiEdit3 size={25} />
                </div>

                <span className="text-5xl font-bold text-slate-100">
                  02
                </span>

              </div>

              <h3 className="mt-7 text-xl font-semibold">
                Create a post
              </h3>

              <p className="mt-3 text-slate-500 leading-relaxed">
                Share your thoughts, experiences, questions, images, or
                anything worth sharing.
              </p>

            </div>

            {/* 03 */}
            <div className="relative p-7 rounded-3xl border border-slate-200 bg-white hover:shadow-md transition min-w-0">

              <div className="flex items-center justify-between">

                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiHeart size={25} />
                </div>

                <span className="text-5xl font-bold text-slate-100">
                  03
                </span>

              </div>

              <h3 className="mt-7 text-xl font-semibold">
                Interact
              </h3>

              <p className="mt-3 text-slate-500 leading-relaxed">
                React to posts, leave comments, and share content that
                interests you.
              </p>

            </div>

            {/* 04 */}
            <div className="relative p-7 rounded-3xl border border-slate-200 bg-white hover:shadow-md transition min-w-0">

              <div className="flex items-center justify-between">

                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiUsers size={25} />
                </div>

                <span className="text-5xl font-bold text-slate-100">
                  04
                </span>

              </div>

              <h3 className="mt-7 text-xl font-semibold">
                Build connections
              </h3>

              <p className="mt-3 text-slate-500 leading-relaxed">
                Follow people, discover interesting content, and grow your
                network.
              </p>

            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          04. EVERYTHING IN ONE PLACE
      ========================================================== */}
      <section className="relative min-h-[calc(100vh-80px)] w-full bg-slate-50 flex items-center border-t border-slate-200 overflow-hidden">

        <div className="max-w-7xl mx-auto w-full min-w-0 px-6 lg:px-8 py-20">

          {/* Heading */}
          <div className="max-w-3xl mx-auto text-center">

            <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">
              Everything in one place
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold">
              Everything you need
              <br />
              <span className="text-blue-600">
                to be social.
              </span>
            </h2>

            <p className="mt-5 text-lg text-slate-500">
              Create, interact, connect, share, and discover through one
              simple social platform.
            </p>

          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 min-w-0">

            {/* Posts */}
            <div className="group p-7 rounded-3xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition min-w-0">

              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FiEdit3 size={27} />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Posts
              </h3>

              <p className="mt-3 text-slate-500 leading-relaxed">
                Create posts and share your thoughts, stories, questions,
                images, and ideas.
              </p>

            </div>

            {/* Comments */}
            <div className="group p-7 rounded-3xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition min-w-0">

              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FiMessageCircle size={27} />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Comments
              </h3>

              <p className="mt-3 text-slate-500 leading-relaxed">
                Join public discussions by commenting on posts and sharing
                your perspective.
              </p>

            </div>

            {/* Reactions */}
            <div className="group p-7 rounded-3xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition min-w-0">

              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FiHeart size={27} />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Reactions
              </h3>

              <p className="mt-3 text-slate-500 leading-relaxed">
                React to posts and show your appreciation for content you
                enjoy.
              </p>

            </div>

            {/* Follow */}
            <div className="group p-7 rounded-3xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition min-w-0">

              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FiUsers size={27} />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Follow
              </h3>

              <p className="mt-3 text-slate-500 leading-relaxed">
                Follow interesting people and personalize the content you
                see in your feed.
              </p>

            </div>

            {/* Share */}
            <div className="group p-7 rounded-3xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition min-w-0">

              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FiShare2 size={27} />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Share
              </h3>

              <p className="mt-3 text-slate-500 leading-relaxed">
                Share interesting posts with your network and help great
                ideas reach more people.
              </p>

            </div>

            {/* Explore */}
            <div className="group p-7 rounded-3xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition min-w-0">

              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FiCompass size={27} />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Explore
              </h3>

              <p className="mt-3 text-slate-500 leading-relaxed">
                Discover posts, people, topics, and perspectives beyond
                your regular feed.
              </p>

            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          05. FINAL CTA
      ========================================================== */}
      <section className="relative min-h-[calc(100vh-80px)] w-full bg-white flex items-center border-t border-slate-200 overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-500/10 blur-[150px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto w-full min-w-0 px-6 py-20">

          <div className="relative overflow-hidden rounded-4xl border border-blue-200 bg-blue-50 px-8 py-20 md:px-16 text-center">

            {/* Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 text-white flex items-center justify-center">
              <TbSocial size={30} />
            </div>

            {/* Heading */}
            <h2 className="mt-8 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">

              Your voice.
              <br />

              <span className="text-blue-600">
                Your community.
              </span>

            </h2>

            {/* Description */}
            <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-600 leading-relaxed">
              Share what matters to you, discover new perspectives, follow
              interesting people, and take part in public discussions through
              posts and comments.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-9">

              <NavLink
                to="/signup"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-700 transition"
              >
                Create Account
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </NavLink>

              <NavLink
                to="/explore"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Start Exploring
                <FiCompass />
              </NavLink>

            </div>

            {/* Small Text */}
            <p className="mt-7 text-sm text-slate-400">
              Create. Comment. React. Follow. Share. Discover.
            </p>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

