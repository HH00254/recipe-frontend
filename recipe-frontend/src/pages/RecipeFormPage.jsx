import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createRecipe,
  getRecipe,
  updateRecipe,
} from "../services/api";
import "../components/FormField.css";
import "./RecipeFormPage.css";

const EMPTY_FORM = {
  title: "",
  time_minutes: "",
  price: "",
  link: "",
  description: "",
};

export default function RecipeFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  /* Load existing recipe when editing */
  useEffect(() => {
    if (!isEdit) return;
    getRecipe(token, id)
      .then((recipe) => {
        setForm({
          title:        recipe.title,
          time_minutes: recipe.time_minutes,
          price:        recipe.price,
          link:         recipe.link || "",
          description:  recipe.description || "",
        });
        setTags(recipe.tags?.map((t) => t.name) ?? []);
        setIngredients(recipe.ingredients?.map((i) => i.name) ?? []);
      })
      .catch(() => setError("Failed to load recipe."))
      .finally(() => setLoading(false));
  }, [token, id, isEdit]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  /* Tags */
  function addTag() {
    const val = tagInput.trim();
    if (!val || tags.includes(val)) return;
    setTags((prev) => [...prev, val]);
    setTagInput("");
  }

  function removeTag(name) {
    setTags((prev) => prev.filter((t) => t !== name));
  }

  function handleTagKeyDown(e) {
    if (e.key === "Enter") { e.preventDefault(); addTag(); }
  }

  /* Ingredients */
  function addIngredient() {
    const val = ingredientInput.trim();
    if (!val || ingredients.includes(val)) return;
    setIngredients((prev) => [...prev, val]);
    setIngredientInput("");
  }

  function removeIngredient(name) {
    setIngredients((prev) => prev.filter((i) => i !== name));
  }

  function handleIngredientKeyDown(e) {
    if (e.key === "Enter") { e.preventDefault(); addIngredient(); }
  }

  /* Submit */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      ...form,
      time_minutes: Number(form.time_minutes),
      tags:         tags.map((name) => ({ name })),
      ingredients:  ingredients.map((name) => ({ name })),
    };

    try {
      if (isEdit) {
        await updateRecipe(token, id, payload);
        navigate(`/recipes/${id}`);
      } else {
        const created = await createRecipe(token, payload);
        navigate(`/recipes/${created.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="page-loading">Loading recipe…</div>;

  return (
    <div className="recipe-form-page">
      <button className="recipe-form-page__back" onClick={() => navigate(isEdit ? `/recipes/${id}` : "/")}>
        ← {isEdit ? "Back to recipe" : "Back to recipes"}
      </button>

      <h1 className="recipe-form-page__title">
        {isEdit ? "Edit Recipe" : "New Recipe"}
      </h1>

      <form className="recipe-form-page__form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Spaghetti Carbonara"
            required
            autoFocus
          />
        </div>

        {/* Time + Price */}
        <div className="recipe-form-page__row">
          <div className="form-group">
            <label htmlFor="time_minutes">Time (minutes) *</label>
            <input
              id="time_minutes"
              name="time_minutes"
              type="number"
              min="1"
              value={form.time_minutes}
              onChange={handleChange}
              placeholder="30"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="12.50"
              required
            />
          </div>
        </div>

        {/* Link */}
        <div className="form-group">
          <label htmlFor="link">Source link</label>
          <input
            id="link"
            name="link"
            type="url"
            value={form.link}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="recipe-form-page__textarea"
            value={form.description}
            onChange={handleChange}
            placeholder="How to make this dish…"
          />
        </div>

        {/* Tags */}
        <div>
          <div className="recipe-form-page__section-label">Tags</div>
          {tags.length > 0 && (
            <div className="recipe-form-page__tag-list">
              {tags.map((name) => (
                <span key={name} className="recipe-form-page__chip">
                  {name}
                  <button
                    type="button"
                    className="recipe-form-page__chip-remove"
                    onClick={() => removeTag(name)}
                    aria-label={`Remove tag ${name}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="recipe-form-page__add-row">
            <input
              className="recipe-form-page__add-input"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag…"
            />
            <button
              type="button"
              className="recipe-form-page__add-btn"
              onClick={addTag}
            >
              + Add
            </button>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div className="recipe-form-page__section-label">Ingredients</div>
          {ingredients.length > 0 && (
            <div className="recipe-form-page__ingredient-list">
              {ingredients.map((name) => (
                <span
                  key={name}
                  className="recipe-form-page__chip recipe-form-page__chip--ingredient"
                >
                  {name}
                  <button
                    type="button"
                    className="recipe-form-page__chip-remove recipe-form-page__chip-remove--ingredient"
                    onClick={() => removeIngredient(name)}
                    aria-label={`Remove ingredient ${name}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="recipe-form-page__add-row">
            <input
              className="recipe-form-page__add-input"
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={handleIngredientKeyDown}
              placeholder="Add an ingredient…"
            />
            <button
              type="button"
              className="recipe-form-page__add-btn"
              onClick={addIngredient}
            >
              + Add
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="recipe-form-page__footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(isEdit ? `/recipes/${id}` : "/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting
              ? isEdit ? "Saving…" : "Creating…"
              : isEdit ? "Save changes" : "Create recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}
