import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useConfirmPasswordResetMutation } from "../../features/auth/authApi";

// Expects the reset link to look like /password-reset/confirm?uid=...&token=...
const PasswordResetConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [confirmReset, { isLoading }] = useConfirmPasswordResetMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async ({ newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    try {
      await confirmReset({
        uid: searchParams.get("uid"),
        token: searchParams.get("token"),
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();

      navigate("/login", {
        replace: true,
        state: { message: "Password updated. Log in with your new password." },
      });
    } catch (err) {
      setError("root", {
        message: err?.data?.detail || "This reset link is invalid or expired.",
      });
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold text-slate-900">Set a new password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        {errors.root && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {errors.root.message}
          </p>
        )}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
            New password
          </label>
          <input
            id="newPassword"
            type="password"
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