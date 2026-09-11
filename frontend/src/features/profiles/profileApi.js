import { baseApi } from "../../services/api/baseApi";

const buildFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // Ignore empty values
    if (value === undefined || value === null || value === "") {
      return;
    }

    // Multiple interests
    if (key === "interests" && Array.isArray(value)) {
      value.forEach((id) => {
        formData.append("interests", id);
      });
    }

    // Image files
    else if (key === "profile_image" || key === "cover_image") {
      if (value instanceof File) {
        formData.append(key, value);
      }
    }

    // Normal fields
    else {
      formData.append(key, value);
    }
  });

  return formData;
};

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/profiles/me/
    getMyProfile: builder.query({
      query: () => "api/profiles/me/",
      providesTags: ["Profile"],
    }),

    // POST /api/profiles/setup/
    setupProfile: builder.mutation({
      query: (data) => ({
        url: "api/profiles/setup/",
        method: "POST",
        body: buildFormData(data),
      }),
      invalidatesTags: ["Profile"],
    }),

    // PATCH /api/profiles/me/
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "api/profiles/me/",
        method: "PATCH",
        body: buildFormData(data),
      }),
      invalidatesTags: ["Profile"],
    }),

    // GET /api/profiles/<user_id>/
    getProfileByUserId: builder.query({
      query: (userId) => `api/profiles/${userId}/`,
      providesTags: (result, error, userId) => [
        { type: "Profile", id: userId },
      ],
    }),

    // GET /api/profiles/interests/
    listInterests: builder.query({
      query: () => "api/profiles/interests/",
      providesTags: ["Interest"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetMyProfileQuery,
  useSetupProfileMutation,
  useUpdateProfileMutation,
  useGetProfileByUserIdQuery,
  useListInterestsQuery,
} = profileApi;