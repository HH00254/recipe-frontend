import { useNavigate } from "react-router-dom";
import "./RecipeCard.css";

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  return (
    <div className="recipe-card" onClick={() => navigate(`/recipes/${recipe.id}`)}>
      {recipe.image ? (
        <img className="recipe-card__image" src={recipe.image} alt={recipe.title} />
      ) : (
        <div className="recipe-card__image-placeholder">🍳</div>
      )}
      <div className="recipe-card__body">
        <div className="recipe-card__title">{recipe.title}</div>
        <div className="recipe-card__meta">
          <span>⏱ {recipe.time_minutes} min</span>
          <span>💰 ${recipe.price}</span>
        </div>
        {recipe.tags?.length > 0 && (
          <div className="recipe-card__tags">
            {recipe.tags.map((tag) => (
              <span key={tag.id} className="recipe-card__tag">{tag.name}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
