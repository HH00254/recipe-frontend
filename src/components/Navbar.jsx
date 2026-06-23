import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
    setOpen(false);
  }

  function close() {
    setOpen(false);
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar__brand" onClick={close}>
          <span className="navbar__brand-icon">🍽️</span>
          RecipeApp
        </Link>

        {/* Desktop actions */}
        <div className="navbar__actions">
          {token ? (
            <>
              {user && <span className="navbar__user">Hi, {user.name}</span>}
              <Link to="/recipes/new" className="navbar__btn navbar__btn--outline">
                + New Recipe
              </Link>
              <button className="navbar__btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__link">Log in</Link>
              <Link to="/register" className="navbar__btn">Sign up</Link>
            </>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className={`navbar__hamburger${open ? " navbar__hamburger--open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`navbar__drawer${open ? " navbar__drawer--open" : ""}`}>
        {token ? (
          <>
            {user && <div className="navbar__drawer-user">Hi, {user.name}</div>}
            <Link
              to="/recipes/new"
              className="navbar__drawer-link"
              onClick={close}
            >
              + New Recipe
            </Link>
            <button className="navbar__drawer-btn" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__drawer-link" onClick={close}>
              Log in
            </Link>
            <Link to="/register" className="navbar__drawer-link" onClick={close}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </>
  );
}
