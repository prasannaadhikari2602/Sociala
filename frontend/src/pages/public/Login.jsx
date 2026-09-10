import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiX,
  FiLogIn,
} from "react-icons/fi";

import { LoginSchema } from "../../validators/LoginSchema";
import {
  useLoginMutation,
  useLazyGetMeQuery,
} from "../../features/auth/authApi";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);

  const [login, { isLoading }] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values) => {
    setUnverifiedEmail(null);

    try {
      await login(values).unwrap();

      const user = await getMe().unwrap();

      const redirectTo =
        location.state?.from?.pathname ||
        (user?.role === "admin"
          ? "/admin/dashboard"
          : "/dashboard");

      navigate(redirectTo, { replace: true });
    } catch (err) {
      const detail = err?.data?.detail;

      if (
        err?.status === 403 &&
        detail === "Email not verified."
      ) {
        setError("root", {
          message:
            "Your email isn't verified yet. Please verify it to log in.",
        });

        setUnverifiedEmail(values.email);
        return;
      }

      const message =
        detail ||
        err?.data?.non_field_errors?.[0] ||
        "Invalid email or password.";

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

      {/* Login Container */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">

        {/* Login Card */}
        <div className="relative w-full rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-xl sm:px-8 sm:py-9">

          {/* Close Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close login page"
          >
            <FiX size={20} />
          </button>

          {/* Header */}
          <div className="text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
              <FiLogIn size={24} />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Log in to continue to{" "}
              <span className="font-medium text-blue-600">
                Sociala
              </span>
              .
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
                <p>{errors.root.message}</p>

                {unverifiedEmail && (
                  <NavLink
                    to="/email-verify-resend-request"
                    state={{ email: unverifiedEmail }}
                    className="mt-1 inline-block font-medium underline hover:text-red-700"
                  >
                    Resend verification email
                  </NavLink>
                )}
              </div>
            )}

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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <NavLink
                  to="/password-reset"
                  className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 hover:underline"
                >
                  Forgot password?
                </NavLink>
              </div>

              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Log in"}

              {!isLoading && (
                <FiLogIn
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              )}
            </button>
          </form>

          {/* Signup */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <NavLink
                to="/signup"
                className="font-semibold text-blue-600 transition-colors hover:text-slate-900"
              >
                Sign up
              </NavLink>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Login;