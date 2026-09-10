import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useVerifyEmailMutation } from "../../features/auth/authApi";

// Expects to be reached via navigate("/email-verify", { state: { email } })
// right after signup. The user types the OTP code sent to that email.
const EmailVerify = () => {
  const location = useLocation();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const email = location.state?.email;
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [message, setMessage] = useState("");

  // No email in state means this page was reached directly (e.g. a
  // refresh, or a bookmarked/shared link) rather than via the signup
  // flow, so there's nothing to verify against.
  if (!email) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          No email to verify
        </h1>
        <p className="mt-2 text-slate-600">
          Please sign up first to receive a verification code.
        </p>
        <NavLink
          to="/signup"
          className="mt-6 rounded-md bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Go to signup
        </NavLink>
      </section>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("idle");
    setMessage("");

    try {
      await verifyEmail({ email, code }).unwrap();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err?.data?.detail || "Invalid or expired code.");
    }
  };

  if (status === "success") {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Email verified</h1>
        <p className="mt-2 text-slate-600">You can now log in to your account.</p>
        <NavLink
          to="/login"
          className="mt-6 rounded-md bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Go to login
        </NavLink>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Verify your email</h1>
      <p className="mt-1 text-sm text-slate-500">
        Enter the code we sent to <span className="font-medium">{email}</span>.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        {status === "error" && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {message}
          </p>
        )}

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-slate-700">
            Verification code
          </label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !code}
          className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {isLoading ? "Verifying..." : "Verify email"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Didn't get a code? Check your spam folder, or{" "}
        <NavLink to="/signup" className="font-medium text-slate-900 hover:underline">
          sign up again
        </NavLink>
        .
      </p>
    </section>
  );
};

export default EmailVerify;