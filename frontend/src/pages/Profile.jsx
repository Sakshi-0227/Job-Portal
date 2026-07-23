import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formState, setFormState] = useState({});
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormState({
        name: user.name,
        email: user.email,
        ...(user.role === "candidate"
          ? { ...user.candidateProfile, skills: user.candidateProfile?.skills?.join(", ") || "" }
          : user.recruiterProfile),
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    try {
      const profileData = user.role === "candidate"
        ? { candidateProfile: { ...formState, skills: formState.skills?.split(",").map((item) => item.trim()).filter(Boolean) } }
        : { recruiterProfile: formState };
      await updateProfile(profileData);
      setStatus("Profile updated successfully.");
    } catch (error) {
      setStatus("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div className="rounded-xl bg-white p-8 shadow-sm">Login to view your profile.</div>;
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
      <p className="mt-2 text-slate-600">Update your information and keep your profile fresh.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            name="name"
            value={formState.name || ""}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            name="email"
            value={formState.email || ""}
            disabled
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3"
          />
        </label>
        {user.role === "candidate" ? (
          <>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Location</span>
              <input name="location" value={formState.location || ""} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Experience</span>
              <input name="experience" value={formState.experience || ""} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Skills</span>
              <input name="skills" value={formState.skills || ""} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none" placeholder="Comma separated" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Bio</span>
              <textarea name="bio" value={formState.bio || ""} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none" rows="4" />
            </label>
          </>
        ) : (
          <>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Company Name</span>
              <input name="companyName" value={formState.companyName || ""} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Company Website</span>
              <input name="companyWebsite" value={formState.companyWebsite || ""} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Description</span>
              <textarea name="companyDescription" value={formState.companyDescription || ""} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none" rows="4" />
            </label>
          </>
        )}
        {status && <p className="text-sm text-slate-700">{status}</p>}
        <button disabled={saving} className="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800 disabled:opacity-70">
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
