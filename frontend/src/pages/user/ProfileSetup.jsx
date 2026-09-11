import { useNavigate } from "react-router-dom";
import ProfileForm from "./ProfileForm";
import { useSetupProfileMutation } from "../../features/profiles/profileApi";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [setupProfile, { isLoading, error }] = useSetupProfileMutation();

  const handleSubmit = async (formValues) => {
    try {
      await setupProfile(formValues).unwrap();
      navigate("/profile", { replace: true });
    } catch (err) {
      console.error("Failed to set up profile", err);
    }
  };

  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-xl sm:px-8 sm:py-9">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Set up your profile
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Tell us a bit about yourself before you continue.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error?.data?.detail || "Something went wrong. Please try again."}
          </div>
        )}

        <ProfileForm
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          submitLabel="Complete Setup"
        />
      </div>
    </section>
  );
};

export default ProfileSetup;