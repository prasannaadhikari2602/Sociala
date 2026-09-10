import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRequestPasswordResetMutation } from "../../features/auth/authApi";

const PasswordResetRequest = () => {
  const navigate = useNavigate();
  const [requestReset, { isLoading }] = useRequestPasswordResetMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      await requestReset({ email }).unwrap();

      // Backend expects { email, code, new_password } on confirm, not a
      // uid/token link — so once the code has been sent, go straight to
      // the code-entry page, carrying the email in route state.
      navigate("/password-reset/confirm", {
        replace: true,
        state: { email },
      });
    } catch (err) {
      setError("root", {
        message: err?.data?.detail || "Couldn't send the reset email. Try again.",
      });
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold text-slate-900">Reset your password</h1>
      <p className="mt-1 text-sm text-slate-500">
        Enter your email and we'll send you a reset code.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        {errors.root && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {errors.root.message}
          </p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: true })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {isLoading ? "Sending..." : "Send reset code"}
        </button>
      </form>
    </section>
  );
};

export default PasswordResetRequest;