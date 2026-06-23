import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRecipes, getTags } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import "./RecipeListPage.css";

export default function RecipeListPage() {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTags(token).then(setTags).catch(() => {});
  }, [token]);

  useEffect(() => {
    setLoading(true);
    const filters = activeTag ? { tags: activeTag } : {};
    getRecipes(token, filters)
      .then(setRecipes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, activeTag]);

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="recipe-list-page">
      <div className="recipe-list-page__header">
        <h1 className="recipe-list-page__title">My Recipes</h1>
        <div className="recipe-list-page__controls">
          <input
            className="recipe-list-page__search"
            type="search"
            placeholder="Search recipes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tag filter pills */}
      {tags.length > 0 && (
        <div className="recipe-list-page__controls recipe-list-page__controls--filters">
          <button
            className={`recipe-list-page__filter-btn${!activeTag ? " recipe-list-page__filter-btn--active" : ""}`}
            onClick={() => setActiveTag(null)}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={`recipe-list-page__filter-btn${activeTag === String(tag.id) ? " recipe-list-page__filter-btn--active" : ""}`}
              onClick={() => setActiveTag(String(tag.id))}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="recipe-list-page__loading">Loading recipes…</div>
      ) : (
        <div className="recipe-list-page__grid">
          {filtered.length === 0 ? (
            <div className="recipe-list-page__empty">
              <div className="recipe-list-page__empty-icon">🍳</div>
              <div className="recipe-list-page__empty-title">No recipes found</div>
              <p>Try a different search or add your first recipe.</p>
            </div>
          ) : (
            filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
