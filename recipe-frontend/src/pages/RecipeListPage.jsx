import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRecipes, getTags } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import "./RecipeListPage.css";

const TABS = [
  { key: "all",  label: "All Recipes" },
  { key: "mine", label: "My Recipes"  },
];

export default function RecipeListPage() {
  const { token } = useAuth();
  const [recipes, setRecipes]     = useState([]);
  const [tags, setTags]           = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [activeTag, setActiveTag] = useState(null);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getTags(token).then(setTags).catch(() => {});
  }, [token]);

  useEffect(() => {
    setLoading(true);
    const filters = {};
    if (activeTag)        filters.tags = activeTag;
    if (activeTab === "mine") filters.mine = 1;

    getRecipes(token, filters)
      .then(setRecipes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, activeTab, activeTag]);

  // Reset tag filter when switching tabs
  function handleTabChange(tab) {
    setActiveTab(tab);
    setActiveTag(null);
  }

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="recipe-list-page">
      <div className="recipe-list-page__header">
        <h1 className="recipe-list-page__title">
          {activeTab === "all" ? "All Recipes" : "My Recipes"}
        </h1>
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

      {/* All / My Recipes tabs */}
      <div className="recipe-list-page__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`recipe-list-page__tab${activeTab === tab.key ? " recipe-list-page__tab--active" : ""}`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tag filter pills — only visible on My Recipes where tags are relevant */}
      {activeTab === "mine" && tags.length > 0 && (
        <div className="recipe-list-page__controls recipe-list-page__controls--filters">
          <button
            className={`recipe-list-page__filter-btn${!activeTag ? " recipe-list-page__filter-btn--active" : ""}`}
            onClick={() => setActiveTag(null)}
          >
            All tags
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
              <div className="recipe-list-page__empty-title">
                {activeTab === "mine"
                  ? "You haven't created any recipes yet"
                  : "No recipes found"}
              </div>
              <p>
                {activeTab === "mine"
                  ? "Click \"+ New Recipe\" to create your first one."
                  : "Try a different search term."}
              </p>
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
