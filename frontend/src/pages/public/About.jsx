import React from "react";
import { Link } from "react-router-dom";

import {
  FiArrowRight,
  FiTarget,
  FiUsers,
  FiMessageCircle,
  FiHeart,
  FiShare2,
  FiCompass,
  FiEdit3,
  FiGlobe,
  FiCheck,
} from "react-icons/fi";

import { TbSocial } from "react-icons/tb";

const About = () => {
  return (
    <main className="w-full bg-white text-slate-900">

      {/* =====================================================
          01 — WHAT IS SOCIALA
      ====================================================== */}
      <section className="relative overflow-hidden bg-slate-50">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-400/5 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* Left Content */}
            <div>

              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                What is Sociala?
              </span>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Social interaction,
                <br />
                <span className="text-slate-400">
                  without the complexity.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-500">
                Sociala focuses on the core experiences that make
                social platforms useful and enjoyable.
              </p>

              <p className="mt-5 max-w-xl leading-relaxed text-slate-500">
                Users can create posts, comment on discussions,
                react to content, follow people, share posts, and
                discover new perspectives through their activity.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/signup"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-slate-700"
                >
                  Join Sociala

                  <FiArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  <FiCompass size={18} />
                  Explore
                </Link>

              </div>

            </div>

            {/* Right Content */}
            <div className="relative">

              <div className="absolute -inset-5 rounded-full bg-blue-500/5 blur-3xl" />

              <div className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">

                <div className="flex items-center justify-between gap-5">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                      Sociala
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      Everything starts with interaction.
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <TbSocial size={23} />
                  </div>

                </div>

                <div className="mt-8 space-y-3">

                  {[
                    {
                      icon: FiEdit3,
                      title: "Create posts",
                    },
                    {
                      icon: FiMessageCircle,
                      title: "Join conversations",
                    },
                    {
                      icon: FiHeart,
                      title: "React to content",
                    },
                    {
                      icon: FiUsers,
                      title: "Follow people",
                    },
                    {
                      icon: FiShare2,
                      title: "Share interesting posts",
                    },
                  ].map((item) => {

                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                      >

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Icon size={18} />
                        </div>

                        <span className="text-sm font-medium text-slate-700">
                          {item.title}
                        </span>

                      </div>
                    );
                  })}

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          02 — CORE FEATURES
      ====================================================== */}
      <section className="relative overflow-hidden bg-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">

          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center">

            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              The Sociala Experience
            </span>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Built around
              <br />
              <span className="text-slate-400">
                meaningful interaction.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-500">
              Everything on Sociala is centered around creating,
              discovering, and interacting with content.
            </p>

          </div>


          {/* Feature Cards */}
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Create */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiEdit3 size={23} />
              </div>

              <h3 className="mt-7 text-xl font-semibold text-slate-900">
                Create
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Share your thoughts, ideas, experiences, and
                content with the community.
              </p>

            </div>


            {/* React */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiHeart size={23} />
              </div>

              <h3 className="mt-7 text-xl font-semibold text-slate-900">
                React
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Show how you feel about posts and interact with
                content you find interesting.
              </p>

            </div>


            {/* Comment */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiMessageCircle size={23} />
              </div>

              <h3 className="mt-7 text-xl font-semibold text-slate-900">
                Comment
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Add your perspective and participate in public
                conversations.
              </p>

            </div>


            {/* Share */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiShare2 size={23} />
              </div>

              <h3 className="mt-7 text-xl font-semibold text-slate-900">
                Share
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Help interesting content reach more people through
                sharing.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          03 — OUR MISSION
      ====================================================== */}
      <section className="relative overflow-hidden border-y border-slate-200 bg-slate-50">

        {/* Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[140px]" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center lg:py-32">

          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-sm">
            <FiTarget size={27} />
          </div>

          {/* Label */}
          <span className="mt-8 block text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Our Mission
          </span>

          {/* Heading */}
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Make sharing
            <br />
            <span className="text-blue-600">
              simple and social.
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-500 md:text-xl">
            Sociala aims to provide a straightforward platform
            where people can publish content, interact with posts,
            discover others, and build their own social network.
          </p>


          {/* Mission Points */}
          <div className="mt-14 grid gap-4 text-left sm:grid-cols-3">

            {/* Express */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiEdit3 size={20} />
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                Express
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Give your ideas and experiences a place to be seen.
              </p>

            </div>


            {/* Connect */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiUsers size={20} />
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                Connect
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Follow people whose ideas and content interest you.
              </p>

            </div>


            {/* Discover */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiGlobe size={20} />
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                Discover
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Find new posts, people, ideas, and perspectives.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          04 — HOW SOCIALA WORKS
      ====================================================== */}
      <section className="relative bg-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">

          {/* Heading */}
          <div className="max-w-3xl">

            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              How Sociala Works
            </span>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Your activity
              <br />
              <span className="text-slate-400">
                shapes your experience.
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-500">
              Sociala gives users the freedom to build their own
              experience through the people they follow and the
              content they interact with.
            </p>

          </div>


          {/* Steps */}
          <div className="mt-16 grid gap-4 md:grid-cols-5">

            {[
              {
                number: "01",
                icon: FiEdit3,
                title: "Post",
                description: "Share something with the community.",
              },
              {
                number: "02",
                icon: FiMessageCircle,
                title: "Comment",
                description: "Add your thoughts to the discussion.",
              },
              {
                number: "03",
                icon: FiHeart,
                title: "React",
                description: "Interact with content you enjoy.",
              },
              {
                number: "04",
                icon: FiUsers,
                title: "Follow",
                description: "Follow people you want to hear from.",
              },
              {
                number: "05",
                icon: FiShare2,
                title: "Share",
                description: "Help interesting content reach others.",
              },
            ].map((step) => {

              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-medium text-blue-600">
                      {step.number}
                    </span>

                    <Icon
                      size={21}
                      className="text-slate-400"
                    />

                  </div>

                  <h3 className="mt-8 font-semibold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {step.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>


      {/* =====================================================
          05 — OUR VISION
      ====================================================== */}
      <section className="relative overflow-hidden bg-slate-50">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* Left */}
            <div>

              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Our Vision
              </span>

              <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                A community
                <br />
                <span className="text-blue-600">
                  built by its users.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-500">
                We want Sociala to grow around the people who use it.
                Every post, comment, reaction, follow, and share helps
                shape the community.
              </p>

              <p className="mt-5 max-w-xl leading-relaxed text-slate-500">
                The goal isn't simply to have more users. It's to
                create a platform where people can consistently
                discover interesting content and participate in a
                community they enjoy.
              </p>

            </div>


            {/* Right */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FiGlobe size={25} />
              </div>

              <h3 className="mt-7 text-2xl font-semibold text-slate-900">
                What we want Sociala to become
              </h3>

              <div className="mt-8 space-y-5">

                {[
                  "A place where anyone can share their ideas.",
                  "A platform for discovering interesting people and content.",
                  "A community shaped by genuine user interaction.",
                  "A simple social experience without unnecessary complexity.",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >

                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <FiCheck size={12} />
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600">
                      {item}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          06 — FINAL CTA
      ====================================================== */}
      <section className="relative overflow-hidden border-t border-slate-200 bg-white">

        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[150px]" />

        </div>

        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center lg:py-32">

          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
            <TbSocial size={30} />
          </div>

          {/* Label */}
          <span className="mt-8 block text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Join Sociala
          </span>

          {/* Heading */}
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Share your ideas.
            <br />
            <span className="text-blue-600">
              Find your people.
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-slate-500">
            Create posts, interact with the community, follow people,
            share content, and discover something new.
          </p>


          {/* Buttons */}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Create Account

              <FiArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <FiCompass size={18} />
              Explore Sociala
            </Link>

          </div>

          {/* Bottom Text */}
          <p className="mt-10 text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
            Create · Comment · React · Follow · Share
          </p>

        </div>

      </section>

    </main>
  );
};

export default About;