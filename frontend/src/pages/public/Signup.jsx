import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
        err?.data && typeof err.data === "object" ? err.data : {};

      const firstFieldError = Object.values(fieldErrors)[0];

      const message = Array.isArray(firstFieldError)
        ? firstFieldError[0]
        : firstFieldError || "Something went wrong. Please try again.";

      setError("root", {
        message,
      });
    }
  };

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">
        Create your account
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Join Sociala in under a minute.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
        noValidate
      >
        {errors.root && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {errors.root.message}
          </p>
        )}

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
            {...register("username")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />

          {errors.username && (
            <p className="mt-1 text-xs text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

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
            {...register("email")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password2"
            className="block text-sm font-medium text-slate-700"
          >
            Confirm password
          </label>

          <input
            id="password2"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            {...register("password2")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />

          {errors.password2 && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password2.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <NavLink
          to="/login"
          className="font-medium text-slate-900 hover:underline"
        >
          Log in
        </NavLink>
      </p>
    </section>
  );
};

export default Signup;