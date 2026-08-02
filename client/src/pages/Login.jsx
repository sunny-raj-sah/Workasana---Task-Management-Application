import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(form);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: data,
      });

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card border-0 shadow-sm rounded-4" style={{ width: "100%", maxWidth: 420 }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64, fontSize: 24 }}>
              W
            </div>
            <h3 className="fw-bold mb-1">Welcome back</h3>
            <p className="text-muted mb-0">Sign in to continue to Workasana</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control form-control-lg rounded-3"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control form-control-lg rounded-3"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            <button
              className="btn btn-primary btn-lg w-100 rounded-3"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-muted mt-4 mb-0">
            Don't have an account?{" "}
            <Link to="/signup" className="text-decoration-none fw-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;