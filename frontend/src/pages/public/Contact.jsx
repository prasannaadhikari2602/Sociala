import React from "react";
import { Link } from "react-router-dom";

import {
  FiArrowRight,
  FiMail,
  FiMessageCircle,
  FiAlertCircle,
  FiHelpCircle,
  FiSend,
  FiCompass,
} from "react-icons/fi";

import { TbSocial } from "react-icons/tb";

const Contact = () => {
  return (
    <main className="w-full min-w-0 overflow-x-hidden bg-white text-slate-900">

      {/* =========================================================
          01 — CONTACT INTRODUCTION
      ========================================================== */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">

        {/* Background Glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-400/5 blur-[140px]" />
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">

          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">

            {/* LEFT */}
            <div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                <FiMail size={16} />
                <span>Contact Sociala</span>
              </div>

              {/* Heading */}
              <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Let's hear
                <br />
                <span className="text-blue-600">
                  from you.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-500 md:text-xl">
                Have feedback, found a bug, or have an idea for Sociala?
                We'd love to hear what you think.
              </p>

              <p className="mt-5 max-w-xl leading-relaxed text-slate-500">
                Tell us what you need help with, what could be improved,
                or what you'd like to see on the platform.
              </p>

              {/* Buttons */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <a
                  href="#contact-form"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-slate-700"
                >
                  Contact Us

                  <FiArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>

                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <FiCompass size={18} />
                  Explore Sociala
                </Link>

              </div>

            </div>


            {/* RIGHT */}
            <div className="relative">

              <div className="absolute -inset-8 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">

                {/* Card Header */}
                <div className="flex items-center justify-between gap-5">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                      Sociala Support
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                      How can we help?
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                    <TbSocial size={25} />
                  </div>

                </div>


                {/* Support Options */}
                <div className="mt-8 space-y-4">

                  {/* Feedback */}
                  <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiMessageCircle size={20} />
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-900">
                        General Feedback
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Tell us what you think.
                      </p>
                    </div>

                  </div>


                  {/* Bug */}
                  <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiAlertCircle size={20} />
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-900">
                        Report a Bug
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Found something that isn't working?
                      </p>
                    </div>

                  </div>


                  {/* Feature */}
                  <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiArrowRight size={20} />
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-900">
                        Feature Suggestion
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Have an idea for Sociala?
                      </p>
                    </div>

                  </div>


                  {/* Account */}
                  <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiHelpCircle size={20} />
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-900">
                        Account Help
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Need help with your account?
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          02 — CONTACT FORM
      ========================================================== */}
      <section
        id="contact-form"
        className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      >

        {/* Background Glow */}
        <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">

          <div className="grid items-start gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

            {/* LEFT */}
            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Get in touch
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Tell us
                <br />
                <span className="text-blue-600">
                  what's on your mind.
                </span>
              </h2>

              <p className="mt-7 text-lg leading-relaxed text-slate-500">
                Whether you have feedback, need help, or want to suggest
                an improvement, your message can help make Sociala better.
              </p>


              {/* Feedback Info */}
              <div className="mt-10 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <TbSocial size={21} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Your feedback matters
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      Sociala is built around its community. Your
                      suggestions and feedback can help shape future
                      improvements.
                    </p>
                  </div>

                </div>

              </div>


              {/* Email */}
              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiMail size={20} />
                </div>

                <div className="min-w-0">

                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-slate-700">
                    support@sociala.com
                  </p>

                </div>

              </div>

            </div>


            {/* FORM */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">

              <form className="space-y-6">

                {/* Name */}
                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Your Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>


                {/* Email */}
                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>


                {/* Subject */}
                <div>

                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Subject
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-600 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >

                    <option value="" disabled>
                      Select a topic
                    </option>

                    <option value="feedback">
                      General Feedback
                    </option>

                    <option value="bug">
                      Report a Bug
                    </option>

                    <option value="feature">
                      Feature Suggestion
                    </option>

                    <option value="account">
                      Account Help
                    </option>

                    <option value="other">
                      Other
                    </option>

                  </select>

                </div>


                {/* Message */}
                <div>

                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Write your message..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                </div>


                {/* Submit */}
                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-slate-700 active:scale-[0.99]"
                >
                  Send Message

                  <FiSend
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <p className="text-center text-xs text-slate-400">
                  We'll use your email only to respond to your request.
                </p>

              </form>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          03 — CONTACT TOPICS
      ========================================================== */}
      <section className="relative overflow-hidden bg-white">

        {/* Background */}
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/5 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">

          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Contact Topics
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              What can we
              <br />
              <span className="text-blue-600">
                help you with?
              </span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-500">
              Choose the type of request that best describes what
              you want to tell us.
            </p>

          </div>


          {/* Cards */}
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Feedback */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FiMessageCircle size={26} />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Feedback
              </h3>

              <p className="mt-3 leading-relaxed text-slate-500">
                Tell us what you like, what you don't like, or how
                we can improve Sociala.
              </p>

            </div>


            {/* Bug */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FiAlertCircle size={26} />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Bug Report
              </h3>

              <p className="mt-3 leading-relaxed text-slate-500">
                Found something broken? Tell us what happened so
                we can investigate it.
              </p>

            </div>


            {/* Feature */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FiArrowRight size={26} />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Feature Ideas
              </h3>

              <p className="mt-3 leading-relaxed text-slate-500">
                Have an idea that could make Sociala more useful?
                Share it with us.
              </p>

            </div>


            {/* Account */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FiHelpCircle size={26} />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Account Help
              </h3>

              <p className="mt-3 leading-relaxed text-slate-500">
                Need assistance with your account or another
                Sociala feature?
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          04 — FAQ
      ========================================================== */}
      <section className="relative overflow-hidden border-y border-slate-200 bg-slate-50">

        {/* Background */}
        <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[140px]" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 lg:px-8 lg:py-28">

          {/* Heading */}
          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Quick Answers
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Before you
              <span className="text-blue-600">
                {" "}contact us.
              </span>
            </h2>

            <p className="mt-5 text-lg text-slate-500">
              Here are a few things you may want to know first.
            </p>

          </div>


          {/* FAQ Items */}
          <div className="mt-14 space-y-4">

            {/* FAQ 1 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">

              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiHelpCircle />
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    How do I report a problem?
                  </h3>

                  <p className="mt-2 leading-relaxed text-slate-500">
                    Use the contact form and select "Report a Bug".
                    Describe what happened and include enough detail
                    for us to understand the issue.
                  </p>

                </div>

              </div>

            </div>


            {/* FAQ 2 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">

              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiArrowRight />
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    Can I suggest a new feature?
                  </h3>

                  <p className="mt-2 leading-relaxed text-slate-500">
                    Absolutely. Select "Feature Suggestion" and
                    explain what you'd like Sociala to support and
                    why it would be useful.
                  </p>

                </div>

              </div>

            </div>


            {/* FAQ 3 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">

              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiMail />
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    How will Sociala respond?
                  </h3>

                  <p className="mt-2 leading-relaxed text-slate-500">
                    If your request requires a response, we'll use
                    the email address you provide in the contact form.
                  </p>

                </div>

              </div>

            </div>


            {/* FAQ 4 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">

              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiAlertCircle />
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    Is the contact form public?
                  </h3>

                  <p className="mt-2 leading-relaxed text-slate-500">
                    No. The contact form is for contacting the Sociala
                    team about support, feedback, bugs, and suggestions.
                    It is separate from public posts and comments.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          05 — FINAL CTA
      ========================================================== */}
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
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            We're listening
          </p>

          {/* Heading */}
          <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Have something
            <br />
            <span className="text-blue-600">
              to share?
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-500">
            Your feedback, ideas, and suggestions can help Sociala
            become a better place to share, discover, and connect.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="#contact-form"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Send a Message

              <FiArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <FiCompass size={18} />
              Explore Sociala
            </Link>

          </div>

          {/* Bottom */}
          <p className="mt-10 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
            Feedback · Bugs · Ideas · Support
          </p>

        </div>

      </section>

    </main>
  );
};

export default Contact;