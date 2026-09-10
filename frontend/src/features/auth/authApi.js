import { baseApi } from "../../services/api/baseApi";
import { setCredentials, logout } from "./authSlice";

/**
 * Maps 1:1 to backend/apps/accounts/urls.py, mounted at /api/accounts/
 * off the VITE_API_BASE_URL root (http://localhost:8000/api/):
 *   accounts/signup                     POST
 *   accounts/login                      POST
 *   accounts/logout                     POST
 *   accounts/me                         GET
 *   accounts/email-verify               POST
 *   accounts/email-verify/resend        POST
 *   accounts/password-reset/request     POST
 *   accounts/password-reset/confirm     POST
 *
 * Field names below are best-guess based on common DRF patterns —
 * line them up with your serializers.py if they differ.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      // body: { username, email, password, password2 }
      query: (body) => ({
        url: "api/accounts/signup",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation({
      // body: { email, password }
      // LoginView only authenticates and sets the auth cookies now — it
      // returns no profile data ({ detail: "..." } only). Profile data
      // is fetched separately via getMe.
      query: (body) => ({
        url: "api/accounts/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Login succeeded and the auth cookie is set — fetch the
          // profile data that used to come back in the login response.
          dispatch(authApi.endpoints.getMe.initiate());
        } catch {
          // error surfaces to the caller via the mutation's `error` state
        }
      },
    }),

    // Source of truth for user profile data (email/username/role). Call
    // on app load/refresh to rehydrate state — login's response no longer
    // carries it, and nothing is persisted client-side between sessions.
    getMe: builder.query({
      query: () => "api/accounts/me",
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data }));
        } catch {
          // Not authenticated (no/expired cookie) — leave state as logged out
          dispatch(logout());
        }
      },
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "api/accounts/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Clear local state regardless of whether the server call
          // succeeded, so the user is never stuck "logged in" on the client.
          dispatch(logout());
        }
      },
    }),

    verifyEmail: builder.mutation({
      // body: { email, code } — matches EmailVerifySerializer. This is an
      // OTP code the user types in, not a link/token from a URL.
      query: (body) => ({
        url: "api/accounts/email-verify",
        method: "POST",
        body,
      }),
    }),

    resendEmailVerification: builder.mutation({
      // body: { email } — matches ResendEmailVerificationSerializer
      query: (body) => ({
        url: "api/accounts/email-verify/resend",
        method: "POST",
        body,
      }),
    }),

    requestPasswordReset: builder.mutation({
      // body: { email }
      query: (body) => ({
        url: "api/accounts/password-reset/request",
        method: "POST",
        body,
      }),
    }),

    confirmPasswordReset: builder.mutation({
      // body: { email, code, new_password } — matches PasswordResetConfirmSerializer
      query: (body) => ({
        url: "api/accounts/password-reset/confirm",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLazyGetMeQuery,
  useGetMeQuery,
  useLogoutUserMutation,
  useVerifyEmailMutation,
  useResendEmailVerificationMutation,
  useRequestPasswordResetMutation,
  useConfirmPasswordResetMutation,
} = authApi;