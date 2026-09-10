import { useForm } from "react-hook-form";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { useConfirmPasswordResetMutation } from "../../features/auth/authApi";

// Expects to be reached via navigate("/password-reset/confirm", { state: { email } })
// right after requesting a reset. The user types the code sent to that email.
const PasswordResetConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [confirmReset, { isLoading }] = useConfirmPasswordResetMutation();

  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // No email in state means this page was reached directly (e.g. a
  // refresh) rather than via the reset-request flow, so there's nothing
  // to confirm against.
  if (!email) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          No reset in progress
        </h1>
        <p className="mt-2 text-slate-600">
          Please request a password reset first to receive a code.
        </p>
        <NavLink
          to="/password-reset"
          className="mt-6 rounded-md bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Request reset code
        </NavLink>
      </section>
    );
  }

  const onSubmit = async ({ code, newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
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
        state: { message: "Password updated. Log in with your new password." },
      });
    } catch (err) {
      setError("root", {
        message: err?.data?.detail || "Invalid or expired code.",
      });
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold text-slate-900">Set a new password</h1>
      <p className="mt-1 text-sm text-slate-500">
        Enter the code we sent to <span className="font-medium">{email}</span>.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        {errors.root && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {errors.root.message}
          </p>
        )}
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-slate-700">
            Reset code
          </label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            {...register("code", { required: true })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
            New password
          </label>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            {...register("newPassword", { required: true, minLength: 8 })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword", { required: true })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {isLoading ? "Updating..." : "Update password"}
        </button>
      </form>
    </section>
  );
};

export default PasswordResetConfirm;