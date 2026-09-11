import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema } from "../../validators/profileValidator";
import { INTEREST_OPTIONS } from "../../constants/interests";

const FIELD_LABELS = {
  full_name: "Full Name",
  bio: "Bio",
  location: "Location",
  date_of_birth: "Date of Birth",
  profile_image: "Profile Image",
  cover_image: "Cover Image",
  interests: "Interests",
};

const ProfileForm = ({ defaultValues, onSubmit, isSubmitting, submitLabel = "Save" }) => {
  const [imagePreview, setImagePreview] = useState(defaultValues?.profile_image || null);
  const [coverPreview, setCoverPreview] = useState(defaultValues?.cover_image || null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    mode: "onSubmit",
    reValidateMode: "onChange", // clears each error as soon as that field is fixed
    defaultValues: {
      full_name: defaultValues?.full_name || "",
      bio: defaultValues?.bio || "",
      location: defaultValues?.location || "",
      date_of_birth: defaultValues?.date_of_birth || "",
      interests: defaultValues?.interests?.map((i) => i.name || i) || [],
      profile_image: null,
      cover_image: null,
    },
  });

  const handleFileChange = (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue(field, file, { shouldValidate: true });
    const reader = new FileReader();
    reader.onload = () => {
      if (field === "profile_image") setImagePreview(reader.result);
      else setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const errorEntries = Object.entries(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Visible summary so a failed submit is never silent */}
      {errorEntries.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium mb-1">Please fix the following before submitting:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errorEntries.map(([field, err]) => (
              <li key={field}>
                {FIELD_LABELS[field] || field}: {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image</label>
        <div className="relative h-32 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
          {coverPreview && (
            <img src={coverPreview} alt="cover preview" className="w-full h-full object-cover" />
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => handleFileChange("cover_image", e)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        {errors.cover_image && (
          <p className="mt-1.5 text-xs text-red-600">{errors.cover_image.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Profile Image</label>
        <div className="relative w-24 h-24 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
          {imagePreview && (
            <img src={imagePreview} alt="avatar preview" className="w-full h-full object-cover" />
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => handleFileChange("profile_image", e)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        {errors.profile_image && (
          <p className="mt-1.5 text-xs text-red-600">{errors.profile_image.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-slate-700">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="full_name"
          type="text"
          {...register("full_name")}
          className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition ${
            errors.full_name
              ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
              : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          }`}
        />
        {errors.full_name && (
          <p className="mt-1.5 text-xs text-red-600">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-slate-700">
          Bio
        </label>
        <textarea
          id="bio"
          rows={3}
          {...register("bio")}
          className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition ${
            errors.bio
              ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
              : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          }`}
        />
        {errors.bio && <p className="mt-1.5 text-xs text-red-600">{errors.bio.message}</p>}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-slate-700">
          Location
        </label>
        <input
          id="location"
          type="text"
          {...register("location")}
          className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition ${
            errors.location
              ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
              : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          }`}
        />
        {errors.location && (
          <p className="mt-1.5 text-xs text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="date_of_birth" className="block text-sm font-medium text-slate-700">
          Date of Birth
        </label>
        <input
          id="date_of_birth"
          type="date"
          {...register("date_of_birth")}
          className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition ${
            errors.date_of_birth
              ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
              : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          }`}
        />
        {errors.date_of_birth && (
          <p className="mt-1.5 text-xs text-red-600">{errors.date_of_birth.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Interests <span className="font-normal text-slate-400">(pick up to 4)</span>
        </label>
        <Controller
          name="interests"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const selected = field.value?.includes(interest.value);
                const atLimit = (field.value?.length || 0) >= 4 && !selected;
                return (
                  <button
                    type="button"
                    key={interest.value}
                    disabled={atLimit}
                    onClick={() =>
                      field.onChange(
                        selected
                          ? field.value.filter((v) => v !== interest.value)
                          : [...(field.value || []), interest.value]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-sm border transition ${
                      selected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : atLimit
                        ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                        : "bg-white border-slate-200 text-slate-600 hover:border-blue-400"
                    }`}
                  >
                    {interest.label}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.interests && (
          <p className="mt-1.5 text-xs text-red-600">{errors.interests.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default ProfileForm;