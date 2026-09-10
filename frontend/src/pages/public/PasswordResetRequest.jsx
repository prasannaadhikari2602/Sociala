
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiMail, FiX, FiArrowRight } from "react-icons/fi";

import { useRequestPasswordResetMutation } from "../../features/auth/authApi";

const PasswordResetRequest = () => {
  const navigate = useNavigate();

  const [requestReset, { isLoading }] =
    useRequestPasswordResetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      await requestReset({ email }).unwrap();

      // Backend expects:
      // { email, code, new_password }
      //
      // After sending the code, move to the confirmation page
      // and pass the email through route state.
      navigate("/password-reset/confirm", {
        replace: true,
        state: { email },
      });
    } catch (err) {
      setError("root", {
        message:
          err?.data?.detail ||
          "Couldn't send the reset email. Try again.",
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
              <FiMail size={24} />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Reset your password
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the email address associated with your account.
              We'll send you a verification code to reset your password.
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
                {...register("email", {
                  required: "Email is required",
                })}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                "Sending..."
              ) : (
                <>
                  Send reset code

                  <FiArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>

          </form>

          {/* Bottom */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-blue-600 transition-colors hover:text-slate-900"
              >
                Log in
              </button>
            </p>

          </div>

        </div>
      </div>
    </section>
  );
};

export default PasswordResetRequest;

