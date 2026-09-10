import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useLocation } from "react-router-dom";
import { z } from "zod";
import { useResendEmailVerificationMutation } from "../../features/auth/authApi";

const ResendSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
});

const EmailVerifyResendRequest = () => {
  const location = useLocation();
  const [resendEmailVerification, { isLoading }] = useResendEmailVerificationMutation();
  const [status, setStatus] = useState("idle"); // idle | sent | error
  const [message, setMessage] = useState("");
  const [sentEmail, setSentEmail] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ResendSchema),
    // Pre-fill if we arrived here from Login.jsx's "resend verification" link.
    defaultValues: { email: location.state?.email || "" },
  });

  const onSubmit = async (values) => {
    setStatus("idle");
    setMessage("");

    try {
      const res = await resendEmailVerification(values).unwrap();
      setStatus("sent");
      setSentEmail(values.email);
      setMessage(
        res?.detail || "If that account exists and isn't verified, a new code has been sent."
      );
    } catch (err) {
      setStatus("error");
      setMessage(err?.data?.detail || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">
        Resend verification code
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Enter your email and we'll send a new verification code if your account needs one.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        {status === "error" && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{message}</p>
        )}
        {status === "sent" && (
          <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {isLoading ? "Sending..." : "Resend code"}
        </button>
      </form>

      {status === "sent" && (
        <NavLink
          to="/email-verify"
          state={{ email: sentEmail }}
          className="mt-6 block w-full rounded-md border border-slate-300 py-2.5 text-center text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          I have my code — enter it
        </NavLink>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Remembered your password?{" "}
        <NavLink to="/login" className="font-medium text-slate-900 hover:underline">
          Log in
        </NavLink>
      </p>
    </section>
  );
};

export default EmailVerifyResendRequest;