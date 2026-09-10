import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiX,
  FiUserPlus,
} from "react-icons/fi";

import { SignupSchema } from "../../validators/SignupSchema";
import { useSignupMutation } from "../../features/auth/authApi";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [signup, { isLoading }] = useSignupMutation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (values) => {
    try {
      await signup({
        username: values.username,
        email: values.email,
        password: values.password,
        password2: values.password2,
      }).unwrap();

      navigate("/email-verify", {
        replace: true,
        state: {
          email: values.email,
        },
      });
    } catch (err) {
      const fieldErrors =
        err?.data && typeof err.data === "object"
          ? err.data
          : {};

      const firstFieldError = Object.values(fieldErrors)[0];

      const message = Array.isArray(firstFieldError)
        ? firstFieldError[0]
        : firstFieldError ||
          "Something went wrong. Please try again.";

      setError("root", {
        message,
      });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-white px-4 py-10 sm:px-6">

      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-400/10 blur-[120px]" />
      </div>

      {/* Signup Container */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">

        {/* Signup Card */}
        <div className="relative w-full rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-xl sm:px-8 sm:py-9">

          {/* Close Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close signup page"
          >
            <FiX size={20} />
          </button>

          {/* Header */}
          <div className="text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
              <FiUserPlus size={24} />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Join{" "}
              <span className="font-medium text-blue-600">
                Sociala
              </span>{" "}
              in under a minute.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
            noValidate
          >

            {/* Server Error */}
            {errors.root && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errors.root.message}
              </div>
            )}

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Choose a username"
                {...register("username")}
                className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition ${
                  errors.username
                    ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                    : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                }`}
              />

              {errors.username && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition ${
                  errors.email
                    ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                    : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                }`}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  {...register("password")}
                  className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition ${
                    errors.password
                      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                      : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition-colors hover:text-slate-700"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="password2"
                className="block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>

              <div className="relative mt-2">
                <input
                  id="password2"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  {...register("password2")}
                  className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition ${
                    errors.password2
                      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                      : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition-colors hover:text-slate-700"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>

              {errors.password2 && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.password2.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "Creating account..."
                : "Create account"}

              {!isLoading && (
                <FiUserPlus
                  size={17}
                  className="transition-transform group-hover:scale-105"
                />
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-semibold text-blue-600 transition-colors hover:text-slate-900"
              >
                Log in
              </NavLink>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Signup;