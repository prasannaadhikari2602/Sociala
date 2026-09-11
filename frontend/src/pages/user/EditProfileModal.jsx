import { FiX } from "react-icons/fi";
import ProfileForm from "./ProfileForm";
import { useUpdateProfileMutation } from "../../features/profiles/profileApi";

const EditProfileModal = ({ profile, onClose }) => {
  const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();

  const handleSubmit = async (formValues) => {
    try {
      await updateProfile(formValues).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-xl sm:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error?.data?.detail || "Failed to save changes. Please try again."}
          </div>
        )}

        <ProfileForm
          defaultValues={profile}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditProfileModal;