import React from "react";

import {
  FiArrowRight,
  FiMail,
  FiMessageCircle,
  FiAlertCircle,
  FiHelpCircle,
} from "react-icons/fi";

import { TbSocial } from "react-icons/tb";


const Contact = () => {
  return (
    <main className="w-full min-w-0 overflow-x-hidden bg-white text-slate-900">

      {/* Contact Introduction */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-400/5 blur-[140px]" />
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                <FiMail size={16} />
                <span>Contact Sociala</span>
              </div>

              <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Let's hear
                <br />
                <span className="text-blue-600">from you.</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-500 md:text-xl">
                Have feedback, found a bug, or have an idea for Sociala?
                We'd love to hear what you think.
              </p>

              <p className="mt-5 max-w-xl leading-relaxed text-slate-500">
                Tell us what you need help with, what could be improved,
                or what you'd like to see on the platform.
              </p>

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
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
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

                <div className="mt-8 space-y-4">

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


      {/* Contact Email */}
      <section
        id="contact-form"
        className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      >
        <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[140px]" />

        <div className="relative mx-auto max-w-2xl px-6 py-24 text-center lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Get in touch
          </p>

          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Tell us
            <br />
            <span className="text-blue-600">what's on your mind.</span>
          </h2>

          <p className="mt-7 text-lg leading-relaxed text-slate-500">
            Whether you have feedback, need help, or want to suggest
            an improvement, send us an email and we'll get back to you.
          </p>

          <a
            href="mailto:support@sociala.com"
            className="group mt-10 flex items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/40"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiMail size={22} />
            </div>

            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Email us at
              </p>

              <p className="mt-1 text-lg font-medium text-slate-900 group-hover:text-blue-600">
                support@sociala.com
              </p>
            </div>
          </a>

          <p className="mt-6 text-sm text-slate-400">
            We typically respond within 1–2 business days.
          </p>
        </div>
      </section>


      {/* Contact Topics */}
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/5 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Contact Topics
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              What can we
              <br />
              <span className="text-blue-600">help you with?</span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-500">
              Choose the type of request that best describes what
              you want to tell us.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

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


      {/* FAQ */}
      <section className="relative overflow-hidden border-y border-slate-200 bg-slate-50">
        <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[140px]" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 lg:px-8 lg:py-28">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Quick Answers
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Before you
              <span className="text-blue-600"> contact us.</span>
            </h2>

            <p className="mt-5 text-lg text-slate-500">
              Here are a few things you may want to know first.
            </p>
          </div>

          <div className="mt-14 space-y-4">

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
                    Email us and describe what happened. Include
                    enough detail for us to understand and reproduce
                    the issue.
                  </p>
                </div>
              </div>
            </div>

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
                    Absolutely. Email us and explain what you'd like
                    Sociala to support and why it would be useful.
                  </p>
                </div>
              </div>
            </div>

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
                    We'll reply directly to the email address you
                    contact us from.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiAlertCircle />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Is my email kept private?
                  </h3>

                  <p className="mt-2 leading-relaxed text-slate-500">
                    Yes. Messages sent to our support address are
                    used only to respond to your request and are
                    separate from public posts and comments.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center lg:py-32">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
            <TbSocial size={30} />
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            We're listening
          </p>

          <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Have something
            <br />
            <span className="text-blue-600">to share?</span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-500">
            Your feedback, ideas, and suggestions can help Sociala
            become a better place to share, discover, and connect.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="mailto:support@sociala.com"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Send a Message

              <FiArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
            Feedback · Bugs · Ideas · Support
          </p>
        </div>
      </section>

    </main>
  );
};


export default Contact;
