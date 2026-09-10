import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useLocation,
  useNavigate,
  NavLink,
} from "react-router-dom";

import {
  FiEye,
  FiEyeOff,
  FiX,
  FiLock,
  FiCheckCircle,
} from "react-icons/fi";

import { useConfirmPasswordResetMutation } from "../../features/auth/authApi";

// Expects to be reached via:
// navigate("/password-reset/confirm", { state: { email } })

const PasswordResetConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [confirmReset, { isLoading }] =
    useConfirmPasswordResetMutation();

  const email = location.state?.email;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // No email means the user reached this page directly
  if (!email) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-white px-4 py-10 sm:px-6">

        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-400/10 blur-[120px]" />

        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">

          <div className="relative w-full rounded-3xl border border-slate-200 bg-white px-6 py-8 text-center shadow-xl sm:px-8 sm:py-9">

            {/* Close Button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Go back"
            >
              <FiX size={20} />
            </button>

            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
              <FiLock size={24} />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              No reset in progress
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Please request a password reset first to receive
              a verification code.
            </p>

            <NavLink
              to="/password-reset"
              className="mt-6 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              Request reset code
            </NavLink>

          </div>
        </div>
      </section>
    );
  }

  const onSubmit = async ({
    code,
    newPassword,
    confirmPassword,
  }) => {
    // Confirm passwords
    if (newPassword !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match.",
      });
      return;
    }

    try {
      await confirmReset({
        email,
        code,
        new_password: newPassword,
      }).unwrap();

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Password updated. Log in with your new password.",
        },
      });
    } catch (err) {
      setError("root", {
        message:
          err?.data?.detail ||
          "Invalid or expired reset code.",
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

      {/* Reset Container */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">

        {/* Reset Card */}
        <div className="relative w-full rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-xl sm:px-8 sm:py-9">

          {/* Close Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Go back"
          >
            <FiX size={20} />
          </button>

          {/* Header */}
          <div className="text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
              <FiLock size={24} />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Set a new password
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the verification code we sent to
            </p>

            <p className="mt-1 break-all text-sm font-medium text-blue-600">
              {email}
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

            {/* Reset Code */}
            <div>

              <label
                htmlFor="code"
                className="block text-sm font-medium text-slate-700"
              >
                Reset code
              </label>

              <input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter reset code"
                {...register("code", {
                  required: "Reset code is required",
                })}
                className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-center text-lg font-semibold tracking-[0.4em] text-slate-900 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 outline-none transition ${
                  errors.code
                    ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                    : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                }`}
              />

              {errors.code && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.code.message}
                </p>
              )}

            </div>

            {/* New Password */}
            <div>

              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700"
              >
                New password
              </label>

              <div className="relative mt-2">

                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message:
                        "Password must be at least 8 characters.",
                    },
                  })}
                  className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition ${
                    errors.newPassword
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

              {errors.newPassword && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.newPassword.message}
                </p>
              )}

            </div>

            {/* Confirm Password */}
            <div>

              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700"
              >
                Confirm new password
              </label>

              <div className="relative mt-2">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Confirm your new password"
                  {...register("confirmPassword", {
                    required:
                      "Please confirm your new password.",
                  })}
                  className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                      : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition-colors hover:text-slate-700"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>

              </div>

              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                "Updating..."
              ) : (
                <>
                  Update password

                  <FiCheckCircle
                    size={17}
                    className="transition-transform group-hover:scale-105"
                  />
                </>
              )}
            </button>

          </form>

          {/* Bottom */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Remember your password?{" "}
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

export default PasswordResetConfirm;

