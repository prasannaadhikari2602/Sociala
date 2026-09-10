import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { LoginSchema } from "../../validators/LoginSchema";
import { useLoginMutation, useLazyGetMeQuery } from "../../features/auth/authApi";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (values) => {
    try {
      // LoginView only authenticates and sets the auth cookies — it
      // returns no profile data.
      await login(values).unwrap();

      // Fetch profile data (email/username/role) so we know where to
      // redirect. login()'s own onQueryStarted also dispatches getMe
      // internally to populate global auth state; this call just grabs
      // the result for the redirect decision below.
      const user = await getMe().unwrap();

      const redirectTo =
        location.state?.from?.pathname ||
        (user?.role === "admin" ? "/admin/dashboard" : "/dashboard");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // DRF typically returns { detail: "..." } or field-level errors.
      const message =
        err?.data?.detail ||
        err?.data?.non_field_errors?.[0] ||
        "Invalid email or password.";
      setError("root", { message });
    }
  };

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
      <p className="mt-1 text-sm text-slate-500">
        Welcome back — enter your details to continue.
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
            autoComplete="email"
            {...register("email")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <NavLink to="/password-reset" className="text-xs text-slate-500 hover:text-slate-800">
              Forgot password?
            </NavLink>
          </div>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <NavLink to="/signup" className="font-medium text-slate-900 hover:underline">
          Sign up
        </NavLink>
      </p>
    </section>
  );
};

export default Login;