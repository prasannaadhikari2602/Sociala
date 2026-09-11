import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from "../../features/auth/authApi";

// =========================================================
// PASSWORD INPUT COMPONENT
// =========================================================
// IMPORTANT: this must live OUTSIDE UserSettings. If it's defined
// inside the component body, React sees a new component "type" on
// every re-render (e.g. every keystroke) and unmounts/remounts the
// <input>, which makes it lose focus after each character typed.
const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
  disabled,
  placeholder,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
        />

        <button
          type="button"
          onClick={() => setShowPassword((previous) => !previous)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 disabled:opacity-50"
        >
          {showPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
        </button>
      </div>
    </div>
  );
};

const UserSettings = () => {
  const navigate = useNavigate();

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // =========================================================
  // DELETE ACCOUNT
  // =========================================================

  const [deleteAccount, { isLoading: isDeletingAccount }] =
    useDeleteAccountMutation();

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] =
    useState(false);

  const [showDeletePasswordModal, setShowDeletePasswordModal] =
    useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");

  // =========================================================
  // MODAL BODY SCROLL
  // =========================================================

  useEffect(() => {
    const modalOpen =
      showPasswordModal || showDeleteConfirmModal || showDeletePasswordModal;

    document.body.style.overflow = modalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showPasswordModal, showDeleteConfirmModal, showDeletePasswordModal]);

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const openPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    if (isChangingPassword) return;

    setShowPasswordModal(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordError("");
    setPasswordSuccess("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword.trim()) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (!newPassword.trim()) {
      setPasswordError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (!confirmPassword.trim()) {
      setPasswordError("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      const response = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();

      setPasswordSuccess(response?.detail || "Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1200);
    } catch (error) {
      setPasswordError(
        error?.data?.detail || "Unable to change your password. Please try again."
      );
    }
  };

  // =========================================================
  // DELETE ACCOUNT
  // =========================================================

  const openDeleteConfirmModal = () => {
    setDeleteError("");
    setDeleteSuccess("");
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirmModal(false);

    setDeletePassword("");
    setDeleteError("");
    setDeleteSuccess("");
    setShowDeletePassword(false);

    setShowDeletePasswordModal(true);
  };

  const closeDeletePasswordModal = () => {
    if (isDeletingAccount) return;

    setShowDeletePasswordModal(false);

    setDeletePassword("");
    setDeleteError("");
    setDeleteSuccess("");
    setShowDeletePassword(false);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    setDeleteError("");
    setDeleteSuccess("");

    if (!deletePassword.trim()) {
      setDeleteError("Please enter your password.");
      return;
    }

    try {
      await deleteAccount({
        password: deletePassword,
      }).unwrap();

      setDeleteSuccess("Your account has been deleted successfully.");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1000);
    } catch (error) {
      setDeleteError(
        error?.data?.detail || "Unable to delete your account. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-900">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Account
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Settings
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
            Manage your account and security preferences.
          </p>
        </div>
      </section>

      {/* =====================================================
          SETTINGS CONTENT
      ====================================================== */}

      <main className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* =================================================
              ACCOUNT SETTINGS
          ================================================== */}

          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
                <h2 className="text-xl font-semibold text-slate-900">
                  Account Settings
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Manage your account security and account access.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {/* =========================================
                    CHANGE PASSWORD
                ========================================== */}

                <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <FiLock size={21} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Change Password
                      </h3>

                      <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
                        Update your password to keep your account secure.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openPasswordModal}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    <FiLock size={17} />
                    Change Password
                  </button>
                </div>

                {/* =========================================
                    DELETE ACCOUNT
                ========================================== */}

                <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                      <FiTrash2 size={21} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Delete Account
                      </h3>

                      <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
                        Permanently delete your account and all associated
                        data. This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openDeleteConfirmModal}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-100"
                  >
                    <FiTrash2 size={17} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              SECURITY INFORMATION
          ================================================== */}

          <div className="h-fit rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiLock size={25} />
            </div>

            <h2 className="mt-6 text-xl font-semibold text-slate-900">
              Keep your account secure
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Use a strong password that you do not use on other websites.
              Never share your password with anyone.
            </p>
          </div>
        </div>
      </main>

      {/* =====================================================
          CHANGE PASSWORD MODAL
      ====================================================== */}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl">
            {/* Close */}
            <button
              type="button"
              onClick={closePasswordModal}
              disabled={isChangingPassword}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              <FiX size={20} />
            </button>

            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiLock size={25} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Change your password
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your current password and choose a new password for your
              account.
            </p>

            <form onSubmit={handleChangePassword} className="mt-6 space-y-5">
              <PasswordInput
                id="current-password"
                label="Current password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setPasswordError("");
                }}
                showPassword={showCurrentPassword}
                setShowPassword={setShowCurrentPassword}
                disabled={isChangingPassword}
                placeholder="Enter current password"
              />

              <PasswordInput
                id="new-password"
                label="New password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError("");
                }}
                showPassword={showNewPassword}
                setShowPassword={setShowNewPassword}
                disabled={isChangingPassword}
                placeholder="Enter new password"
              />

              <PasswordInput
                id="confirm-password"
                label="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError("");
                }}
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
                disabled={isChangingPassword}
                placeholder="Confirm new password"
              />

              {/* Password Hint */}
              <p className="text-xs text-slate-400">
                Your new password must contain at least 8 characters.
              </p>

              {/* Error */}
              {passwordError && (
                <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  <FiAlertTriangle className="mt-0.5 shrink-0" size={17} />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Success */}
              {passwordSuccess && (
                <div className="flex items-start gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                  <FiCheckCircle className="mt-0.5 shrink-0" size={17} />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={isChangingPassword}
                  className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isChangingPassword ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isChangingPassword ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiLock size={17} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ====================================================== */}

      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl">
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowDeleteConfirmModal(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <FiX size={20} />
            </button>

            {/* Warning */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FiAlertTriangle size={26} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Delete your account?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Are you sure you want to delete your account? Your profile,
              posts, comments, reactions, and other associated data will be
              permanently deleted.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(false)}
                className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-md bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Yes, Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE PASSWORD MODAL
      ====================================================== */}

      {showDeletePasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl">
            {/* Close */}
            <button
              type="button"
              onClick={closeDeletePasswordModal}
              disabled={isDeletingAccount}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              <FiX size={20} />
            </button>

            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FiLock size={25} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Confirm your password
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your current password to permanently delete your
              ShareNest account.
            </p>

            <form onSubmit={handleDeleteAccount} className="mt-6">
              <PasswordInput
                id="delete-password"
                label="Current password"
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value);
                  setDeleteError("");
                }}
                showPassword={showDeletePassword}
                setShowPassword={setShowDeletePassword}
                disabled={isDeletingAccount}
                placeholder="Enter your password"
              />

              {/* Error */}
              {deleteError && (
                <div className="mt-4 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  <FiAlertTriangle className="mt-0.5 shrink-0" size={17} />
                  <span>{deleteError}</span>
                </div>
              )}

              {/* Success */}
              {deleteSuccess && (
                <div className="mt-4 flex items-start gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                  <FiCheckCircle className="mt-0.5 shrink-0" size={17} />
                  <span>{deleteSuccess}</span>
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDeletePasswordModal}
                  disabled={isDeletingAccount}
                  className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isDeletingAccount || !deletePassword}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeletingAccount ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 size={17} />
                      Permanently Delete
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings;