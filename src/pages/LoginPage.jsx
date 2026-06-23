import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/FormField.css";
import "./LoginPage.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">🍽️</div>
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">Log in to your recipe collection</p>
        </div>

        <form className="auth-card__form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account?{" "}
          <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
