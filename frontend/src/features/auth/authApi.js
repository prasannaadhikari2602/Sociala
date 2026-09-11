import { baseApi } from "../../services/api/baseApi";
import { setCredentials, logout } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --------------------------------
    // SIGNUP
    // --------------------------------
    signup: builder.mutation({
      query: (body) => ({
        url: "api/accounts/signup",
        method: "POST",
        body,
      }),
    }),

    // --------------------------------
    // LOGIN
    // --------------------------------
    login: builder.mutation({
      query: (body) => ({
        url: "api/accounts/login",
        method: "POST",
        body,
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(authApi.endpoints.getMe.initiate());
        } catch {
          // Login error is handled by the component.
        }
      },
    }),

    // --------------------------------
    // GET CURRENT USER
    // --------------------------------
    getMe: builder.query({
      query: () => "api/accounts/me",

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setCredentials({
              user: data,
            }),
          );
        } catch {
          dispatch(logout());
        }
      },
    }),

    // --------------------------------
    // LOGOUT
    // --------------------------------
    logoutUser: builder.mutation({
      query: () => ({
        url: "api/accounts/logout",
        method: "POST",
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
        }
      },
    }),

    // --------------------------------
    // DELETE ACCOUNT
    // --------------------------------
    deleteAccount: builder.mutation({
      query: (body) => ({
        url: "api/accounts/delete-account",
        method: "POST",
        body,
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // Clear Redux authentication state.
          dispatch(logout());
        } catch {
          // The component handles the error.
        }
      },
    }),

    // --------------------------------
    // EMAIL VERIFICATION
    // --------------------------------
    verifyEmail: builder.mutation({
      query: (body) => ({
        url: "api/accounts/email-verify",
        method: "POST",
        body,
      }),
    }),

    // --------------------------------
    // RESEND EMAIL VERIFICATION
    // --------------------------------
    resendEmailVerification: builder.mutation({
      query: (body) => ({
        url: "api/accounts/email-verify/resend",
        method: "POST",
        body,
      }),
    }),

    // --------------------------------
    // PASSWORD RESET REQUEST
    // --------------------------------
    requestPasswordReset: builder.mutation({
      query: (body) => ({
        url: "api/accounts/password-reset/request",
        method: "POST",
        body,
      }),
    }),

    // --------------------------------
    // PASSWORD RESET CONFIRM
    // --------------------------------
    confirmPasswordReset: builder.mutation({
      query: (body) => ({
        url: "api/accounts/password-reset/confirm",
        method: "POST",
        body,
      }),
    }),

    changePassword: builder.mutation({
      query: (body) => ({
        url: "api/accounts/change-password",
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
  useDeleteAccountMutation,
  useChangePasswordMutation,
} = authApi;
