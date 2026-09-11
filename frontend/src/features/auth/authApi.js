import { baseApi } from "../../services/api/baseApi";
import { setCredentials, logout } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({
        url: "api/accounts/signup",
        method: "POST",
        body,
      }),
    }),

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
          // error surfaces to the caller via the mutation's `error` state
        }
      },
    }),

    getMe: builder.query({
      query: () => "api/accounts/me",
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data }));
        } catch {
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
          dispatch(logout());
        }
      },
    }),

    verifyEmail: builder.mutation({
      query: (body) => ({
        url: "api/accounts/email-verify",
        method: "POST",
        body,
      }),
    }),

    resendEmailVerification: builder.mutation({
      query: (body) => ({
        url: "api/accounts/email-verify/resend",
        method: "POST",
        body,
      }),
    }),

    requestPasswordReset: builder.mutation({
      query: (body) => ({
        url: "api/accounts/password-reset/request",
        method: "POST",
        body,
      }),
    }),

    confirmPasswordReset: builder.mutation({
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