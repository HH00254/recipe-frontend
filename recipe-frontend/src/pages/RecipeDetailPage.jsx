import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import { useAuth } from "../context/AuthContext";
import {
  deleteRecipe,
  getRecipe,
  uploadRecipeImage,
} from "../services/api";
import "../components/FormField.css";
import "./RecipeDetailPage.css";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [recipe, setRecipe]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [deleting, setDeleting]       = useState(false);

  useEffect(() => {
    setLoading(true);
    getRecipe(token, id)
      .then(setRecipe)
      .catch(() => setError("Recipe not found."))
      .finally(() => setLoading(false));
  }, [token, id]);

  // True when the logged-in user owns this recipe
  const isOwner = user && recipe && user.email === recipe.user_email;

  async function handleDelete() {
    if (!window.confirm("Delete this recipe? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteRecipe(token, id);
      navigate("/");
    } catch {
      setError("Failed to delete recipe.");
      setDeleting(false);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus("Uploading…");
    try {
      const updated = await uploadRecipeImage(token, id, file);
      setRecipe((prev) => ({ ...prev, image: updated.image }));
      setUploadStatus("Image updated!");
    } catch {
      setUploadStatus("Upload failed.");
    }
  }

  if (loading) return <div className="recipe-detail-page__loading">Loading…</div>;
  if (error)   return <div className="recipe-detail-page__error">{error}</div>;
  if (!recipe) return null;

  return (
    <div className="recipe-detail-page">
      <button className="recipe-detail-page__back" onClick={() => navigate("/")}>
        ← Back to recipes
      </button>

      {recipe.image ? (
        <img
          className="recipe-detail-page__hero"
          src={recipe.image}
          alt={recipe.title}
        />
      ) : (
        <div className="recipe-detail-page__hero-placeholder">🍳</div>
      )}

      {/* Only show upload button to the recipe owner */}
      {isOwner && (
        <div className="recipe-detail-page__upload">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="recipe-detail-page__upload-input"
            onChange={handleImageUpload}
          />
          <span
            className="recipe-detail-page__upload-label"
            onClick={() => fileRef.current.click()}
          >
            {recipe.image ? "Change image" : "Upload image"}
          </span>
          {uploadStatus && (
            <span className="recipe-detail-page__upload-status">{uploadStatus}</span>
          )}
        </div>
      )}

      <div className="recipe-detail-page__header">
        <h1 className="recipe-detail-page__title">{recipe.title}</h1>

        {/* Only show edit/delete to the recipe owner */}
        {isOwner && (
          <div className="recipe-detail-page__actions">
            <button
              className="btn-secondary"
              onClick={() => navigate(`/recipes/${id}/edit`)}
            >
              ✏️ Edit
            </button>
            <button
              className="btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "🗑 Delete"}
            </button>
          </div>
        )}
      </div>

      <div className="recipe-detail-page__meta">
        <div className="recipe-detail-page__meta-item">
          ⏱ <strong>{recipe.time_minutes} min</strong>
        </div>
        <div className="recipe-detail-page__meta-item">
          💰 <strong>${recipe.price}</strong>
        </div>
        {recipe.link && (
          <div className="recipe-detail-page__meta-item">
            <a
              className="recipe-detail-page__link"
              href={recipe.link}
              target="_blank"
              rel="noreferrer"
            >
              🔗 Source link
            </a>
          </div>
        )}
      </div>

      {recipe.tags?.length > 0 && (
        <div className="recipe-detail-page__tags">
          {recipe.tags.map((tag) => (
            <span key={tag.id} className="recipe-detail-page__tag">
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {recipe.description && (
        <>
          <h2 className="recipe-detail-page__section-title">About</h2>
          <p className="recipe-detail-page__description">{recipe.description}</p>
        </>
      )}

      {recipe.ingredients?.length > 0 && (
        <>
          <h2 className="recipe-detail-page__section-title">Ingredients</h2>
          <ul className="recipe-detail-page__ingredients">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id} className="recipe-detail-page__ingredient">
                {ing.name}
              </li>
            ))}
          </ul>
        </>
      )}

      <hr className="recipe-detail-page__divider" />

      <CommentSection recipeId={id} />
    </div>
  );
}
