//  import { useState } from "react";
// import Layout from "../components/Layout";
// import { useAuth } from "../context/AuthContext";
// import toast from "react-hot-toast";
 
//  import { updateProfile, updatePassword, } from "../services/settingsService";

// const Settings = () => {
//   const { state, dispatch } = useAuth();

//   const [profile, setProfile] = useState({
//     name: state.user?.name || "Sunny Raj",
//     email: state.user?.email || "sunny@example.com",
//   });

//   const [passwords, setPasswords] = useState({
//     current: "",
//     next: "",
//     confirm: "",
//   });

//   const saveProfile = async (e) => {
//   e.preventDefault();

//   try {
//     const updatedUser = await updateProfile(profile);

//     dispatch({
//       type: "LOAD_USER",
//       payload: updatedUser,
//     });

//     toast.success("Profile updated successfully");
//   } catch (error) {
//     toast.error(error.response?.data?.message || "Failed to update profile");
//     console.log("message:",error)
//   }
// };

//    const changePassword = async (e) => {
//   e.preventDefault();

//   if (passwords.next !== passwords.confirm) {
//     toast.error("Passwords do not match");
//     return;
//   }

//   try {
//     await updatePassword({
//       currentPassword: passwords.current,
//       newPassword: passwords.next,
//     });

//     toast.success("Password updated successfully");

//     setPasswords({ current: "", next: "", confirm: "" });
//   } catch (error) {
//     toast.error(error.response?.data?.message || "Failed to update password");
//   }
// };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     dispatch({ type: "LOGOUT" });
//     window.location.href = "/dashboard";
//   };
// console.log(localStorage.getItem("token"))
  

import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { updateProfile, updatePassword } from "../services/settingsService";

const Settings = () => {
  const { state, dispatch } = useAuth();

  const [profile, setProfile] = useState({
    name: state.user?.name || "",
    email: state.user?.email || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = await updateProfile(profile);

      dispatch({
        type: "LOAD_USER",
        payload: updatedUser,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (passwords.next !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await updatePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });

      toast.success("Password updated successfully");

      setPasswords({
        current: "",
        next: "",
        confirm: "",
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };
  
  return (
    <Layout title="Settings">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="content-card mb-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 64, height: 64, fontSize: 24 }}>
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h5 className="fw-bold mb-1">{profile.name}</h5>
                <p className="text-muted mb-0">Administrator</p>
              </div>
            </div>

            <h6 className="fw-bold mb-3">Profile Information</h6>

            <form onSubmit={saveProfile}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
              </div>

               <button type="submit" className="btn btn-primary rounded-pill px-4 mt-4" > Save Changes </button>
            </form>
          </div>

          <div className="content-card">
            <h6 className="fw-bold mb-3">Change Password</h6>

            <form onSubmit={changePassword}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwords.next}
                    onChange={(e) =>
                      setPasswords({ ...passwords, next: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                  />
                </div>
              </div>

               <button type="submit" className="btn btn-outline-primary rounded-pill px-4 mt-4" > Update Password </button> 
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="content-card mb-4">
            <h6 className="fw-bold mb-3">Application</h6>

            <div className="d-flex justify-content-between py-2 border-bottom">
              <span>Version</span>
              <span className="text-muted">1.0.0</span>
            </div>

            <div className="d-flex justify-content-between py-2 border-bottom">
              <span>Environment</span>
              <span className="text-muted">Development</span>
            </div>

            <div className="d-flex justify-content-between py-2">
              <span>API URL</span>
              <span className="text-muted small text-break text-end ms-3">
                {import.meta.env.VITE_API_URL}
              </span>
            </div>
          </div>

          <div className="content-card mb-4">
            <h6 className="fw-bold mb-3">Appearance</h6>

            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" disabled />
              <label className="form-check-label text-muted">
                Dark Mode (coming soon)
              </label>
            </div>

            <button className="btn btn-light w-100 rounded-pill" disabled>
              Customize Theme
            </button>
          </div>

          <div className="content-card border border-danger-subtle">
            <h6 className="fw-bold text-danger mb-2">Danger Zone</h6>
            <p className="text-muted small mb-3">
              Sign out from this device.
            </p>

            <button
              className="btn btn-danger w-100 rounded-pill"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;